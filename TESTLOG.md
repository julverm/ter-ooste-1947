# TESTLOG — De laatste avond op Kasteel Ter Ooste

Basistestdatum: 12 november 2026. De P2-regel is opnieuw gevalideerd op 13 november 2026. Omgeving: Windows, Chromium via Playwright, `python -m http.server 8765` in de projectmap én rechtstreeks via `file://`.
Referentie: `docs\moorddiner-puzzelontwerp.md` §8.1 (inhoudelijke tests en aanvullende tests voor de digitale laag).

Legenda: ✅ geslaagd · ⚠️ geslaagd met opmerking · ❌ gefaald · ➖ niet digitaal testbaar (inhoudelijk, handmatig gecontroleerd tegen canon)

## 8.1 Inhoudelijke acceptatietests

| Test | Verwacht | Resultaat | Opmerking |
|---|---|---|---|
| P1 ordeningsregels volledig oplossen | Eén volgorde en toegangscode 6431 | ✅ | Volgorde LANTAARN, ANKER, ROOS, BEL, SLEUTEL, KROON (kaarten C, E, F, A, D, B) ingesteld via pijlknoppen; foliocijfers op positie 2→3→5→6 geven 6431. |
| P1-D/E lezen | Motieven Gaston/Deman, 1943-dreiging, sluitbanden; geen doodsoorzaak/alibi/dader | ✅ | Tekst woordelijk uit §2; geen extra inhoud. |
| Nieuwe P2-regel met LINNEN ontcijferen | `DE PICONFLES WAS OM 22:57 VERZEGELD; OPEN DOSSIER NACHT.` | ✅ | Terugontcijferd met sleutelherhaling over alleen A–Z; levert tijdstip en dossierwoord in één regel. |
| Nieuwe P2-regel terugversleutelen | `OM CVGBYNYRW JLA BZ 22:57 ZRCHRTIYO; WCRR QZAFVIE YIPUX.` | ✅ | Terugversleuteling identiek aan P2-D en de hulptabelcode. |
| Letters van de nieuwe regel tellen | 41 | ✅ | 41 letterposities; cijfers en leestekens hebben geen invoerveld. |
| Beide glazen vergelijken | Alleen B houdt onbekende vlekken over | ✅ | De tabel toont alleen picon, lak D en de twee glazen. De halve maan in C wordt volledig verklaard door picon en lak; B houdt 1◆, 2◆, 3★, 5★ over. |
| Glas en referentie indienen | Alleen B + L23 geeft de uitslag en sleutels vrij | ✅ | Playwright in Edge: alle 12 paren (B/C × vijf referenties plus onbekende code) getest. Geen overloop op 320, 360, 768 en 1280 px; de vrijgave blijft bewaard na herladen. |
| Weergave en voortgang van de stroken | Gelijke schaal 0–8, toegankelijke symbolen en geen pagina-overloop | ✅ | Playwright in Edge: 11 unieke SVG-vormen met consistente toegankelijke namen, gelijke rijhoogtes en geen pagina-overloop op 320, 360, 768 en 1280 px. De sleutelkeuze en uitslagen blijven na herladen; 01 + 03 opent de alibi’s met het toetsenbord. |
| Sleutelprofielen lezen vanaf de kop | Alleen 01 + 03 geeft de alibi’s vrij | ✅ | Alle 4095 andere selecties geweigerd in Chromium; juiste combinatie opent P3-I en verplaatst de focus. |
| Laatste schone en eerste bewaakte moment | Venster 23:02–23:06 | ➖ | P3-E woordelijk. |
| Alleen P1–P3 gebruiken | Marie én Victor mogelijk | ➖ | Inhoudelijk canon. |
| P4-code samenstellen | 6427 | ✅ | 6-4 (P1), 2 (23:02), 7 (glas 7) → kluis opent. |
| Bekentenis verwijderen | Onafhankelijke bewijsvoering blijft geldig | ➖ | Hostoplossing op `/notaris` bevat de verwijdertest woordelijk. |
| Dienstduur | Exact 28 jaar | ➖ | P4-C woordelijk (15 nov 1919 → 15 nov 1947). |
| Kalender | 15 november 1947 is zaterdag | ✅ | `datetime.date(1947,11,15)` → Saturday. |

## 8.1 Aanvullende acceptatietests digitale laag

