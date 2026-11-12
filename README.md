# Handpan 1.5

A playable handpan for Windows that works offline. Play it with your QWERTY keyboard, the mouse or a touchscreen. Every sound is synthesized live with the Web Audio API, so there are no audio files and the app needs no internet.

![Handpan](logo.png)

## Scales

Each scale has a ding plus 9 tone fields. Switch scales with `<` and `>`.

| Scale | Ding | Tones |
|-------|------|-------|
| D Kurd | D3 | A3 B♭3 C4 D4 E4 F4 G4 A4 C5 |
| D Celtic Minor | D3 | A3 C4 D4 E4 F4 G4 A4 C5 D5 |
| F Low Pygmy | F3 | A♭3 C4 D♭4 E♭4 F4 G4 A♭4 C5 E♭5 |
| D Hijaz | D3 | A3 B♭3 C♯4 D4 E4 F4 G4 A4 B♭4 |
| C Major | C3 | G3 A3 C4 D4 E4 F4 G4 A4 C5 |

## Keyboard

```
 Q   W   E   R   T   Y   U   I   O      ← the same 9 tones, soft (ghost notes)
  A   S   D   F   G   H   J   K   L     ← the 9 tones, low → high
   Z   X   C               <   >        ← Gu (bass) · Tak (rim) · Slap · switch scale
 [          space = Ding           ]
```

| Key | Action |
|-----|--------|
| `A`–`L` | Tones 1–9, low to high (they zigzag around the ding like on a real handpan) |
| `Q`–`O` | The same tones, played soft |
| `Shift` + key | Soft stroke |
| `Space` | Ding (center note) |
| `Z` / `X` / `C` | Gu (bass from the bottom port) / Tak (rim tap) / Slap on the ding |
| `<` `>` / `,` `.` / `←` `→` | Previous / next scale |
| `↓` / `↑` | Fold the keyboard panel in / out so the handpan fills the window |

The app reads physical key positions, so the pattern stays the same on AZERTY or QWERTZ keyboards. On a touchscreen you can tap the tone fields with several fingers at once. Volume and reverb sliders are at the bottom of the window. The app remembers your settings.

## Languages

English (default) and Dutch, plus German, French and Spanish. Pick another language in the menu at the top right. On first start the app uses your system language if it's available.

## Install (Windows)

1. Download this repository (**Code → Download ZIP**) and unzip it.
2. Double-click `launch.vbs`. The app opens in its own Microsoft Edge window. Press `F11` for full screen.

You can also open `index.html` in any modern browser.

To get a desktop shortcut: right-click `launch.vbs` → **Send to → Desktop (create shortcut)**, then set `icon.ico` as the icon in the shortcut's properties.

## Install (Android)

Download `Handpan-1.5.apk` from the [latest release](https://github.com/rpg86x/handpan/releases/latest) and open it on your tablet or phone (allow installing from unknown sources when asked). The app runs full screen; recordings are saved in **Downloads/Handpan**.

To build it yourself: run `android/build.ps1` (needs the Android SDK and Android Studio's JDK; no Gradle).

## Support

If you enjoy playing, you can [buy me a coffee ☕](https://urbantechmonk.gumroad.com/coffee).

---

## Nederlands

Een bespeelbare handpan voor Windows die zonder internet werkt. Speel met je toetsenbord, de muis of het touchscreen. De middelste rij (A–L) speelt de tonen van laag naar hoog, de bovenste rij speelt dezelfde tonen zacht en de spatiebalk is de ding. Met `<` en `>` wissel je van toonladder en met `↓` `↑` klap je het toetsenbord in en uit. Start de app door te dubbelklikken op `launch.vbs`. De taal kies je rechtsboven.

## License

MIT, see [LICENSE](LICENSE).


## What's new in 1.5

- **Learn songs:** pick a song in the bar under the scale name. **▶ Listen** plays it while the fields light up; **🎯 Practice** lights the next field in **red** (the one after that has a dashed outline) and waits until you hit it, with the matching key outlined on the keyboard map. Mistakes are counted.
- Songs: Twinkle Twinkle Little Star, Ode to Joy, Mary Had a Little Lamb, Jingle Bells, Frère Jacques and When the Saints Go Marching In (all public domain). A song is shifted to fit the current scale; if it can't fit, the app switches to a scale where it does.

## What's new in 1.4

- **Recorder** at the bottom left, always visible (also when the keyboard panel is folded): ● record (press again after a pause to resume), ❚❚ pause, ■ stop, ▶ play back, ⬇ save. It records everything the app plays, without a microphone. On Android, saved recordings go to Downloads/Handpan.
- **☕ Buy me a coffee** button at the bottom right, always visible.

## What's new in 1.2

Built on the original Handpan 1.1; its scales, SVG instrument, synthesis and keyboard layout remain the foundation. No network, packages or audio downloads required.

Open **Studio** below the volume sliders:

- **Loop:** select 40–180 BPM and 1, 2, 4 or 8 bars (4 beats per bar). Recording starts immediately. After the chosen length it repeats automatically. Add a layer, play along, then press the layer button again to finish. Undo removes the last completed extra layer. Changing scales stops the loop.
- **Audio recording:** start recording, play, finish recording, then download. The browser exports WebM/Opus (or Ogg where supported), including loop playback, ambient sounds and metronome. Keep this window open until you download your recording. No microphone or account is needed.
- **Learn:** listen to four notes, then repeat using the highlighted keys/fields. The status shows your progress; a wrong note restarts the sequence.
- **Relax:** toggle a synthesized drone and/or filtered rain noise. Start a 1–180 minute session; its final five seconds fade out and stop playback. The timer follows the audio clock, so system sleep can extend a session.
- **Damp:** press Backspace or the Damp button to shorten ringing tones. Touchscreen percussion remains available when the keyboard panel is hidden by a narrow screen.
- Slight variation per strike, a subtle edge-tap texture, cleanup of finished tone voices, and keyboard/screen-reader access to tone fields.

The new Studio controls are available in Dutch and English. For the other existing interface languages, Studio currently uses English. Volume, reverb, scale and folded layout still use the original saved preferences. Loop layers and recordings live in memory only.

### Files

Keep `studio.js` alongside `index.html`. Launch with the existing desktop shortcut or `launch.vbs`. The new features are separate from the original instrument code to keep further maintenance straightforward.
