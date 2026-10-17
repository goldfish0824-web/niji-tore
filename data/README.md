# 問題データのスキーマ

級ごとに `data/<grade>/sets.json` を1つ置く。`grade` は `pre2` / `grade2` / `grade3`。

## トップレベル

| キー | 内容 |
| --- | --- |
| `grade` | `pre2` / `grade2` / `grade3` |
| `gradeLabel` | 画面に出す級名 |
| `version` | データを更新した日付 |
| `interviewerLines` | 面接官の定型セリフ。全セット共通 |
| `checkPoints` | 質問の type ごとの講評の観点。全セット共通 |
| `sets` | セットの配列 |

`interviewerLines.q3` の `{subject}` は、そのセットの `questions[].subject`（`man` / `woman`）に置き換える。`start` と `end` は面接の最初と最後に読み上げるセリフ。2級の `q2` は3コマの説明の指示、`begin` は考える時間のあとの "Please begin."。`yesFollowUp` / `noFollowUp` は級ごとに違う（準2級は Please tell me more. / Why not?、2級は Why? / Why not?）。

## セット

| キー | 内容 |
| --- | --- |
| `setId` | `pre2-01` のような一意のID |
| `title` | カードのタイトル。音読はここから始める |
| `passage` | 本文。準2級は約50語、2級は約60語 |
| `pictureA` / `pictureB` | 準2級のイラスト。リポジトリルートからの相対パス |
| `story` | 2級の3コマ漫画。下を参照 |
| `reading` | 音読の `prepSeconds`（黙読）と `answerSeconds` |
| `questions` | 準2級は No.1〜5、2級は No.1〜4 |

## 質問

| キー | 内容 |
| --- | --- |
| `no` | 1〜5 |
| `type` | `passage` / `pictureA` / `pictureB` / `story` / `opinion` / `personal` |
| `prompt` | 面接官が読み上げる質問文。`pictureA` / `pictureB` / `story` は `interviewerLines` を使うので `null` |
| `subject` | `pictureB` のときだけ。`man` または `woman` |
| `prepSeconds` | 考える時間。0なら即答 |
| `answerSeconds` | 解答時間の上限 |
| `modelAnswer` | 解答例の配列。`pictureA` と `story` は1文ずつ並べる。`opinion` と `personal` は別解を並べる（agree / disagree、Yes / No） |
| `extraCheckPoints` | そのセット固有の観点。任意 |

## 3コマ漫画（2級の `story`）

| キー | 内容 |
| --- | --- |
| `firstSentence` | カードに印刷する書き出しの文。No.2 はこの文から話し始める |
| `panels` | 3つのコマ。順に1〜3コマ目 |
| `panels[].image` | コマの画像。`images/grade2/grade2-01-1.jpg` の形。1枚絵 `grade2-01.jpg` から `scripts/split_panels.py` が作る |
| `panels[].arrow` | 2・3コマ目の前の矢印に入れる語句（That evening など）。アプリが描く |
| `panels[].speech` | 1コマ目のせりふ。`text` と、吹き出しを出す側 `side`（`left` / `right`）。アプリが絵の上部に重ねる |

画像には文字を入れない。矢印の語句とせりふはアプリが表示する。

## 講評の観点

AIには `checkPoints[type]` と、あれば `extraCheckPoints` を渡す。これは採点基準ではなく、何について指摘するかの指示。合否や評点は出させない。

`modelAnswer` は正解ではなく参考。生徒の答えが違う言い方でも、観点を満たしていれば肯定的に扱う。
