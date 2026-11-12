' Start Handpan als eigen app-venster (Microsoft Edge app-modus). Geen server nodig.
Set sh = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
dir = fso.GetParentFolderName(WScript.ScriptFullName)

url = "file:///" & Replace(Replace(dir & "\index.html", "\", "/"), " ", "%20") & "?v=1.5"
edge = sh.ExpandEnvironmentStrings("%ProgramFiles(x86)%") & "\Microsoft\Edge\Application\msedge.exe"
If Not fso.FileExists(edge) Then edge = sh.ExpandEnvironmentStrings("%ProgramFiles%") & "\Microsoft\Edge\Application\msedge.exe"
If fso.FileExists(edge) Then
  ' --autoplay-policy: geluid mag direct starten zonder eerst te klikken
  sh.Run """" & edge & """ --app=" & url & " --window-size=1100,900 --autoplay-policy=no-user-gesture-required", 1, False
Else
  sh.Run url, 1, False
End If
