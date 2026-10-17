# ニジトレ -英検2次試験対策アプリ-

本番と同じ流れで英検の二次試験（面接）を練習し、話した内容にAIが日本語でコメントと添削を返すWebアプリ。準2級・2級・3級に対応予定。

1次試験の合格者にパスワードを配り、2次試験まで自由に使えるようにする。

公開先: https://goldfish0824-web.github.io/niji-tore/

## 現在の状態

- 準2級：問題5セット（パッセージ・イラスト・質問・解答例）が完成
- 2級・3級：未着手
- アプリ本体：準2級の第1〜5回を選んで、黙読 → 音読 → No.1〜5 → 講評表示まで通せる。iPhone で確認済み
- Cloudflare Worker：配置済み（手順は `worker/README.md`）

## 手元で動かす

リポジトリのルートで静的サーバーを立て、`/app/` を開く。

```bash
python -m http.server 8000
```

`http://localhost:8000/app/` で開く。`app/config.js` の `WORKER_URL` が空なら、AIの講評なしで解答例と見比べるモードになる。`?set=pre2-02` でセットを選べ、`?timescale=0.1` で待ち時間を10分の1にできる（動作確認用）。

## 各フォルダ

| 場所 | 中身 |
| --- | --- |
| `docs/spec-pre2.md` | 準2級の仕様書。問題の作り方とイラスト生成プロンプト |
| `data/pre2/sets.json` | 準2級の問題データ |
| `data/README.md` | sets.json のスキーマ |
| `data/feedback-prompt.md` | AIに渡す講評プロンプトの下書き |
| `images/pre2/` | 準2級のイラスト（`pre2-01-a.jpg` 形式） |
| `scripts/rename_images.py` | `_incoming` の画像を正式名にリネームする |
| `scripts/make_thumbs.py` | 問題選択画面に出す小さな画像をイラストAから作る |
| `app/` | フロントエンド。ビルドなしの HTML / CSS / JS |
| `worker/` | Cloudflare Worker（`worker.js` 1ファイル）と配置手順 |

詳しい作業手順と守るべき方針は `CLAUDE.md` に書いてある。
