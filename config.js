/* =====================================================================
   Ter Ooste 1947 — configuratie van ALLE codes en invulwaarden.
   Dit is het enige bestand dat de hosts hoeven aan te passen.
   Vergelijkingen zijn hoofdletterongevoelig en spaties vooraan/achteraan
   worden genegeerd. Codes staan bewust in platte tekst: het is een spel.
   ===================================================================== */
window.TER_OOSTE_CONFIG = {

  /* Aktecodes: de notaris leest het woord voor dat de akte ontgrendelt. */
  aktecodes: {
    1: "KASTEEL",
    2: "PERKAMENT",
    3: "KANDELAAR",
    4: "TESTAMENT"
  },

  /* Puzzelcodes (canon: moorddiner-puzzelontwerp.md). Wijzig deze NIET
     zonder de bijbehorende documenten aan te passen (zie §7.1 daar). */
  codeP1: "6431",        // Dossier I  — opent P1-D en P1-E
  wachtwoordP3: "NACHT", // Dossier III — dossierwoord uit regel B van P2
  codeKluis: "6427",     // Dossier IV — digitale kluis

  /* Hintcodes voor /hints: per puzzel hint 1 en hint 2. */
  hintcodes: {
    "p1-1": "FOLIO-1",
    "p1-2": "FOLIO-2",
    "p2-1": "INKT-1",
    "p2-2": "INKT-2",
    "p3-1": "ETHER-1",
    "p3-2": "ETHER-2",
    "p4-1": "LAK-1",
    "p4-2": "LAK-2"
  },

  /* Wachtwoord voor de hostpagina /notaris. Niet met spelers delen. */
  hostwachtwoord: "CALLEWAERT",

  /* P2-A, regel 3: één onderscheidend kenmerk van het gekozen boek,
     zonder titel. Bv. "met de rode rug en gouden letters". */
  boekKenmerk: "[KENMERK VAN HET BOEK INVULLEN]",

  /* Pad naar het audiofragment (relatief t.o.v. de map van de site). */
  audioAchiel: "audio/achiel.mp3"
};
