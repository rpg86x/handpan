package nl.handpan.app;

import android.app.Activity;
import android.content.ContentValues;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;
import android.view.View;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;

/** Het scherm: een WebView met de app (assets/index.html), schermvullend en zonder dat het scherm uitgaat. */
public final class MainActivity extends Activity {
    private WebView web;

    // Een WebView kan geen blob-links downloaden; deze regels sturen de Studio-opname naar save() hieronder
    private static final String DOWNLOAD_SHIM = "(function(){if(window.__hpShim)return;window.__hpShim=1;"
            + "var orig=HTMLAnchorElement.prototype.click;"
            + "HTMLAnchorElement.prototype.click=function(){"
            + "if(this.download&&this.href.indexOf('blob:')===0){var name=this.download;"
            + "fetch(this.href).then(function(r){return r.blob();}).then(function(b){var fr=new FileReader();"
            + "fr.onload=function(){var s=fr.result;HandpanAndroid.save(s.slice(s.indexOf(',')+1),name,b.type||'audio/webm');};"
            + "fr.readAsDataURL(b);});return;}"
            + "return orig.call(this);};})();";

    @Override protected void onCreate(Bundle b) {
        super.onCreate(b);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        web = new WebView(this);
        web.setBackgroundColor(Color.parseColor("#0e0f12"));
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true); // taal, volume, toonladder en ingeklapt toetsenbord onthouden
        s.setMediaPlaybackRequiresUserGesture(false);
        web.addJavascriptInterface(this, "HandpanAndroid");
        web.setWebViewClient(new WebViewClient() {
            // Links naar buiten (zoals de koffielink) openen in de browser
            @Override public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
                Uri u = r.getUrl();
                String scheme = u.getScheme();
                if ("file".equals(scheme)) return false;
                if ("http".equals(scheme) || "https".equals(scheme)) startActivity(new Intent(Intent.ACTION_VIEW, u));
                return true;
            }

            @Override public void onPageFinished(WebView v, String url) {
                v.evaluateJavascript(DOWNLOAD_SHIM, null);
            }
        });
        web.loadUrl("file:///android_asset/index.html");
        setContentView(web);
    }

    /** Bewaart een Studio-opname in de map Downloads van de tablet. */
    @JavascriptInterface public void save(String base64, String name, String mime) {
        String msg;
        try {
            byte[] data = Base64.decode(base64, Base64.DEFAULT);
            if (Build.VERSION.SDK_INT >= 29) {
                ContentValues cv = new ContentValues();
                cv.put(MediaStore.Downloads.DISPLAY_NAME, name);
                cv.put(MediaStore.Downloads.MIME_TYPE, mime);
                cv.put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/Handpan");
                Uri uri = getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, cv);
                try (OutputStream o = getContentResolver().openOutputStream(uri)) { o.write(data); }
                msg = "Opgeslagen in Downloads/Handpan: " + name;
            } else {
                File f = new File(getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS), name);
                try (OutputStream o = new FileOutputStream(f)) { o.write(data); }
                msg = "Opgeslagen: " + f.getAbsolutePath();
            }
        } catch (Exception e) {
            msg = "Opslaan mislukt: " + e.getMessage();
        }
        final String m = msg;
        runOnUiThread(() -> Toast.makeText(this, m, Toast.LENGTH_LONG).show());
    }

    @Override public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        // Schermvullend: status- en navigatiebalk verdwijnen, een veeg vanaf de rand haalt ze terug
        if (hasFocus) web.setSystemUiVisibility(View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY | View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION);
    }

    @Override protected void onResume() { super.onResume(); web.onResume(); }
    @Override protected void onPause() { web.onPause(); super.onPause(); }
}
