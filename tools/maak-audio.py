r"""Genereert audio/achiel.mp3 met edge-tts (twee stemmen: notaris en Achiel).

Gebruik:  python tools\maak-audio.py
Vereist:  pip install --user edge-tts   (en een internetverbinding)

De tekst hieronder is woordelijk overgenomen uit
docs/moorddiner-puzzelontwerp.md §4.10 en staat identiek als transcript op /akte-3.
Het oude-radio-effect wordt NIET hier toegepast (geen ffmpeg nodig), maar in de
browser met Web Audio (zie assets/app.js, radioEffect).
"""
import asyncio
import pathlib
import sys

import edge_tts

STEM_NOTARIS = "nl-BE-ArnaudNeural"
STEM_ACHIEL = "nl-NL-MaartenNeural"

REGELS = [
    ("N", "Mijnheer Achiel, de gasten zeggen dat u twintig minuten uit het zicht was. Waar bevond u zich?"),
    ("A", "In de wijnkelder, van 22:50 tot 23:10. De kelderknecht bleef al die tijd bij mij. Hij kan bevestigen dat ik de kelder niet heb verlaten."),
    ("N", "U had een kurkentrekker bij u?"),
    ("A", "Ja. Ik had die bij me voor de wijncontrole. Maar mijn bezoek aan de wijnkelder had niets te maken met het glas van de baron."),
    ("N", "Wat kunt u zeggen over zijn picon?"),
    ("A", "Niet wie die heeft aangeraakt. Ik was niet in de dienstoffice en zag de bediening niet. Als ik daarover een naam noemde, zou ik gokken."),
    ("N", "Waarom meldde u uw vertrek niet aan de anderen?"),
    ("A", "Ik dacht dat het maar even zou duren. Dat was onhandig, maar geen bewijs van moord. Ik kan zeggen waar ik zelf was. Voor wat elders gebeurde, moet u de registers en de andere verklaringen vergelijken."),
]

ROOT = pathlib.Path(__file__).resolve().parent.parent
UIT = ROOT / "audio" / "achiel.mp3"


async def spreek(tekst: str, stem: str, pogingen: int = 4) -> bytes:
    laatste: Exception | None = None
    for poging in range(1, pogingen + 1):
        try:
            com = edge_tts.Communicate(tekst, stem, rate="-8%")
            data = bytearray()
            async for chunk in com.stream():
                if chunk["type"] == "audio":
                    data.extend(chunk["data"])
            if data:
                return bytes(data)
            raise RuntimeError("lege audio")
        except Exception as exc:  # noqa: BLE001 — netwerkfouten van edge-tts zijn divers
            laatste = exc
            print(f"   poging {poging} mislukt ({exc}); opnieuw...", file=sys.stderr)
            await asyncio.sleep(2 * poging)
    raise RuntimeError(f"TTS mislukt na {pogingen} pogingen: {laatste}")


async def main() -> None:
    UIT.parent.mkdir(parents=True, exist_ok=True)
    delen = []
    for spreker, tekst in REGELS:
        stem = STEM_NOTARIS if spreker == "N" else STEM_ACHIEL
        print(f"[{spreker}] {tekst[:60]}...", file=sys.stderr)
        delen.append(await spreek(tekst, stem))
        await asyncio.sleep(1)
    UIT.write_bytes(b"".join(delen))
    print(f"Geschreven: {UIT} ({UIT.stat().st_size} bytes)")


if __name__ == "__main__":
    asyncio.run(main())
