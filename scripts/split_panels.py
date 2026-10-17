#!/usr/bin/env python3
"""2級の3コマ漫画（横1列の1枚絵）を、コマごとの画像に切り分ける。

使い方:
    python scripts/split_panels.py grade2           # sets.json にある全セット
    python scripts/split_panels.py grade2 01 03     # セット番号を指定

images/<grade>/<grade>-01.jpg（3コマの1枚絵）から、sets.json の story.panels[].image
（images/<grade>/<grade>-01-1.jpg など）を作る。rename_images.py の実行後にも自動で呼ばれる。

コマの間の白いすき間を探して切り、各コマの周りの余白を落とす。
すき間が見つからないときは横幅を3等分する（そのときは結果を目で確かめること）。
Pillow が必要（pip install pillow）。
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parent.parent
WHITE = 235  # これ以上明るい画素を白とみなす
SEARCH = ((0.20, 0.46), (0.54, 0.80))  # 1本目・2本目のすき間を探す範囲（横幅に対する割合）


def white_mask(im: Image.Image) -> Image.Image:
    """白い画素を255、それ以外を0にした画像。"""
    return im.convert("L").point(lambda v: 255 if v >= WHITE else 0)


def gap_columns(mask: Image.Image) -> list[bool]:
    """上から下まで白い列（コマの間のすき間）なら True。コマの中の列は枠線を横切るので False になる。"""
    w, h = mask.size
    row = mask.resize((w, 1), Image.Resampling.BOX)
    allowed = max(2, round(h * 0.002))  # JPEG のノイズを少しだけ許す
    return [(255 - row.getpixel((x, 0))) * h / 255 <= allowed for x in range(w)]


def widest_run(flags: list[bool], start: int, end: int, min_len: int) -> tuple[int, int] | None:
    best = None
    run = None
    for x in range(start, end + 1):
        on = x < end and flags[x]
        if on and run is None:
            run = x
        elif not on and run is not None:
            if x - run >= min_len and (best is None or x - run > best[1] - best[0]):
                best = (run, x)
            run = None
    return best


def find_panels(im: Image.Image) -> tuple[list[tuple[int, int]], str]:
    """3つのコマの横の範囲 [(左, 右), ...] と、切り方（"gaps" か "thirds"）を返す。"""
    w, _ = im.size
    flags = gap_columns(white_mask(im))
    min_len = max(3, round(w * 0.003))
    gaps = [widest_run(flags, round(w * lo), round(w * hi), min_len) for lo, hi in SEARCH]
    if all(gaps):
        (a1, b1), (a2, b2) = gaps
        return [(0, a1), (b1, a2), (b2, w)], "gaps"
    third = w / 3
    return [(0, round(third)), (round(third), round(third * 2)), (round(third * 2), w)], "thirds"


def trim(panel: Image.Image) -> Image.Image:
    """コマの周りの白い余白を落とす（枠線は残す）。"""
    box = ImageChops.invert(white_mask(panel)).getbbox()
    return panel.crop(box) if box else panel


def split_strip(strip_path: Path, out_paths: list[Path]) -> str:
    with Image.open(strip_path) as im:
        im = im.convert("RGB")
        ranges, method = find_panels(im)
        sizes = []
        for (left, right), out in zip(ranges, out_paths):
            panel = trim(im.crop((left, 0, right, im.height)))
            out.parent.mkdir(parents=True, exist_ok=True)
            panel.save(out, quality=90, optimize=True, progressive=True)
            sizes.append(f"{panel.width}x{panel.height}")
    note = "" if method == "gaps" else "  ※すき間が見つからず3等分しました。切れ目を目で確かめてください"
    return f"{strip_path.relative_to(ROOT)} -> {', '.join(p.name for p in out_paths)} ({' / '.join(sizes)}){note}"


def split_panels(grade: str, set_numbers: list[str] | None = None) -> list[str]:
    """sets.json の story を持つセットについて、1枚絵があれば切り分ける。結果の説明を返す。"""
    data = json.loads((ROOT / "data" / grade / "sets.json").read_text(encoding="utf-8"))
    messages = []
    for s in data.get("sets", []):
        story = s.get("story")
        if not story:
            continue
        number = s["setId"].rsplit("-", 1)[-1]
        if set_numbers and number not in set_numbers:
            continue
        strip = ROOT / "images" / grade / f"{s['setId']}.jpg"
        if not strip.exists():
            continue
        outs = [ROOT / p["image"] for p in story["panels"]]
        if len(outs) != 3:
            messages.append(f"{s['setId']}: story.panels が3つではないので切り分けませんでした")
            continue
        messages.append(split_strip(strip, outs))
    return messages


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("grade", choices=["pre2", "grade2", "grade3"])
    ap.add_argument("sets", nargs="*", help="セット番号（01 など）。省略すると全部")
    args = ap.parse_args()
    messages = split_panels(args.grade, [n.zfill(2) for n in args.sets] or None)
    if not messages:
        print("切り分ける1枚絵がありません（images/<grade>/<setId>.jpg を置いてください）。")
        return 1
    for m in messages:
        print(m)
    return 0


if __name__ == "__main__":
    sys.exit(main())
