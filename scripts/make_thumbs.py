#!/usr/bin/env python3
"""問題を選ぶ画面に出す小さな画像を、各セットのイラストA（2級は3コマの1コマ目）から作る。

使い方:
    python scripts/make_thumbs.py pre2

images/<grade>/thumbs/<setId>.jpg に書き出す。rename_images.py の実行後にも自動で呼ばれる。
Pillow が必要（pip install pillow）。
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
WIDTH = 320  # 画面では横 90px 前後で出すので、高精細の画面でも足りる大きさ


def make_thumbs(grade: str) -> list[Path]:
    data = json.loads((ROOT / "data" / grade / "sets.json").read_text(encoding="utf-8"))
    out_dir = ROOT / "images" / grade / "thumbs"
    out_dir.mkdir(parents=True, exist_ok=True)
    written = []
    for s in data.get("sets", []):
        # 準2級はイラストA、2級は3コマの1コマ目を使う
        rel = s.get("pictureA") or ((s.get("story") or {}).get("panels") or [{}])[0].get("image")
        if not rel or not (ROOT / rel).exists():
            continue
        src = ROOT / rel
        with Image.open(src) as im:
            im = im.convert("RGB")
            im.thumbnail((WIDTH, WIDTH))
            dst = out_dir / f"{s['setId']}.jpg"
            im.save(dst, quality=80, optimize=True, progressive=True)
        written.append(dst)
    return written


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("grade", choices=["pre2", "grade2", "grade3"])
    args = ap.parse_args()
    for p in make_thumbs(args.grade):
        print(f"{p.relative_to(ROOT)}  ({p.stat().st_size // 1024} KB)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
