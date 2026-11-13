/* Ter Ooste 1947 — gedeelde logica (poorten, tabbladen, stempel, opslag, geluid) */
(function () {
  "use strict";

  var CFG = window.TER_OOSTE_CONFIG || {};
  var PREFIX = "terooste1947.";

  function norm(s) {
    return String(s == null ? "" : s).trim().toUpperCase();
  }
  function gelijk(a, b) {
    return norm(a) === norm(b);
  }

  var opslag = {
    get: function (k) {
      try { return localStorage.getItem(PREFIX + k); } catch (e) { return null; }
    },
    set: function (k, v) {
      try { localStorage.setItem(PREFIX + k, v); } catch (e) { /* privémodus */ }
    },
    is: function (k) { return opslag.get(k) === "1"; },
    zet: function (k) { opslag.set(k, "1"); },
    wisAlles: function () {
      try {
        var keys = [];
        for (var i = 0; i < localStorage.length; i++) {
          var key = localStorage.key(i);
          if (key && key.indexOf(PREFIX) === 0) keys.push(key);
        }
        keys.forEach(function (k) { localStorage.removeItem(k); });
      } catch (e) { /* negeren */ }
    }
  };

  var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Stempelanimatie: plaatst een stempel met tekst in een .stempel-houder */
  function stempel(houder, tekst) {
    if (!houder) return;
    houder.classList.add("stempel-houder");
    var oud = houder.querySelector(":scope > .stempel");
    if (oud) oud.remove();
    var el = document.createElement("div");
    el.className = "stempel" + (reducedMotion ? "" : " animeer");
    el.setAttribute("aria-hidden", "true");
    el.textContent = tekst;
    houder.insertBefore(el, houder.firstChild);
  }

  function schud(el) {
    if (!el || reducedMotion) return;
    el.classList.remove("schud");
    void el.offsetWidth;
    el.classList.add("schud");
    el.addEventListener("animationend", function h() {
      el.classList.remove("schud");
      el.removeEventListener("animationend", h);
    });
  }

  function meld(el, tekst, ok) {
    if (!el) return;
    el.textContent = tekst;
    el.classList.toggle("ok", !!ok);
  }

  function focusOp(container) {
    var kop = container.querySelector("h2") || container.querySelector("summary") || container;
    kop.setAttribute("tabindex", "-1");
    kop.focus({ preventScroll: true });
  }

  /* Tabbladen: container .tabs met [role=tablist] > button[role=tab][aria-controls] en panelen */
  function tabs(container) {
    if (!container) return;
    var knoppen = Array.prototype.slice.call(container.querySelectorAll('[role="tab"]'));
    var panelen = knoppen.map(function (k) { return document.getElementById(k.getAttribute("aria-controls")); });

    function kies(i, focus) {
      knoppen.forEach(function (k, j) {
        var actief = i === j;
        k.setAttribute("aria-selected", actief ? "true" : "false");
        k.tabIndex = actief ? 0 : -1;
        if (panelen[j]) panelen[j].hidden = !actief && !container.classList.contains("alles");
      });
      if (focus) knoppen[i].focus();
    }
    knoppen.forEach(function (k, i) {
      k.addEventListener("click", function () { kies(i, false); });
      k.addEventListener("keydown", function (e) {
        var n = null;
        if (e.key === "ArrowRight") n = (i + 1) % knoppen.length;
        else if (e.key === "ArrowLeft") n = (i - 1 + knoppen.length) % knoppen.length;
        else if (e.key === "Home") n = 0;
        else if (e.key === "End") n = knoppen.length - 1;
        if (n !== null) { e.preventDefault(); kies(n, true); }
      });
    });
    var toonAlles = container.querySelector("[data-toon-alles]");
    if (toonAlles) {
      toonAlles.addEventListener("click", function () {
        var aan = container.classList.toggle("alles");
        toonAlles.setAttribute("aria-pressed", aan ? "true" : "false");
        toonAlles.textContent = aan ? "Toon als tabbladen" : "Toon alles";
        var actief = knoppen.findIndex(function (k) { return k.getAttribute("aria-selected") === "true"; });
        kies(Math.max(0, actief), false);
      });
    }
    kies(0, false);
  }

  /* Aktepoort: toont #poort tot de aktecode is ingevoerd, daarna #akte-inhoud */
  function aktepoort(nr) {
    var poort = document.getElementById("poort");
    var inhoud = document.getElementById("akte-inhoud");
    if (!poort || !inhoud) return;
    var sleutel = "akte" + nr;

    function open(animatie) {
      poort.classList.add("verborgen");
      inhoud.classList.remove("verborgen");
      if (animatie) stempel(inhoud, "Vrijgegeven");
      document.dispatchEvent(new CustomEvent("akte-open", { detail: { nr: nr } }));
      if (animatie) focusOp(inhoud);
    }

    if (opslag.is(sleutel)) { open(false); return; }

    var form = poort.querySelector("form");
    var veld = poort.querySelector("input");
    var melding = poort.querySelector(".melding");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var verwacht = (CFG.aktecodes || {})[nr];
      if (verwacht && gelijk(veld.value, verwacht)) {
        opslag.zet(sleutel);
        meld(melding, "", true);
        open(true);
      } else {
        schud(form);
        meld(melding, "De notaris herkent deze aktecode niet.");
        veld.select();
      }
    });
  }

  /* Losse cijfervakjes (één cijfer per vak, zoals een authenticator):
     automatisch doorspringen, backspace terug, plakken van een volledige code. */
  function cijfervakken(fieldset) {
    var vakken = Array.prototype.slice.call(fieldset.querySelectorAll("input"));
    vakken.forEach(function (vak, i) {
      vak.addEventListener("paste", function (e) {
        var cijfers = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, vakken.length - i);
        if (!cijfers) return;
        e.preventDefault();
        cijfers.split("").forEach(function (c, j) { vakken[i + j].value = c; });
        var volgende = vakken[Math.min(i + cijfers.length, vakken.length - 1)];
        volgende.focus();
        volgende.select();
      });
      vak.addEventListener("input", function () {
        var cijfers = vak.value.replace(/\D/g, "");
        if (cijfers.length > 1) {
          cijfers.split("").forEach(function (c, j) { if (vakken[i + j]) vakken[i + j].value = c; });
          var laatste = vakken[Math.min(i + cijfers.length, vakken.length - 1)];
          laatste.focus(); laatste.select();
          return;
        }
        vak.value = cijfers;
        if (cijfers && vakken[i + 1]) { vakken[i + 1].focus(); vakken[i + 1].select(); }
      });
      vak.addEventListener("keydown", function (e) {
        if (e.key === "Backspace" && !vak.value && vakken[i - 1]) { vakken[i - 1].focus(); vakken[i - 1].value = ""; e.preventDefault(); }
        else if (e.key === "ArrowLeft" && vakken[i - 1]) { vakken[i - 1].focus(); e.preventDefault(); }
        else if (e.key === "ArrowRight" && vakken[i + 1]) { vakken[i + 1].focus(); e.preventDefault(); }
      });
      vak.addEventListener("focus", function () { vak.select(); });
    });
    return {
      waarde: function () { return vakken.map(function (v) { return v.value; }).join(""); },
      select: function () { vakken.forEach(function (v) { v.value = ""; }); vakken[0].focus(); }
    };
  }

  /* Codepoort binnen een akte (P1-code, NACHT, host) */
  function codepoort(opties) {
    var form = document.getElementById(opties.formId);
    var doel = document.getElementById(opties.doelId);
    if (!form || !doel) return;
    var vakken = form.querySelector(".cijfervakken");
    var veld = vakken ? cijfervakken(vakken) : form.querySelector("input");
    var melding = form.querySelector(".melding");
    var houder = document.getElementById(opties.verbergId) || form;

    function open(animatie) {
      if (opties.verbergId) houder.classList.add("verborgen");
      doel.classList.remove("verborgen");
      if (animatie) stempel(doel, opties.stempel || "Geopend");
      document.dispatchEvent(new CustomEvent("dossier-open"));
      if (animatie) focusOp(doel);
      if (opties.naOpen) opties.naOpen(animatie);
    }

    if (opties.opslag && opslag.is(opties.opslag)) { open(false); return; }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ingevoerd = vakken ? veld.waarde() : veld.value;
      if (gelijk(ingevoerd, opties.code)) {
        if (opties.opslag) opslag.zet(opties.opslag);
        meld(melding, "", true);
        open(true);
      } else {
        schud(form);
        meld(melding, opties.weigering || "Het mechanisme weigert.");
        veld.select();
      }
    });
  }

  /* Geluid (Web Audio, geen bestanden) */
  var audioCtx = null;
  function ctx() {
    if (!audioCtx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      audioCtx = new AC();
    }
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }

  function ruisBuffer(c, seconden) {
    var n = Math.floor(c.sampleRate * seconden);
    var buf = c.createBuffer(1, n, c.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  /* Kluisgeluid: klik + ~1,8 s oude-radio-ruis */
  function kluisGeluid() {
    var c = ctx();
    if (!c) return;
    var t = c.currentTime;

    var klik = c.createBufferSource();
    klik.buffer = ruisBuffer(c, 0.05);
    var klikGain = c.createGain();
    klikGain.gain.setValueAtTime(0.6, t);
    klikGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    var klikFilter = c.createBiquadFilter();
    klikFilter.type = "bandpass"; klikFilter.frequency.value = 1800; klikFilter.Q.value = 2;
    klik.connect(klikFilter).connect(klikGain).connect(c.destination);
    klik.start(t);

    var ruis = c.createBufferSource();
    ruis.buffer = ruisBuffer(c, 2);
    var bp = c.createBiquadFilter();
    bp.type = "bandpass"; bp.frequency.value = 1200; bp.Q.value = 0.7;
    var g = c.createGain();
    g.gain.setValueAtTime(0.0001, t + 0.08);
    g.gain.exponentialRampToValueAtTime(0.25, t + 0.25);
    g.gain.setValueAtTime(0.25, t + 1.2);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);
    ruis.connect(bp).connect(g).connect(c.destination);
    ruis.start(t + 0.08);
    ruis.stop(t + 1.9);

    var osc = c.createOscillator();
    osc.type = "sine"; osc.frequency.setValueAtTime(880, t + 0.1);
    osc.frequency.exponentialRampToValueAtTime(440, t + 1.2);
    var og = c.createGain();
    og.gain.setValueAtTime(0.0001, t + 0.1);
    og.gain.exponentialRampToValueAtTime(0.05, t + 0.3);
    og.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
    osc.connect(og).connect(c.destination);
    osc.start(t + 0.1); osc.stop(t + 1.5);
  }

  /* Oude-radio-effect op een <audio>-element: bandpass 300–3000 Hz, lichte vervorming, ruis.
     Werkt niet via file:// (browser blokkeert dan de audiobron in Web Audio). */
  function radioEffect(audioEl, schakelaar, uitleg) {
    if (!audioEl || !schakelaar) return;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC || location.protocol === "file:") {
      schakelaar.checked = false;
      schakelaar.disabled = true;
      if (uitleg) uitleg.textContent = "Het radio-effect is niet beschikbaar bij lokaal openen zonder webserver.";
      return;
    }
    var c = null, bron = null, droog = null, nat = null, ruisGain = null, ruisBron = null;

    function bouw() {
      if (c) return;
      c = ctx();
      bron = c.createMediaElementSource(audioEl);

      droog = c.createGain();
      nat = c.createGain();

      var hp = c.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 300; hp.Q.value = 0.8;
      var lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 3000; lp.Q.value = 0.8;
      var peak = c.createBiquadFilter(); peak.type = "peaking"; peak.frequency.value = 1500; peak.gain.value = 4; peak.Q.value = 1;
      var shaper = c.createWaveShaper();
      var curve = new Float32Array(256);
      for (var i = 0; i < 256; i++) { var x = (i / 127.5) - 1; curve[i] = Math.tanh(x * 2.2) / Math.tanh(2.2); }
      shaper.curve = curve;
      var comp = c.createDynamicsCompressor();
      comp.threshold.value = -24; comp.ratio.value = 6;

      bron.connect(droog).connect(c.destination);
      bron.connect(hp).connect(lp).connect(peak).connect(shaper).connect(comp).connect(nat).connect(c.destination);

      ruisBron = c.createBufferSource();
      ruisBron.buffer = ruisBuffer(c, 3);
      ruisBron.loop = true;
      var rbp = c.createBiquadFilter(); rbp.type = "bandpass"; rbp.frequency.value = 2200; rbp.Q.value = 0.5;
      ruisGain = c.createGain();
      ruisGain.gain.value = 0;
      ruisBron.connect(rbp).connect(ruisGain).connect(c.destination);
      ruisBron.start();
      pas();
    }
    function pas() {
      if (!c) return;
      var aan = schakelaar.checked;
      droog.gain.value = aan ? 0 : 1;
      nat.gain.value = aan ? 1.1 : 0;
      ruisGain.gain.value = (aan && !audioEl.paused) ? 0.035 : 0;
    }
    audioEl.addEventListener("play", function () { bouw(); pas(); });
    audioEl.addEventListener("pause", pas);
    audioEl.addEventListener("ended", pas);
    schakelaar.addEventListener("change", function () { if (c) pas(); });
  }

  /* Hints: helpers gedeeld met /hints en /notaris */
  var HINTS = [
    { id: "p1-1", puzzel: "Dossier I", nr: 1, tekst: ["Maak eerst twee vaste blokjes: ANKER–ROOS en BEL–SLEUTEL. ‘Precies twee mappen ertussen’ betekent een verschil van drie posities."] },
    { id: "p1-2", puzzel: "Dossier I", nr: 2, tekst: ["Test het ANKER op 2, 3, 4 en 5. Op 3 raakt de KROON geblokkeerd; op 4 past de BEL niet; op 5 botsen KROON en LANTAARN met regel 6."] },
    { id: "p2-1", puzzel: "Dossier II", nr: 1, tekst: ["Kijk naar de boekenkast. 1947 is meer dan een jaartal: het is ook een bladzijde."], alternatief: "Wie het briefje al heeft, krijgt in de plaats: “De sleutel heeft zes letters. Spaties onderbreken de herhaling niet.”" },
    { id: "p2-2", puzzel: "Dossier II", nr: 2, tekst: ["De eerste twee woorden van regel A worden DE PICONFLES. Controleer daarmee de uitlijning."] },
    { id: "p3-1", puzzel: "Dossier III", nr: 1, tekst: ["Verbind monsterletter → glasnummer → drank → onderzoekskenmerk. Gebruik geen smaakveronderstellingen."] },
    { id: "p3-2", puzzel: "Dossier III", nr: 2, tekst: ["Zoek het laatste bewezen schone moment en het eerste moment waarna verdere manipulatie uitgesloten is."] },
    { id: "p4-1", puzzel: "Dossier IV", nr: 1, tekst: ["Het begin van de kistcode komt uit de eerder gevonden toegangscode, niet uit de foliocijfers van willekeurige losse kaarten."] },
    { id: "p4-2", puzzel: "Dossier IV", nr: 2, tekst: ["De toegangscode was 6431. Gebruik alleen de eerste twee cijfers; voor de overige cijfers heb je de controleminuut en het glasnummer nodig."] }
  ];

  function archiefRij(lijst, status, overzicht) {
    var sleep = null;
    var frame = null;
    var animaties = new Map();
    var positieInfo = document.getElementById("archief-bekeken");

    function kaarten() { return Array.prototype.slice.call(lijst.children); }
    function markeerZichtbaar() {
      var rand = lijst.getBoundingClientRect();
      var items = kaarten();
      var gekozen = -1;
      var breedste = 0;
      if (lijst.scrollWidth > lijst.clientWidth + 2) {
        items.forEach(function (li, i) {
          var r = li.getBoundingClientRect();
          var breedte = Math.max(0, Math.min(r.right, rand.right) - Math.max(r.left, rand.left));
          if (breedte > breedste) { breedste = breedte; gekozen = i; }
        });
      }
      overzicht.querySelectorAll("button").forEach(function (knop, i) {
        if (i === gekozen) knop.setAttribute("aria-current", "true");
        else knop.removeAttribute("aria-current");
      });
      var tekst = gekozen < 0 ? "Alle zes kaarten in beeld" : "In beeld: positie " + (gekozen + 1) + " van 6 · mapkaart " + items[gekozen].dataset.kaart;
      if (positieInfo.textContent !== tekst) positieInfo.textContent = tekst;
    }
    function zichtbaar(li) {
      var links = li.getBoundingClientRect().left - lijst.getBoundingClientRect().left + lijst.scrollLeft - 4;
      lijst.scrollTo({ left: links, behavior: reducedMotion ? "auto" : "smooth" });
    }
    function nummer(bewaar) {
      var items = kaarten();
      items.forEach(function (li, i) {
        li.dataset.positie = i + 1;
        li.querySelector(".positie").textContent = "Positie " + (i + 1);
        li.setAttribute("aria-label", "Positie " + (i + 1) + ": Mapkaart " + li.dataset.kaart);
        li.querySelector("[data-omhoog]").disabled = i === 0;
        li.querySelector("[data-omlaag]").disabled = i === items.length - 1;
      });
      if (bewaar !== false) opslag.set("p1.volgorde", items.map(function (li) { return li.dataset.kaart; }).join(""));
      overzicht.replaceChildren();
      items.forEach(function (li, i) {
        var item = document.createElement("li");
        var knop = document.createElement("button");
        knop.type = "button";
        knop.textContent = i + 1;
        var naam = document.createElement("small");
        naam.textContent = "Map " + li.dataset.kaart;
        knop.appendChild(naam);
        var symbool = li.querySelector("select").value;
        knop.setAttribute("aria-label", "Ga naar positie " + (i + 1) + ", mapkaart " + li.dataset.kaart + (symbool ? ", " + symbool : ""));
        knop.addEventListener("click", function () {
          zichtbaar(li);
          li.querySelector(".sleepgreep").focus({ preventScroll: true });
        });
        item.appendChild(knop);
        overzicht.appendChild(item);
      });
      markeerZichtbaar();
    }
    function bericht(li) {
      status.textContent = "Mapkaart " + li.dataset.kaart + " staat nu op positie " + (kaarten().indexOf(li) + 1) + " van 6.";
    }
    function verplaats(li, delta, focusKnop) {
      var items = kaarten();
      var i = items.indexOf(li);
      var j = i + delta;
      if (j < 0 || j >= items.length) return;
      if (delta < 0) lijst.insertBefore(li, items[j]);
      else lijst.insertBefore(items[j], li);
      nummer();
      bericht(li);
      zichtbaar(li);
      var knop = li.querySelector(focusKnop);
      if (knop.disabled) knop = li.querySelector(".sleepgreep");
      knop.focus({ preventScroll: true });
    }
    kaarten().forEach(function (li) {
      li.draggable = false;
      var links = li.querySelector("[data-omhoog]");
      var rechts = li.querySelector("[data-omlaag]");
      links.textContent = "← Links";
      rechts.textContent = "Rechts →";
      links.setAttribute("aria-label", "Mapkaart " + li.dataset.kaart + " naar links");
      rechts.setAttribute("aria-label", "Mapkaart " + li.dataset.kaart + " naar rechts");
      var greep = document.createElement("button");
      greep.type = "button";
      greep.className = "sleepgreep";
      greep.textContent = "⠿ Versleep";
      greep.setAttribute("aria-label", "Versleep mapkaart " + li.dataset.kaart + "; gebruik met het toetsenbord de pijlen links en rechts");
      li.insertBefore(greep, li.firstChild);
      li.querySelector("select").addEventListener("change", nummer);
    });
    var bewaard = opslag.get("p1.volgorde");
    if (bewaard && /^[A-F]{6}$/.test(bewaard) && new Set(bewaard).size === 6) {
      var items = kaarten();
      bewaard.split("").forEach(function (k) {
        lijst.appendChild(items.find(function (li) { return li.dataset.kaart === k; }));
      });
    }
    nummer();
    lijst.addEventListener("scroll", markeerZichtbaar, { passive: true });
    new ResizeObserver(markeerZichtbaar).observe(lijst);
    lijst.addEventListener("click", function (e) {
      var knop = e.target.closest("button");
      if (!knop) return;
      var li = knop.closest(".mapkaart");
      if (knop.hasAttribute("data-omhoog")) verplaats(li, -1, "[data-omhoog]");
      if (knop.hasAttribute("data-omlaag")) verplaats(li, 1, "[data-omlaag]");
    });
    lijst.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && sleep) { e.preventDefault(); einde(true); return; }
      if (!e.target.classList.contains("sleepgreep")) return;
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        verplaats(e.target.closest(".mapkaart"), e.key === "ArrowLeft" ? -1 : 1, ".sleepgreep");
      }
    });
    function herschik(wijzig) {
      var ervoor = new Map();
      kaarten().forEach(function (li) {
        ervoor.set(li, li.getBoundingClientRect());
        var animatie = animaties.get(li);
        if (animatie) animatie.cancel();
      });
      wijzig();
      if (!reducedMotion) kaarten().forEach(function (li) {
        if (li === sleep.li) return;
        var na = li.getBoundingClientRect();
        var dx = ervoor.get(li).left - na.left;
        var dy = ervoor.get(li).top - na.top;
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
        animaties.set(li, li.animate([
          { transform: "translate(" + dx + "px, " + dy + "px)" },
          { transform: "translate(0, 0)" }
        ], { duration: 160, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }));
      });
    }
    function toonSleepkaart() {
      var rand = sleep.li.getBoundingClientRect();
      var laag = document.createElement("div");
      laag.className = "archief-sleeplaag";
      laag.setAttribute("aria-hidden", "true");
      laag.inert = true;
      var kaart = sleep.li.cloneNode(true);
      kaart.classList.add("sleepkaart");
      kaart.querySelectorAll("[id]").forEach(function (el) { el.removeAttribute("id"); });
      kaart.querySelectorAll("label[for]").forEach(function (el) { el.removeAttribute("for"); });
      kaart.querySelector("select").value = sleep.li.querySelector("select").value;
      kaart.style.width = rand.width + "px";
      kaart.style.height = rand.height + "px";
      laag.appendChild(kaart);
      document.body.appendChild(laag);
      sleep.laag = laag;
      sleep.kaart = kaart;
      sleep.grijpX = sleep.beginX - rand.left;
      sleep.grijpY = sleep.beginY - rand.top;
      sleep.breedte = rand.width;
      sleep.hoogte = rand.height;
      sleep.li.classList.add("sleept");
      lijst.classList.add("sorteert");
      sleep.li.querySelector(".sleepgreep").focus({ preventScroll: true });
      plaatsSleepkaart();
    }
    function plaatsSleepkaart() {
      var maxX = Math.max(8, document.documentElement.clientWidth - sleep.breedte - 8);
      var maxY = Math.max(8, document.documentElement.clientHeight - sleep.hoogte - 8);
      var x = Math.min(maxX, Math.max(8, sleep.x - sleep.grijpX));
      var y = Math.min(maxY, Math.max(8, sleep.y - sleep.grijpY));
      sleep.kaart.style.transform = "translate3d(" + Math.round(x) + "px, " + Math.round(y) + "px, 0)";
    }
    function beweeg(tijd) {
      if (!sleep || !sleep.bewogen) return;
      var rand = lijst.getBoundingClientRect();
      plaatsSleepkaart();
      var stap = sleep.tijd == null ? 1 : Math.min((tijd - sleep.tijd) / (1000 / 60), 2);
      sleep.tijd = tijd;
      if (sleep.x < rand.left + 48) lijst.scrollLeft -= 10 * stap;
      else if (sleep.x > rand.right - 48) lijst.scrollLeft += 10 * stap;
      // Hit-test layout positions, not the animated positions of neighbouring cards.
      var over = kaarten().find(function (li) {
        var links = rand.left + li.offsetLeft - lijst.scrollLeft;
        return li !== sleep.li && sleep.x >= links && sleep.x <= links + li.offsetWidth;
      });
      if (over) {
        var links = rand.left + over.offsetLeft - lijst.scrollLeft;
        var volgende = sleep.x > links + over.offsetWidth / 2 ? over.nextSibling : over;
        if (volgende !== sleep.li && volgende !== sleep.li.nextSibling) {
          herschik(function () { lijst.insertBefore(sleep.li, volgende); });
          nummer(false);
        }
      }
      var positie = kaarten().indexOf(sleep.li) + 1;
      var tekst = "Laat mapkaart " + sleep.li.dataset.kaart + " los op positie " + positie + " van 6.";
      if (status.textContent !== tekst) status.textContent = tekst;
      sleep.kaart.querySelector(".positie").textContent = "Naar positie " + positie;
      frame = requestAnimationFrame(beweeg);
    }
    function einde(annuleer) {
      if (!sleep) return;
      var huidig = sleep;
      sleep = null;
      cancelAnimationFrame(frame);
      animaties.forEach(function (animatie) { animatie.cancel(); });
      animaties.clear();
      if (!huidig.bewogen) {
        if (lijst.hasPointerCapture(huidig.id)) lijst.releasePointerCapture(huidig.id);
        return;
      }
      if (annuleer) huidig.volgorde.forEach(function (li) { lijst.appendChild(li); });
      huidig.laag.remove();
      huidig.li.classList.remove("sleept");
      lijst.classList.remove("sorteert");
      if (lijst.hasPointerCapture(huidig.id)) lijst.releasePointerCapture(huidig.id);
      nummer();
      if (annuleer) status.textContent = "Verslepen geannuleerd. De vorige volgorde is hersteld.";
      else bericht(huidig.li);
      huidig.li.querySelector(".sleepgreep").focus({ preventScroll: true });
    }
    lijst.addEventListener("pointerdown", function (e) {
      var li = e.target.closest(".mapkaart");
      if (!li || !e.isPrimary || e.button !== 0 || sleep) return;
      if (e.target.closest("input, select, textarea, label, a, button:not(.sleepgreep), [contenteditable]")) return;
      if (e.pointerType === "mouse") e.preventDefault();
      sleep = { li: li, id: e.pointerId, x: e.clientX, y: e.clientY, beginX: e.clientX, beginY: e.clientY, vrij: e.pointerType !== "touch" || !!e.target.closest(".sleepgreep"), bewogen: false, volgorde: kaarten() };
      lijst.setPointerCapture(e.pointerId);
    });
    lijst.addEventListener("pointermove", function (e) {
      if (!sleep || e.pointerId !== sleep.id) return;
      sleep.x = e.clientX;
      sleep.y = e.clientY;
      var dx = Math.abs(sleep.x - sleep.beginX);
      var dy = Math.abs(sleep.y - sleep.beginY);
      if (!sleep.bewogen && (sleep.vrij ? Math.max(dx, dy) > 8 : dx > 8 && dx >= dy)) {
        sleep.bewogen = true;
        toonSleepkaart();
        frame = requestAnimationFrame(beweeg);
      }
      if (sleep.bewogen && e.cancelable) e.preventDefault();
    });
    lijst.addEventListener("pointerup", function (e) { if (sleep && e.pointerId === sleep.id) einde(false); });
    lijst.addEventListener("pointercancel", function (e) { if (sleep && e.pointerId === sleep.id) einde(true); });
    lijst.addEventListener("lostpointercapture", function () { if (sleep) einde(true); });
    window.addEventListener("blur", function () { if (sleep) einde(true); });
    document.addEventListener("visibilitychange", function () { if (document.hidden && sleep) einde(true); });
  }

  function markeerNav() {
    var links = document.querySelectorAll(".site-kop nav a");
    var pad = location.pathname.replace(/index\.html$/, "");
    links.forEach(function (a) {
      var doel = new URL(a.href).pathname.replace(/index\.html$/, "");
      if (pad === doel) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
      var akte = doel.match(/akte-(\d)\/$/);
      if (akte) a.setAttribute("aria-label", a.textContent + (opslag.is("akte" + akte[1]) ? ", vrijgegeven" : ", verzegeld"));
    });
    document.querySelectorAll(".akte-lijst [data-status]").forEach(function (el) {
      var vrij = opslag.is("akte" + el.dataset.status);
      el.textContent = vrij ? "Vrijgegeven · dossier openen" : "Verzegeld · wacht op de notaris";
      el.closest("a").dataset.vrijgegeven = String(vrij);
    });
  }
  function wegwijzer() {
    var inhoud = document.getElementById("akte-inhoud") || document.getElementById("host-inhoud");
    if (!inhoud) return;
    var bestaand = inhoud.querySelector(".wegwijzer");
    if (bestaand) bestaand.remove();
    var koppen = Array.prototype.slice.call(inhoud.querySelectorAll("section > h2[id]")).filter(function (kop) {
      return !kop.closest(".verborgen, [hidden], [role='tabpanel']");
    });
    if (koppen.length < 2) return;
    var details = document.createElement("details");
    details.className = "wegwijzer";
    var summary = document.createElement("summary");
    summary.textContent = "Ga naar een onderdeel";
    details.appendChild(summary);
    var nav = document.createElement("nav");
    nav.setAttribute("aria-label", "Onderdelen van dit dossier");
    koppen.forEach(function (kop) {
      var link = document.createElement("a");
      link.href = "#" + kop.id;
      link.textContent = kop.textContent;
      link.addEventListener("click", function () {
        kop.setAttribute("tabindex", "-1");
        kop.focus({ preventScroll: true });
      });
      nav.appendChild(link);
    });
    details.appendChild(nav);
    inhoud.insertBefore(details, inhoud.firstChild);
  }
  document.addEventListener("DOMContentLoaded", function () { markeerNav(); wegwijzer(); });
  document.addEventListener("akte-open", function () { markeerNav(); wegwijzer(); });
  document.addEventListener("dossier-open", wegwijzer);

  window.TerOoste = {
    CFG: CFG, norm: norm, gelijk: gelijk, opslag: opslag,
    stempel: stempel, schud: schud, meld: meld, tabs: tabs,
    aktepoort: aktepoort, codepoort: codepoort, archiefRij: archiefRij,
    kluisGeluid: kluisGeluid, radioEffect: radioEffect, audioCtx: ctx,
    HINTS: HINTS, reducedMotion: reducedMotion
  };
})();
