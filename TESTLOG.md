# TESTLOG — De laatste avond op Kasteel Ter Ooste

Testdatum: 12 november 2026. Omgeving: Windows, Chromium via Playwright, `python -m http.server 8765` in de projectmap én rechtstreeks via `file://`.
Referentie: `docs\moorddiner-puzzelontwerp.md` §8.1 (inhoudelijke tests en aanvullende tests voor de digitale laag).

Legenda: ✅ geslaagd · ⚠️ geslaagd met opmerking · ❌ gefaald · ➖ niet digitaal testbaar (inhoudelijk, handmatig gecontroleerd tegen canon)

## 8.1 Inhoudelijke acceptatietests

| Test | Verwacht | Resultaat | Opmerking |
|---|---|---|---|
| P1 ordeningsregels volledig oplossen | Eén volgorde en toegangscode 6431 | ✅ | Volgorde LANTAARN, ANKER, ROOS, BEL, SLEUTEL, KROON (kaarten C, E, F, A, D, B) ingesteld via pijlknoppen; foliocijfers op positie 2→3→5→6 geven 6431. |
| P1-D/E lezen | Motieven Gaston/Deman, 1943-dreiging, sluitbanden; geen doodsoorzaak/alibi/dader | ✅ | Tekst woordelijk uit §2; geen extra inhoud. |
| Nieuwe regel A met LINNEN ontcijferen | Zin over de piconfles | ✅ | Script: `DE PICONFLES WAS OM DRIE MINUTEN VOOR ELF NOG VERZEGELD`. |
| Nieuwe regel A terugversleutelen | `OM CVGBYNYRW JLA BZ HETM ZVRHEMA ISBC MYS RBR DREDRRMYQ` | ✅ | Her-versleuteling identiek aan de regel in `akte-2\index.html`. |
| Letters van regel A tellen | 46 | ✅ | Hulptabel toont 46 lettervakjes voor regel A. |
| Regel B bij de L herstarten | OPEN DOSSIER NACHT BIJ DE NOTARIS | ✅ | Script-verificatie. |
| Drie minuten vóór elf 's avonds | 22:57 | ➖ | Inhoudelijk; de P2-A-kop vermeldt de avond, tekst woordelijk. |
| Monster B volgen | Picon in glas 7 van de baron | ➖ | P3-C-tabel woordelijk overgenomen. |
| Eigen bitterstoffen picon beoordelen | Geen gifbewijs; geen extra puzzel | ➖ | P3-D woordelijk; geen toegevoegde puzzel. |
| P3-D met P3-F combineren | Digitalis, voorraadcode L23 | ➖ | Tabellen woordelijk. |
| Laatste schone en eerste bewaakte moment | Venster 23:02–23:06 | ➖ | P3-E woordelijk. |
| Alleen P1–P3 gebruiken | Marie én Victor mogelijk | ➖ | Inhoudelijk canon. |
| P4-code samenstellen | 6427 | ✅ | 6-4 (P1), 2 (23:02), 7 (glas 7) → kluis opent. |
| Bekentenis verwijderen | Onafhankelijke bewijsvoering blijft geldig | ➖ | Hostoplossing op `/notaris` bevat de verwijdertest woordelijk. |
| Dienstduur | Exact 28 jaar | ➖ | P4-C woordelijk (15 nov 1919 → 15 nov 1947). |
| Kalender | 15 november 1947 is zaterdag | ✅ | `datetime.date(1947,11,15)` → Saturday. |

## 8.1 Aanvullende acceptatietests digitale laag

