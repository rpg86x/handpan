# Bouwt de Android-app (zonder Gradle): aapt2 -> javac -> d8 -> zipalign -> apksigner.
# De app is dezelfde index.html als op Windows; die wordt bij elke bouw uit de map erboven gehaald.
# Uitvoer: android\out\<naam>-<versie>.apk   Gebruik: .\build.ps1 [-Install]
param([switch]$Install)
# 'Continue': hulpprogramma's schrijven meldingen naar stderr; fouten worden via de exitcode (Check) afgevangen
$ErrorActionPreference = 'Continue'
$keyPass = 'handpan'   # wachtwoord van data\release.keystore; nodig voor updates
$root = $PSScriptRoot
$java = 'C:\Program Files\Android\Android Studio\jbr\bin'
$sdk = "$env:LOCALAPPDATA\Android\Sdk"
$bt = "$sdk\build-tools\36.0.0"
$jar = "$sdk\platforms\android-36\android.jar"
$build = "$root\build"
$out = "$root\out"
$manifest = ([xml](Get-Content "$root\AndroidManifest.xml")).manifest
$version = $manifest.versionName
$name = $manifest.application.label -replace ' ', '-'
function Check($step) { if ($LASTEXITCODE -ne 0) { throw "Mislukt: $step" } }

Remove-Item -Recurse -Force $build, "$root\assets" -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force "$build\classes", "$build\dex", "$build\gen", "$root\assets", "$root\data", $out | Out-Null
Copy-Item "$root\..\index.html", "$root\..\studio.js", "$root\..\logo.png" "$root\assets" -Force

# Starticoon in alle schermdichtheden, verkleind uit het logo van de Windows-app
Add-Type -AssemblyName System.Drawing
$logo = [System.Drawing.Image]::FromFile("$root\..\logo.png")
try {
  foreach ($d in @{ mdpi = 48; hdpi = 72; xhdpi = 96; xxhdpi = 144; xxxhdpi = 192 }.GetEnumerator()) {
    $dir = "$root\res\mipmap-$($d.Key)"
    New-Item -ItemType Directory -Force $dir | Out-Null
    $bmp = New-Object System.Drawing.Bitmap $d.Value, $d.Value
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = 'HighQualityBicubic'; $g.SmoothingMode = 'HighQuality'; $g.PixelOffsetMode = 'HighQuality'
    $g.DrawImage($logo, 0, 0, $d.Value, $d.Value)
    $g.Dispose(); $bmp.Save("$dir\ic_launcher.png", [System.Drawing.Imaging.ImageFormat]::Png); $bmp.Dispose()
  }
} finally { $logo.Dispose() }

& "$bt\aapt2.exe" compile --dir "$root\res" -o "$build\res.zip"; Check 'resources compileren'
& "$bt\aapt2.exe" link -o "$build\unsigned.apk" -I $jar --manifest "$root\AndroidManifest.xml" -A "$root\assets" --java "$build\gen" "$build\res.zip"; Check 'resources linken'

$sources = @(Get-ChildItem "$root\src", "$build\gen" -Recurse -Filter *.java | ForEach-Object FullName)
& "$java\javac.exe" -encoding UTF-8 --release 8 -nowarn -Xlint:-options -Xlint:-deprecation -classpath $jar -d "$build\classes" @sources; Check 'Java compileren'
$classes = @(Get-ChildItem "$build\classes" -Recurse -Filter *.class | ForEach-Object FullName)
& "$java\java.exe" -cp "$bt\lib\d8.jar" com.android.tools.r8.D8 --min-api 26 --lib $jar --output "$build\dex" @classes; Check 'dex'

Copy-Item "$build\unsigned.apk" "$build\with-dex.apk"
Push-Location "$build\dex"
try { & "$java\jar.exe" uf "$build\with-dex.apk" classes.dex; Check 'dex toevoegen' } finally { Pop-Location }
& "$bt\zipalign.exe" -f 4 "$build\with-dex.apk" "$build\aligned.apk"; Check 'zipalign'

# Eigen ondertekeningssleutel; bewaar deze map: updates moeten met dezelfde sleutel ondertekend zijn
$key = "$root\data\release.keystore"
if (!(Test-Path $key)) {
  & "$java\keytool.exe" -genkeypair -keystore $key -storepass $keyPass -alias app -keypass $keyPass -dname "CN=$($manifest.application.label)" -keyalg RSA -keysize 2048 -validity 10000; Check 'sleutel maken'
}
$apk = "$out\$name-$version.apk"
& "$java\java.exe" -jar "$bt\lib\apksigner.jar" sign --ks $key --ks-key-alias app --ks-pass "pass:$keyPass" --key-pass "pass:$keyPass" --out $apk "$build\aligned.apk"; Check 'ondertekenen'
& "$java\java.exe" -jar "$bt\lib\apksigner.jar" verify $apk; Check 'handtekening controleren'
Write-Host "Klaar: $apk"

if ($Install) {
  $adb = "$env:LOCALAPPDATA\Microsoft\WinGet\Packages\Google.PlatformTools_Microsoft.Winget.Source_8wekyb3d8bbwe\platform-tools\adb.exe"
  & $adb install -r $apk; Check 'installeren'
}
