r"""Genereert audio/achiel.mp3 met edge-tts (twee stemmen: notaris en Achiel).

Gebruik:  python tools\maak-audio.py
Vereist:  pip install --user edge-tts   (en een internetverbinding)

De tekst hieronder is woordelijk overgenomen uit
docs/moorddiner-puzzelontwerp.md §4.10 en staat identiek als transcript op /akte-3.
Dit script is de gratis noodoplossing: een opname van exact dezelfde tekst met een
andere (bij voorkeur Vlaamse) TTS-stem mag audio/achiel.mp3 vervangen.
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
    ("N", "Mijnheer Achiel, de gasten zeggen dat u twintig minuten spoorloos was. Waar zat u?"),
    ("A", "In de wijnkelder, mijnheer de notaris, van tien voor elf tot tien na elf. Ik had wijn na te kijken, met mijn kurkentrekker en een lamp. Ik heb niemand verwittigd. Ik dacht dat het maar even zou duren. Dat was onhandig van mij. Maar de kelderknecht was er de hele tijd bij. Vraag het hem gerust."),
    ("N", "Wat kunt u zeggen over de picon van de baron?"),
    ("A", "Niet veel. Beneden in de kelder hoor je niets van wat er boven gebeurt, en in de dienstoffice was ik niet. Een naam noemen zou gokken zijn, en dat doe ik niet."),
    ("N", "Hoe was de baron de laatste weken?"),
    ("A", "Stiller dan anders. Sinds eind oktober sloot hij zich op in zijn bibliotheek, en hij liet zijn glas verzegelen, alsof hij iets voelde aankomen. Twaalf jaar heb ik die man gediend… Ik weet alleen waar ik zelf was. De rest moet u uitzoeken, mijnheer de notaris."),
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