| Test | Verwacht | Resultaat | Opmerking |
|---|---|---|---|
| P2-regel A naast de kop lezen | Eenduidig avondtijdstip 22:57 | ✅ | Kop en regel staan samen in P2-D. |
| P3-C vergelijken met P3-D/E | Bij uitschenken schoon; manipulatie later mogelijk | ✅ | Alle drie tabbladen bereikbaar na NACHT. |
| NACHT, nacht en omliggende spaties invoeren | Zelfde P3-documenten | ✅ | `DAG` → "Dit dossierwoord is niet bekend bij de notaris."; `  nacht ` → dossier open, `p3.open` bewaard; na herladen nog open. |
| Audio vergelijken met transcript | Woordelijk dezelfde tekst | ✅ | Herschreven tekst (13 nov, circa 1 minuut). `audio\achiel.mp3` opnieuw gegenereerd uit exact de transcripttekst (tools\maak-audio.py; script, transcript en canon §4.10 automatisch vergeleken: identiek). Een latere eigen TTS-opname moet dezelfde tekst gebruiken. |
| 6431 invoeren op `/akte-1` | P1-D/E verschijnen; 6413 weigert zonder hint | ✅ | 6413 → "De verzegeling blijft intact." (stukken blijven verborgen); 6431 → tabbladen P1-D en P1-E; `p1.open` bewaard. Drag-and-drop én pijlknoppen getest; focus blijft op de verplaatste kaart. |
| 6427 invoeren op de digitale kluis | Openanimatie, P4-B t/m F leesbaar; 6472 weigert | ✅ | 6472 (wielen via knoppen + toetsenbord ArrowUp/cijfer) → klasse `schud` + "Het mechanisme weigert.", geen limiet; 6427 → `kluis.open`, stempel "Geopend", "Het slot geeft mee.", vijf tabbladen + "Toon alles"; na herladen blijft open. |
| Hintcode invoeren op `/hints` | Juiste hint opent en blijft na herladen; andere dicht; foute code neutraal | ✅ | `FOLIO-9` → "De notaris herkent deze code niet."; ` folio-1 ` → enkel envelop P1-hint 1 open, 7 andere dicht; na herladen nog open; nogmaals → "Deze envelop was al geopend." Geen hintcodes zichtbaar in de speler-UI. |
| Site lokaal openen zonder internet | Alles werkt vanaf de laptop | ✅ | Via `file://` laden alle pagina's, config en CSS; navigatie werkt (links verwijzen expliciet naar `index.html`). Radio-effect is onder `file://` uitgeschakeld met uitleg (Web Audio kan geen `file://`-media verwerken); audio zelf speelt wel. Geen externe bronnen. |
| Telefoon van 360 px breed | Mapkaarten, cijfertekst, kluis bruikbaar zonder horizontaal scrollen | ✅ | Viewport 360×740: `scrollWidth == clientWidth` op alle 7 pagina's; geen element steekt buiten de viewport (behalve in bewust scrollbare tabelcontainers). Screenshot `screenshots\mobiel-360-akte-4.png`. |
| Zonder audio spelen | Alle vier puzzels oplosbaar | ✅ | Transcript staat woordelijk naast de speler; geen puzzel hangt van geluid af. |

## Extra controles (opdracht Agent D)

| Controle | Resultaat |
|---|---|
| Aktepoort: foute code | ✅ `ZEGEL` op `/akte-1` → "De notaris herkent deze aktecode niet.", inhoud blijft verborgen. |
| Aktepoort: juiste code, hoofdletterongevoelig/getrimd | ✅ `  kasteel ` opent Akte I; `perkament`, `kandelaar`, `TESTAMENT` openen II–IV; ontgrendeling in localStorage. |
| Vigenère-hulptabel | ✅ 148 invoervakjes; letter `l` wordt `L`, bewaard als `p2.vig-A.k.1`, na herladen aanwezig; geen automatische ontcijfering aanwezig. |
| `{{BOEK_KENMERK}}` | ✅ P2-A toont `[KENMERK VAN HET BOEK INVULLEN]` uit `config.js`. |
| Tabbladen toetsenbord | ✅ ArrowRight op P3-A verplaatst focus én selectie naar P3-B. |
| Notarispagina | ✅ `NOTARIS` → "Dit kantoor blijft gesloten."; `callewaert` → alle secties (codes, hints+hintcodes, draaiboek, voorleesteksten, hostoplossingen P1–P4, onthulling, testen). Niet gelinkt vanaf spelerpagina's. |
| "Alles resetten" | ✅ confirm-dialoog → localStorage leeg (0 sleutels `terooste1947.*`), pagina herlaadt vergrendeld. |
| Consolefouten | ✅ 0 errors/warnings op alle 7 pagina's (http) en op `file://` (na toevoegen favicon). |
| Screenshots | ✅ `screenshots\startpagina.png`, `akte-1.png`, `kluis-open.png`, `hints.png`, `mobiel-360-akte-4.png`. |

## Gevonden en verholpen tijdens testen

1. Favicon 404 in console → `assets\favicon.svg` toegevoegd.
2. P1-codeveld had `pattern="[0-9]*"` waardoor "  6431 " door HTML-validatie werd geblokkeerd → pattern verwijderd; de JS trimt zelf.
3. Kluisdeksel bedekte de wielen in gesloten toestand (spelers konden het slot niet bedienen) → deksel is nu een bovenband met naamplaat die bij openen wegschuift (grid-rows-collapse, geen layout-animatie van hoogte).
4. Stempel "Geopend" werd afgesneden door `overflow:hidden` → stempel verplaatst naar de rand van de kist.
5. Lakzegeltekst "verzegeld" op de hintenveloppen werd afgeknipt → zegel iets groter, kleinere letter.
6. Navigatielinks `akte-1/` werkten niet via `file://` (geen automatische `index.html`) → alle links wijzen nu naar `…/index.html`.
