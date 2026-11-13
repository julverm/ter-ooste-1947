# De laatste avond op Kasteel Ter Ooste — 15 november 1947

Statische website voor het Vlaamse moorddiner. Vanilla HTML/CSS/JS, geen build-stap, geen frameworks, geen externe bronnen. Werkt rechtstreeks vanaf schijf (`file://`) én op GitHub Pages.

## Structuur

```
index.html            Startpagina (uitgangssituatie S0, rollen, aktes)
menu/index.html       Deelbare uitnodiging en uitvouwende menukaart (zonder spelinformatie)
akte-1/index.html     Akte I  — Het ontregelde archief (P1)
akte-2/index.html     Akte II — Het dagregister (P2, Vigenère-hulptabel)
akte-3/index.html     Akte III — Dossier NACHT (P3, audio Achiel + transcript)
akte-4/index.html     Akte IV — De notariskist (P4, digitale kluis)
hints/index.html      Acht verzegelde hints, te openen met hintcodes
notaris/index.html    Hostpagina (wachtwoord): oplossingen, codes, draaiboek, reset
config.js             ALLE codes en invulwaarden
assets/               style.css, app.js, favicon.svg
assets/experience.css Gedeelde bordeaux/perkamentstijl en mobiele spelbediening
audio/achiel.mp3      Verhoor van Achiel (opname van het transcript op Akte III; vervangbaar door een eigen TTS-opname)
tools/maak-audio.py   Gratis noodscript (edge-tts) om die opname opnieuw te genereren
docs/                 Canon-documenten (alleen-lezen referentie)
screenshots/          Testscreenshots
TESTLOG.md            Resultaat van de acceptatietests
```

## Lokaal draaien

**Optie A — dubbelklik** op `index.html`. Alles werkt, behalve het optionele "oude radio"-effect bij de audio (browsers staan Web Audio niet toe op `file://`-media; de audio zelf speelt gewoon).

**Optie B — kleine webserver** (aanbevolen, ook voor telefoons op hetzelfde wifi):

```powershell
cd <deze map>
python -m http.server 8000
```

Open daarna `http://localhost:8000/` (of `http://<ip-van-laptop>:8000/` op de telefoons).

Voortgang (ontgrendelde aktes, kluis, hints) wordt per toestel in `localStorage` bewaard. Wissen: `/notaris` → "Alles resetten".

## Uitnodiging en menukaart

Open lokaal `http://localhost:8000/menu/` of dubbelklik op `menu\index.html`.
De aparte uitnodiging laadt geen spelconfiguratie en linkt niet naar de puzzels.
Klik of tik ergens op het gesloten scherm om de kaart te openen. De knop blijft
ook met het toetsenbord bedienbaar. De scharnieranimatie duurt ongeveer 1,65 seconden;
bij reduced motion verschijnt de kaart direct.
Zonder JavaScript is de volledige menutekst meteen leesbaar. De oorspronkelijke
kaart blijft bereikbaar via de link onderaan.

De gepubliceerde uitnodiging staat op
`https://julverm.github.io/ter-ooste-1947/menu/`. Nieuwe lokale wijzigingen zijn niet automatisch live.
De datum op de aangeleverde kaart blijft **21 november 1947**, zoals bevestigd;
de bestaande spelcanon van 15 november 1947 verandert niet.

## Spelbediening

De spelpagina's gebruiken dezelfde bordeaux, gouden en perkamenten materialen als
de uitnodiging. De startpagina geeft direct toegang tot het eerste dossier en de
spelregels. De introductie van iedere akte is openklapbaar; een wegwijzer springt
naar de vrijgegeven onderdelen zonder verzegelde stukken te verklappen.

Puzzel I heeft altijd zes posities van links naar rechts. Pak een kaart vast
buiten het keuzevak en de knoppen: een zichtbare kaart volgt direct de muis of
vinger, een gemarkeerde plek toont de bestemming en de andere kaarten schuiven
opzij. De zwevende kaart blijft aan de schermrand in beeld. Op mobiel blijft
verticaal scrollen over de kaart mogelijk. Tik op
Links/Rechts of gebruik de pijltjestoetsen wanneer de sleepgreep focus heeft;
de positieknoppen bovenaan brengen je direct naar een kaart. De kaartvolgorde
en zelf gekozen symbolen blijven op het toestel bewaard. Slepen naar de rand
schuift de rij mee; Escape of een geannuleerde sleepactie herstelt de vorige
volgorde. Reduced motion behoudt de directe sleepfeedback zonder schuifanimaties.

