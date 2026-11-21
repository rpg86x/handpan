# Handpan 2.5

A playable handpan for Windows that works offline. Play it with your QWERTY keyboard, the mouse or a touchscreen. Every sound is synthesized live with the Web Audio API, so there are no audio files and the app needs no internet.

![Handpan](logo.png)

## Scales

Each scale has a ding plus 9 tone fields. Switch scales with `<` and `>`.

| Scale | Ding | Tones |
|-------|------|-------|
| D Kurd | D3 | A3 Bâ™­3 C4 D4 E4 F4 G4 A4 C5 |
| D Celtic Minor | D3 | A3 C4 D4 E4 F4 G4 A4 C5 D5 |
| F Low Pygmy | F3 | Aâ™­3 C4 Dâ™­4 Eâ™­4 F4 G4 Aâ™­4 C5 Eâ™­5 |
| D Hijaz | D3 | A3 Bâ™­3 Câ™¯4 D4 E4 F4 G4 A4 Bâ™­4 |
| C Major | C3 | G3 A3 C4 D4 E4 F4 G4 A4 C5 |
| C Ionian | C3 | G3 A3 B3 C4 D4 E4 F4 G4 A4 |

## Keyboard

```
 Q   W   E   R   T   Y   U   I   O      â† the same 9 tones, soft (ghost notes)
  A   S   D   F   G   H   J   K   L     â† the 9 tones, low â†’ high
   Z   X   C               <   >        â† Gu (bass) Â· Tak (rim) Â· Slap Â· switch scale
 [          space = Ding           ]
```

| Key | Action |
|-----|--------|
| `A`â€“`L` | Tones 1â€“9, low to high (they zigzag around the ding like on a real handpan) |
| `Q`â€“`O` | The same tones, played soft |
| `Shift` + key | Soft stroke |
| `Space` | Ding (center note) |
| `Z` / `X` / `C` | Gu (bass from the bottom port) / Tak (rim tap) / Slap on the ding |
| `<` `>` / `,` `.` / `â†` `â†’` | Previous / next scale |
| `â†“` / `â†‘` | Fold the keyboard panel in / out so the handpan fills the window |

The app reads physical key positions, so the pattern stays the same on AZERTY or QWERTZ keyboards. On a touchscreen you can tap the tone fields with several fingers at once. Volume and reverb sliders are at the bottom of the window. The app remembers your settings.

## Languages

English (default) and Dutch, plus German, French and Spanish. Pick another language in the menu at the top right. On first start the app uses your system language if it's available.

## Install (Windows)

1. Download this repository (**Code â†’ Download ZIP**) and unzip it.
2. Double-click `launch.vbs`. The app opens in its own Microsoft Edge window. Press `F11` for full screen.

You can also open `index.html` in any modern browser.

To get a desktop shortcut: right-click `launch.vbs` â†’ **Send to â†’ Desktop (create shortcut)**, then set `icon.ico` as the icon in the shortcut's properties.

## Install (Android)