| Test | Verwacht | Resultaat | Opmerking |
|---|---|---|---|
| P2-regel naast de kop lezen | Eenduidig avondtijdstip 22:57 | ✅ | Kop en regel staan samen in P2-D. |
| Verkorte Akte III | Stroken, sleutels, alibi’s en tijdlijn; geen tabbladen, markeringen of audio | ✅ | Playwright: foute strookcode en onvolledige sleutelselectie geweigerd. Vrijgaven en selectie blijven na herladen. |
| Bediening van de sleutels | Toetsenbord en touch | ✅ | Spatie en Enter, tikbediening en focus op beide uitslagen. Geen pagina-overloop op 320, 360, 768 en 1280 px; sleutelknoppen minstens 44 px hoog. |
| Akte III met één toegangsstap | Aktecode opent direct inleiding en stroken | ✅ | Playwright met lege opslag: `NACHT` geweigerd als aktecode, ` kandelaar ` opent direct zonder dossierformulier. Na herladen blijven nieuwe en bestaande vrijgaven bewaard; de oude dossiervlag alleen opent de akte niet. |
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
| Vigenère-hulptabel | ✅ Code-inspectie: 41 letters × 2 invoervelden = 82; cijfers/leestekens worden overgeslagen; bestaande hoofdletterconversie en opslag blijven behouden; geen automatische ontcijfering. |
| Boekraadsel en hints | ✅ P2-A toont het nieuwe titel- en paginaraadsel zonder titel of sleutelwoord prijs te geven. `INKT-1` stuurt naar het kookboek en de titelclues; `INKT-2` noemt *Altijd honger*, bladzijde 47. De notaris ziet waar het briefje moet liggen. |
| Notarispagina | ✅ `NOTARIS` → "Dit kantoor blijft gesloten."; `callewaert` → alle secties (codes, hints+hintcodes, draaiboek, voorleesteksten, hostoplossingen P1–P4, onthulling, testen). Niet gelinkt vanaf spelerpagina's. |
| "Alles resetten" | ✅ confirm-dialoog → localStorage leeg (0 sleutels `terooste1947.*`), pagina herlaadt vergrendeld. |
| Consolefouten | ✅ 0 errors/warnings op alle 7 pagina's (http) en op `file://` (na toevoegen favicon). |
| Screenshots | ✅ `screenshots\startpagina.png`, `akte-1.png`, `kluis-open.png`, `hints.png`, `mobiel-360-akte-4.png`. |

## Browsercontrole vóór publicatie

- Startpagina: knop naar Akte I werkt; de spelregels staan niet meer op de startpagina. Akte I weigert een verkeerd aktewoord; een juist symbool verbergt het kaart­raadsel en blijft na herladen bewaard. De juiste dossiercode geeft de stukken vrij.
- Akte II: 82 invoervelden in `#vig-A`; een ingevulde letter wordt hoofdletter en blijft na herladen bewaard. De twee boekhints en de voorbereiding op de notarispagina zijn gecontroleerd.
- Akte III: `#p3-werkblad` verschijnt direct na het aktewoord. De vier afleiders, een onbekende code en glas 2 met de juiste referentie geven geen vrijgave. De juiste combinatie opent de sleutelproef; een onvolledige selectie wordt geweigerd. De alibi’s blijven na de juiste sleutelkeuze en herladen zichtbaar.
- Akte IV: verkeerde kluiscode houdt de inhoud dicht; de juiste code opent het tabblad met Victors alibi. De gewone en gepersonaliseerde menukaart openen en sluiten via het toetsenbord.
- Geen horizontale overloop van de pagina op 320, 360, 768 en 1280 px in Aktes I–III en de menukaart. De Vigenère-regel blijft intern horizontaal scrollbaar.

## Gevonden en verholpen tijdens testen

1. Favicon 404 in console → `assets\favicon.svg` toegevoegd.
2. P1-codeveld had `pattern="[0-9]*"` waardoor "  6431 " door HTML-validatie werd geblokkeerd → pattern verwijderd; de JS trimt zelf.
3. Kluisdeksel bedekte de wielen in gesloten toestand (spelers konden het slot niet bedienen) → deksel is nu een bovenband met naamplaat die bij openen wegschuift (grid-rows-collapse, geen layout-animatie van hoogte).
4. Stempel "Geopend" werd afgesneden door `overflow:hidden` → stempel verplaatst naar de rand van de kist.
5. Lakzegeltekst "verzegeld" op de hintenveloppen werd afgeknipt → zegel iets groter, kleinere letter.
6. Navigatielinks `akte-1/` werkten niet via `file://` (geen automatische `index.html`) → alle links wijzen nu naar `…/index.html`.
