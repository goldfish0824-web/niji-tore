# ニジトレ -英検2次試験対策アプリ-

高校生向けに、英検二次試験（面接）を本番と同じ流れで練習できるWebアプリを作る。生徒が英語で話し、その内容にAIが日本語でコメントと添削を返す。アプリ名は「ニジトレ」。手元のフォルダ名は eiken-2ji、GitHub のリポジトリ名は niji-tore。

対象は準2級・2級・3級。準2級の問題5セットが完成済みで、これから実装に入る段階。

## 絶対に守ること

- **合否判定やA/B/Cの評価は出さない。** 英検の採点基準は非公開で、LLMの判定は毎回ぶれる。出すのは観点別の指摘と書き換え例だけ。
- **APIキーをフロントエンドに置かない。** キーは Cloudflare Worker が持つ。HTML側のパスワード入力は画面を出すための飾りにすぎず、認証はWorker側で行う。
- **Geminiの無料枠を使わない。** 無料枠で送った内容はGoogleの製品改善に使われる。生徒の音声を扱うので、必ず課金を有効にしたキーで運用する。
- **過去問を転載しない。** パッセージ・質問・イラストはすべて自作。

## ディレクトリ

```
docs/        仕様書（問題の作り方、イラスト生成プロンプト、チェックリスト）
data/        問題データ。級ごとに sets.json
images/      イラスト。級ごとのフォルダ。_incoming は未リネームの置き場
scripts/     rename_images.py（_incoming の画像を正式名に変える）
app/         フロントエンド。ビルドなしの ES モジュール（main.js が画面の流れ、recorder.js が録音）
worker/      Cloudflare Worker。worker.js 1ファイル。配置手順は worker/README.md
```

画面は端末のダークモードに関係なく、明るい表示に固定している（作者の希望。パソコンと同じ見た目にするため）。

ルートの `index.html` は今は `app/` へ飛ばすだけ。2級・準2級・3級を選ぶトップページは将来ここに作る（アプリは `?grade=` で級を切り替えられる）。

動作確認は `python -m http.server 8000` で `/app/` を開き、`?timescale=0.1` で待ち時間を縮めて行う。

## 公開先と更新のしかた

| もの | 場所 |
| --- | --- |
| アプリ | https://goldfish0824-web.github.io/niji-tore/ （リポジトリ goldfish0824-web/niji-tore の main を GitHub Pages で公開） |
| Worker | https://eiken-2ji.goldfish0824.workers.dev （Cloudflare の Worker 名 eiken-2ji、KV は eiken-2ji-usage） |

- パスワードは全員共通で1つ。Worker のシークレット `PASSWORDS` に入っている。リポジトリは公開なので、パスワードやキーの値はどのファイルにも書かない。
- `DAILY_LIMIT` は共通パスワードなので学校全体での1日の上限（今は200回）。
- Worker の更新は `worker/` で `npx.cmd wrangler deploy`。PowerShell では `npx` だと実行ポリシーで止まるので `npx.cmd` を使う。Node.js は 2026-10 に入れた。
- アプリと問題データの更新は git で main に push する。Worker は問題データを GitHub Pages から読むので、sets.json を直したら push だけでよい。

## 画像を追加する手順

生成した画像は名前を変えずに `images/<grade>/_incoming/` に置く。そのあと:

```bash
python scripts/rename_images.py pre2 --list     # 中身を確認
# 画像を見て images/pre2/_incoming/mapping.json を書く
python scripts/rename_images.py pre2 --dry-run  # 下見
python scripts/rename_images.py pre2            # 実行
```

mapping.json は `{"元のファイル名": "01-a"}` の形。値を `_archive` にすると、採用しなかった画像を退避できる。実行後、sets.json が参照する画像が揃っているか自動で検証し、問題選択画面に出す小さな画像（`images/<grade>/thumbs/<setId>.jpg`、イラストAを縮小したもの）も作る。sets.json だけ直したときは `python scripts/make_thumbs.py pre2` で作り直す。

## 技術構成

| 層 | 使うもの | 理由 |
| --- | --- | --- |
| 音声入力 | ブラウザのマイク録音 | 生徒の端末はiPad・iPhoneが中心 |
| 文字起こし・講評 | Gemini に音声を直接送る | 音声は1秒25トークン換算で、テキストのみと費用がほぼ変わらない |
| 認証・鍵の保持 | Cloudflare Workers | すでに Claude API 用のリレーを運用中。同じ方式で増やす |
| 配信 | GitHub Pages | 既存のゲーム教材と同じ |

1セッションあたりの費用は Gemini 3.1 Flash-Lite で1円弱の見込み。100人が20回まわして2,000円前後。

## これからの実装タスク

1. **Worker**: パスワード照合、KVによる「1パスワード1日N回まで」の上限、Geminiへの中継。→ 実装済み。本番配置と実キーでの確認が残り。
2. **app**: 1セット分の通し（音読 → No.1〜5 → 講評表示）。録音・再生・タイマー・カード表示。→ 実装済み。iPhone・iPad 実機での確認が残り。
3. 動いたら残り4セットをデータとして流し込む。→ 済み。準備画面で第1〜5回を選べる。練習済みの回は端末の localStorage に記録する。第2〜5回の No.2 解答例はイラストを見て直した（2026-10-17）。
4. 準2級が固まったら2級（No.2が3コマのナレーション）→3級に展開する。→ 2級は5回分の問題（`data/grade2/sets.json`）と画像生成プロンプト（`docs/spec-grade2.md`）の下書きまで。作者が Nano Banana で3コマ画像を作っている。画像が届いたら、rename_images.py grade2 で取り込み（コマ分割は自動）、No.2 の解答例と speech.side を直し、アプリ・Worker を2級に対応させる（3コマと矢印・せりふの表示、"Please begin."、トップページで級を選ぶボタン）。3級はその後。

実装は1セット分を通しで動かしてから横に広げる。最初から5セット分のUIを作らない。

## 作者

豊田市の公立高校の英語科教員。英語学習ゲームを自作して生徒や他校に無償配布している。このツールも1次試験の合格者にパスワードを配って2次試験まで自由に使わせる想定。