Download `Handpan-2.5.apk` from the [latest release](https://github.com/rpg86x/handpan/releases/latest) and open it on your tablet or phone (allow installing from unknown sources when asked). The app runs full screen; recordings are saved in **Downloads/Handpan**.

To build it yourself: run `android/build.ps1` (needs the Android SDK and Android Studio's JDK; no Gradle).

## Support

If you enjoy playing, you can [buy me a coffee â˜•](https://urbantechmonk.gumroad.com/coffee).

---

## Nederlands

Een bespeelbare handpan voor Windows die zonder internet werkt. Speel met je toetsenbord, de muis of het touchscreen. De middelste rij (Aâ€“L) speelt de tonen van laag naar hoog, de bovenste rij speelt dezelfde tonen zacht en de spatiebalk is de ding. Met `<` en `>` wissel je van toonladder en met `â†“` `â†‘` klap je het toetsenbord in en uit. Start de app door te dubbelklikken op `launch.vbs`. De taal kies je rechtsboven.

## License

MIT, see [LICENSE](LICENSE).


## What's new in 2.5

- **Phone speaker mode**: small phone speakers can't play the deep notes (ding, gu) and start to buzz. On phones the app now filters the lowest bass, lets the overtones carry the low notes, keeps more headroom and uses less reverb. It's on by default on smartphones, off on tablets and laptops, and you can switch it with the 'Phone speaker' checkbox (turn it off when you use headphones).

## What's new in 2.4

- **Icaro style (Amazon)** songs from Song Library 1.6 (143 songs in total), played with a soft rattle rhythm when you listen.

## What's new in 2.3

- Songs from Song Library 1.4 (133 in total): Swan Lake, Morning Mood, a **Sea shanties** series and an **Early jazz & ragtime style** series, each with its own groove when you listen.

## What's new in 2.2

- **Merseybeat style** and **Rock & blues style** series from Song Library 1.3 (111 songs in total), each with its own groove when you listen.

## What's new in 2.1

- **West Coast style** series from Song Library 1.1: 10 G-funk originals (91 songs in total). Listen plays them with their own groove: bass on 1 and 3, slap on 2 and 4 and a rim tap on the last offbeat.

## What's new in 2.0

- **Songs come from [Song Library](https://github.com/rpg86x/song-library):** all 81 songs now live in the shared `songs.js`. `android/build.ps1` copies the newest version when the `song-library` folder sits next to `handpan`.
- **1–5 star ratings** replace the single favorite star (old favorites became 5 stars). Songs with 4 or 5 stars are at the top of the song list; the library has **★★★★★** and **★★★★+** filters. Ratings use the same storage key as Song Library.
- **Open a song from Song Library:** `index.html?song=<id>&mode=practice|listen`, or on Android via the intent extras `song` and `mode`.

## What's new in 1.9

- **★ Favorite songs:** tap the star next to the song list (or on a song card in the library) to mark a song as a favorite. Favorites appear at the top of the song list in their own group, come first in the library and have their own **★ Favorites** filter. Favorites are remembered per device.

## What's new in 1.8

- **81 songs**, at least 10 in every genre of the library.
- New classical pieces: Bach's Toccata in D minor (opening), Dies Irae, Beethoven's 5th (motif), Haydn's Surprise Symphony, Wagner's Bridal Chorus, Pachelbel's Canon (theme) and Mozart's Ah vous dirai-je.
- New folk and country songs: Aura Lee, Simple Gifts, O Christmas Tree, Deck the Halls, Swing Low, Michael Row the Boat Ashore, Home on the Range, Yankee Doodle and Clementine, plus more originals in reggae, hip-hop, urban/R&B, pop and country style.
- **New scale: C Ionian** (full major scale with B), so melodies that need the leading tone fit too. Songs switch to it automatically when needed.

## What's new in 1.7

- **ðŸ“š Library** (second page): browse 36 songs by genre: Children's songs, Classical, Folk & traditional, Country, Reggae style, Hip-hop style, Urban / R&B style and Pop style. Every song card has â–¶ Listen and ðŸŽ¯ Practice. Esc or â† goes back to the handpan.
- **20 new songs**, including Vivaldi's Spring, DvoÅ™Ã¡k's Largo, Auld Lang Syne, Camptown Races, Red River Valley, Hot Cross Buns, This Old Man, Itsy Bitsy Spider and Lightly Row.
- **Style originals** for hip-hop, urban/R&B, pop and country, written for this app (well-known hits are copyrighted). Listen plays each style with its own groove on the handpan's gu, tak and slap.

## What's new in 1.6

- **16 songs in three series:** Children's songs (Twinkle Twinkle, Mary Had a Little Lamb, FrÃ¨re Jacques, Row Row Row Your Boat, London Bridge, Old MacDonald, Jingle Bells), Classics & folk (Ode to Joy, When the Saints, Oh! Susanna, Amazing Grace, Kumbaya) and a new **Reggae style** series.
- The reggae series contains original tunes written for this app in a reggae feel (offbeat phrasing, minor pentatonic, relaxed tempo): Island Breeze, Offbeat Sunrise, Hammock Groove and Riddim Walk. Listen plays them with a soft rim tap on every offbeat.
- Each song has its own tempo, and songs can contain rests.

## What's new in 1.5

- **Learn songs:** pick a song in the bar under the scale name. **â–¶ Listen** plays it while the fields light up; **ðŸŽ¯ Practice** lights the next field in **red** (the one after that has a dashed outline) and waits until you hit it, with the matching key outlined on the keyboard map. Mistakes are counted.
- Songs: Twinkle Twinkle Little Star, Ode to Joy, Mary Had a Little Lamb, Jingle Bells, FrÃ¨re Jacques and When the Saints Go Marching In (all public domain). A song is shifted to fit the current scale; if it can't fit, the app switches to a scale where it does.

## What's new in 1.4

- **Recorder** at the bottom left, always visible (also when the keyboard panel is folded): â— record (press again after a pause to resume), âšâš pause, â–  stop, â–¶ play back, â¬‡ save. It records everything the app plays, without a microphone. On Android, saved recordings go to Downloads/Handpan.
- **â˜• Buy me a coffee** button at the bottom right, always visible.

## What's new in 1.2

Built on the original Handpan 1.1; its scales, SVG instrument, synthesis and keyboard layout remain the foundation. No network, packages or audio downloads required.

Open **Studio** below the volume sliders:

- **Loop:** select 40â€“180 BPM and 1, 2, 4 or 8 bars (4 beats per bar). Recording starts immediately. After the chosen length it repeats automatically. Add a layer, play along, then press the layer button again to finish. Undo removes the last completed extra layer. Changing scales stops the loop.
- **Audio recording:** start recording, play, finish recording, then download. The browser exports WebM/Opus (or Ogg where supported), including loop playback, ambient sounds and metronome. Keep this window open until you download your recording. No microphone or account is needed.
- **Learn:** listen to four notes, then repeat using the highlighted keys/fields. The status shows your progress; a wrong note restarts the sequence.
- **Relax:** toggle a synthesized drone and/or filtered rain noise. Start a 1â€“180 minute session; its final five seconds fade out and stop playback. The timer follows the audio clock, so system sleep can extend a session.
- **Damp:** press Backspace or the Damp button to shorten ringing tones. Touchscreen percussion remains available when the keyboard panel is hidden by a narrow screen.
- Slight variation per strike, a subtle edge-tap texture, cleanup of finished tone voices, and keyboard/screen-reader access to tone fields.

The new Studio controls are available in Dutch and English. For the other existing interface languages, Studio currently uses English. Volume, reverb, scale and folded layout still use the original saved preferences. Loop layers and recordings live in memory only.

### Files

Keep `studio.js` alongside `index.html`. Launch with the existing desktop shortcut or `launch.vbs`. The new features are separate from the original instrument code to keep further maintenance straightforward.
