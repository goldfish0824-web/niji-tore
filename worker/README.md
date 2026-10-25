# Cloudflare Worker

`worker.js` 1ファイルで動く。外部モジュールを使わないので、ダッシュボードのエディタに貼り付けても、wrangler でも配置できる。

やること:

- パスワード照合（`PASSWORDS` に登録したものだけ通す）
- 「1パスワード1日 `DAILY_LIMIT` 回まで」の上限（KV に記録。日本時間0時で切り替わる）
- 録音と問題データから講評プロンプトを組み立て、Gemini に中継する

プロンプトは Worker の中で組み立てる。フロントエンドが送るのは級・セットID・録音だけなので、パスワードを知っている人でも任意の文章を Gemini に流すことはできない。問題データは `DATA_BASE_URL`（GitHub Pages）から読むので、sets.json を直したときに Worker を配置し直す必要はない。

## 設定する値

| 名前 | 種類 | 内容 |
| --- | --- | --- |
| `GEMINI_API_KEY` | シークレット | 課金を有効にしたプロジェクトの Gemini API キー。無料枠のキーは使わない |
| `PASSWORDS` | シークレット | 配るパスワード。カンマか改行で区切って複数書ける。全角で入力されても通る |
| `USAGE` | KV バインディング | 回数の記録先 |
| `DATA_BASE_URL` | 変数 | GitHub Pages の公開URL。リポジトリのルートを指す（例 `https://NAME.github.io/eiken-2ji/`） |
| `ALLOWED_ORIGINS` | 変数 | アプリを置くオリジン（例 `https://NAME.github.io`）。カンマ区切りで複数可。空ならどこからでも呼べる |
| `DAILY_LIMIT` | 変数 | 1パスワード1日あたりの講評回数。省略時は5 |
| `GEMINI_MODEL` | 変数 | 省略時は `gemini-3.1-flash-lite` |
| `GEMINI_THINKING_LEVEL` | 変数 | 任意。`minimal` / `low` など。空ならモデルの既定のまま |
| `MAX_AUDIO_BYTES` | 変数 | 任意。1回に受け付ける録音の合計。省略時は12MB（16kHz の WAV で約6分） |

## ダッシュボードで配置する（Node.js 不要）

1. Cloudflare ダッシュボード → Workers & Pages → Create → Worker。名前は `eiken-2ji` などにして Deploy
2. Edit code を開き、`worker.js` の中身を全部貼り付けて Deploy
3. Storage & Databases → KV → Create で、`eiken-2ji-usage` などの名前空間を作る
4. 作った Worker の Settings → Bindings → Add → KV namespace。Variable name を `USAGE` にして、3 の名前空間を選ぶ
5. Settings → Variables and Secrets に上の表の値を足す。`GEMINI_API_KEY` と `PASSWORDS` は Type を Secret にする
6. ブラウザで `https://eiken-2ji.<サブドメイン>.workers.dev/api/health` を開き、`{"ok":true}` が出れば動いている
7. `app/config.js` の `WORKER_URL` にその URL（`/api/...` を除いた部分）を書く

## wrangler で配置する

`wrangler.toml` の `YOUR-NAME` と KV の id を書き換えてから:

```bash
npx wrangler kv namespace create USAGE
npx wrangler secret put GEMINI_API_KEY
npx wrangler secret put PASSWORDS
npx wrangler deploy
```

## API

| エンドポイント | 内容 |
| --- | --- |
| `GET /api/health` | 稼働確認 |
| `POST /api/check` | パスワードの確認。`{ ok, limit, remaining }` を返す。回数は減らない |
| `POST /api/feedback` | 講評。multipart/form-data で送る |

どちらの POST も `Authorization: Bearer <パスワードを encodeURIComponent したもの>` を付ける。

`/api/feedback` の中身:

| フィールド | 内容 |
| --- | --- |
| `grade` | `pre2` など |
| `setId` | `pre2-01` など |
| `reading`, `q1`〜`q4` | 録音（16kHz・モノラル・16bit の WAV） |
| `q5a`, `q5b` | No.5 の Yes/No 部分と、追加質問への答え |
| `q5Choice` | `yes` か `no`。どちらの追加質問をしたか |

無音だった録音は送らない。Worker はその問題を「無音。答えていない」としてプロンプトに入れる。

返すのは `{ items, overall, limit, remaining }`。`items` は `reading`, `q1`〜`q5` の順で、各要素は `transcript`（書き起こし）、`good`、`fixes`（最大2つ）、`rewrite`、`unclear`（聞き取れなかった語）、`note`。点数や合否の欄はない。

## 運用メモ

- 回数は講評を返せたときだけ数える。Gemini 側のエラーで生徒の1回分は減らない。
- KV は厳密なカウンタではないので、同時に送ると1回ぶん多く通ることがある。
- ログ（ダッシュボードの Logs か `npx wrangler tail`）にはトークン数と処理時間だけを出す。生徒の発話内容とパスワードは残さない。
- 録音を base64 に変える処理で CPU を使う。無料プラン（1リクエスト10ms）で `Exceeded CPU` のエラーが出るようなら、Workers Paid（月5ドル）に切り替える。
