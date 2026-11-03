# Handpan 1.1

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

## Support

If you enjoy playing, you can [buy me a coffee ☕](https://urbantechmonk.gumroad.com/coffee).

---

## Nederlands

Een bespeelbare handpan voor Windows die zonder internet werkt. Speel met je toetsenbord, de muis of het touchscreen. De middelste rij (A–L) speelt de tonen van laag naar hoog, de bovenste rij speelt dezelfde tonen zacht en de spatiebalk is de ding. Met `<` en `>` wissel je van toonladder en met `↓` `↑` klap je het toetsenbord in en uit. Start de app door te dubbelklikken op `launch.vbs`. De taal kies je rechtsboven.

## License

MIT, see [LICENSE](LICENSE).
