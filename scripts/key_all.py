"""Re-key every raw character image into assets/pets in parallel."""
import pathlib
from concurrent.futures import ProcessPoolExecutor

from chroma_key import key

ROOT = pathlib.Path(__file__).resolve().parent.parent
RAW = ROOT / "assets" / "raw"
OUT = ROOT / "assets" / "pets"


def job(p: pathlib.Path) -> str:
    key(str(p), str(OUT / f"{p.stem}.webp"))
    return p.stem


if __name__ == "__main__":
    files = [p for p in RAW.glob("*.png") if not p.name.startswith(("_", "bg_", "test"))]
    with ProcessPoolExecutor() as ex:
        for name in ex.map(job, files):
            print(name, flush=True)