De Vigenere-hulptabel houdt de letters horizontaal uitgelijnd in afzonderlijk
scrollbare regels. Invoervakken, tabs en kluiswielen hebben ruime aanraakvlakken.
De vier P1-cijfervakken ondersteunen het plakken van de volledige code.

`assets\style.css` blijft de functionele basis; `assets\experience.css` wordt
daarna geladen voor de gedeelde stijl. De aparte menupagina laadt geen van beide
spelbestanden. Het herontwerp wijzigt geen verhaaltekst of puzzeloplossing.

## Codes en teksten aanpassen — `config.js`

| Sleutel | Betekenis | Standaard |
|---|---|---|
| `aktecodes` | Woord dat de notaris voorleest om een akte te ontgrendelen | KASTEEL, PERKAMENT, KANDELAAR, TESTAMENT |
| `codeP1` | Toegangscode Dossier I (niet wijzigen zonder canon) | 6431 |
| `wachtwoordP3` | Dossierwoord Akte III | NACHT |
| `codeKluis` | Kluiscombinatie Akte IV | 6427 |
| `hintcodes` | Acht codes, één per hint (p1-1 … p4-2) | FOLIO-1/2, INKT-1/2, ETHER-1/2, LAK-1/2 |
| `hostwachtwoord` | Wachtwoord voor `/notaris` | CALLEWAERT |
| `boekKenmerk` | Vult `{{BOEK_KENMERK}}` in P2-A (regel 3) — **vóór de avond invullen!** | `[KENMERK VAN HET BOEK INVULLEN]` |
| `audioAchiel` | Pad naar het audiofragment | `audio/achiel.mp3` |

Alle vergelijkingen zijn hoofdletterongevoelig; spaties vooraan/achteraan worden genegeerd. De codes staan in platte tekst (het is een spel) maar worden nergens in de speler-UI getoond; de volledige lijst staat op `/notaris`.

`/notaris` is bewust **niet** gelinkt vanaf de spelerpagina's: typ het adres zelf in.

## Audio opnieuw genereren of vervangen

Het verhoor van Achiel (circa 1 minuut) mag met elke TTS-stem worden opgenomen, bij voorkeur een Vlaamse. Zet het resultaat als `audio\achiel.mp3` in de projectmap; de enige voorwaarde is dat de opname woordelijk gelijk is aan het transcript op Akte III. Wijzigt er een woord, pas dan ook het transcript in `akte-3\index.html` en `tools\maak-audio.py` aan.

Gratis noodoplossing: de tekst staat woordelijk in `tools\maak-audio.py`. Stemmen: `nl-BE-ArnaudNeural` (notaris) en `nl-NL-MaartenNeural` (Achiel).

```powershell
pip install --user edge-tts
python tools\maak-audio.py
```

Het script schrijft `audio\achiel.mp3`. Netwerk is nodig (edge-tts gebruikt de online Microsoft-stemmen). Het "oude radio"-effect (bandpass 300–3000 Hz, lichte ruis) wordt live in de browser toegepast met Web Audio en is uitschakelbaar; er is dus geen ffmpeg nodig.

## Publiceren op GitHub Pages

1. Maak een repository (bv. `ter-ooste-1947`) en zet de inhoud van deze map in de root van de `main`-branch.
2. GitHub → *Settings* → *Pages* → *Source: Deploy from a branch* → branch `main`, map `/ (root)`.
3. Na een minuut staat de site op `https://<gebruiker>.github.io/ter-ooste-1947/`.

Alle paden zijn relatief, dus de site werkt onder elk submap-adres. Pagina's hebben `noindex,nofollow`, maar een publieke Pages-site blijft bereikbaar voor wie de URL kent — deel die pas tijdens de avond. De map `docs/` bevat de volledige oplossing; haal die uit de repo of maak de repo privé als dat een zorg is.

## Toegankelijkheid

Toetsenbordbediening voor mapkaarten (pijlknoppen), tabbladen (pijltjestoetsen), kluiswielen (↑/↓, cijfers, Home/End), aria-labels en live-regio's, zichtbare focus, `prefers-reduced-motion` wordt gerespecteerd. Responsive vanaf 360 px.
