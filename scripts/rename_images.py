#!/usr/bin/env python3
"""_incoming に置いた画像を正式なファイル名にリネームして配置する。

使い方:
    # 1. _incoming に何が入っているか一覧する
    python scripts/rename_images.py pre2 --list

    # 2. images/pre2/_incoming/mapping.json を書く（Claude Code に画像を見せて作らせてよい）
    #    {"Gemini_Generated_Image_xxxx.jpg": "01-a", ...}
    #    値は「セット番号-a|b」だけでよい。grade の接頭辞はスクリプトが付ける。
    #    2級の3コマ漫画（1枚絵）は「セット番号」だけ（"01" など）。コマごとの画像に自動で切り分ける。
    #    値を "_archive" にすると、採用しなかった画像を _archive/ に退避する。

    # 3. 下見してから実行する
    python scripts/rename_images.py pre2 --dry-run
    python scripts/rename_images.py pre2

実行後、2級の1枚絵をコマに切り分け（split_panels.py）、data/<grade>/sets.json が参照している
画像がすべて揃っているか検証し、問題選択画面の小さな画像（make_thumbs.py）を作る。
"""

from __future__ import annotations

import argparse
import json
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VALID_SUFFIXES = {".jpg", ".jpeg", ".png", ".webp"}


def incoming_files(incoming: Path) -> list[Path]:
    return sorted(
        p for p in incoming.iterdir()
        if p.is_file() and p.suffix.lower() in VALID_SUFFIXES
    )


def cmd_list(incoming: Path) -> int:
    files = incoming_files(incoming)
    if not files:
        print(f"{incoming} に画像がありません。")
        return 1
    print(f"{incoming} の画像 {len(files)} 枚:")
    for p in files:
        print(f"  {p.name}  ({p.stat().st_size // 1024} KB)")
    print("\nこの一覧をもとに mapping.json を作ってください。")
    return 0


def normalize_target(grade: str, value: str) -> str:
    """'01-a' / 'pre2-01-a' のどちらでも受け付けて、正式な stem を返す。"""
    value = value.strip()
    return value if value.startswith(f"{grade}-") else f"{grade}-{value}"


def verify(grade: str, out_dir: Path) -> list[str]:
    """sets.json が参照する画像が実在するか確かめ、欠けているものを返す。"""
    sets_path = ROOT / "data" / grade / "sets.json"
    if not sets_path.exists():
        return []
    data = json.loads(sets_path.read_text(encoding="utf-8"))
    missing = []
    for s in data.get("sets", []):
        for key in ("pictureA", "pictureB"):
            rel = s.get(key)
            if rel and not (ROOT / rel).exists():
                missing.append(f"{s['setId']} {key}: {rel}")
        for i, panel in enumerate((s.get("story") or {}).get("panels", []), start=1):
            if not (ROOT / panel["image"]).exists():
                missing.append(f"{s['setId']} コマ{i}: {panel['image']}")
    return missing


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("grade", choices=["pre2", "grade2", "grade3"])
    ap.add_argument("--list", action="store_true", help="_incoming の中身を一覧するだけ")
    ap.add_argument("--dry-run", action="store_true", help="実際には動かさず、やることだけ表示")
    ap.add_argument("--copy", action="store_true", help="移動ではなくコピーする（元を残す）")
    args = ap.parse_args()

    out_dir = ROOT / "images" / args.grade
    incoming = out_dir / "_incoming"
    if not incoming.is_dir():
        print(f"エラー: {incoming} がありません。", file=sys.stderr)
        return 1

    if args.list:
        return cmd_list(incoming)

    mapping_path = incoming / "mapping.json"
    if not mapping_path.exists():
        print(f"エラー: {mapping_path} がありません。", file=sys.stderr)
        print("まず --list で一覧を出し、mapping.json を作ってください。", file=sys.stderr)
        return 1

    mapping: dict[str, str] = json.loads(mapping_path.read_text(encoding="utf-8"))
    files = {p.name: p for p in incoming_files(incoming)}

    unknown = [name for name in mapping if name not in files]
    if unknown:
        print("エラー: mapping.json にある次のファイルが _incoming にありません。", file=sys.stderr)
        for name in unknown:
            print(f"  {name}", file=sys.stderr)
        return 1

    unmapped = [name for name in files if name not in mapping]
    planned: list[tuple[Path, Path]] = []
    seen: dict[str, str] = {}

    for name, value in mapping.items():
        src = files[name]
        if value.strip() == "_archive":
            dst = incoming / "_archive" / name
        else:
            stem = normalize_target(args.grade, value)
            if stem in seen:
                print(f"エラー: {stem} が重複しています（{seen[stem]} と {name}）。", file=sys.stderr)
                return 1
            seen[stem] = name
            dst = out_dir / f"{stem}{src.suffix.lower()}"
        planned.append((src, dst))

    verb = "コピー" if args.copy else "移動"
    for src, dst in planned:
        print(f"{src.name}  ->  {dst.relative_to(ROOT)}")
    if unmapped:
        print("\nmapping.json に載っていないファイル（そのまま残します）:")
        for name in sorted(unmapped):
            print(f"  {name}")

    if args.dry_run:
        print(f"\n--dry-run のため何も{verb}していません。")
        return 0

    for src, dst in planned:
        dst.parent.mkdir(parents=True, exist_ok=True)
        if args.copy:
            shutil.copy2(src, dst)
        else:
            shutil.move(str(src), str(dst))
    print(f"\n{len(planned)} 枚を{verb}しました。")

    try:
        from split_panels import split_panels
    except ImportError:
        split_panels = None
        print("Pillow がないため、3コマ漫画の切り分けはしていません（pip install pillow）。")
    if split_panels:
        for line in split_panels(args.grade):
            print(line)

    # 1回分ずつ画像を足していくこともあるので、そろっていないセットがあっても作れる分は作る
    try:
        from make_thumbs import make_thumbs
    except ImportError:
        print("Pillow がないため、問題選択画面の小さな画像は作りませんでした（pip install pillow）。")
    else:
        thumbs = make_thumbs(args.grade)
        print(f"問題選択画面の小さな画像を {len(thumbs)} 枚作りました。")

    missing = verify(args.grade, out_dir)
    if missing:
        print("\n警告: sets.json が参照しているのに見つからない画像があります。")
        for m in missing:
            print(f"  {m}")
        return 1
    print("sets.json が参照する画像はすべて揃っています。")
    return 0


if __name__ == "__main__":
    sys.exit(main())
