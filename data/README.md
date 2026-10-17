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

`interviewerLines.q3` の `{subject}` は、そのセットの `questions[].subject`（`man` / `woman`）に置き換える。`start` と `end` は面接の最初と最後に読み上げるセリフ。

## セット

| キー | 内容 |
| --- | --- |
| `setId` | `pre2-01` のような一意のID |
| `title` | カードのタイトル。音読はここから始める |
| `passage` | 本文。準2級は約50語 |
| `pictureA` / `pictureB` | リポジトリルートからの相対パス |
| `reading` | 音読の `prepSeconds`（黙読）と `answerSeconds` |
| `questions` | No.1〜5 |

## 質問

| キー | 内容 |
| --- | --- |
| `no` | 1〜5 |
| `type` | `passage` / `pictureA` / `pictureB` / `opinion` / `personal` |
| `prompt` | 面接官が読み上げる質問文。`pictureA` と `pictureB` は `interviewerLines` を使うので `null` |
| `subject` | `pictureB` のときだけ。`man` または `woman` |
| `prepSeconds` | 考える時間。0なら即答 |
| `answerSeconds` | 解答時間の上限 |
| `modelAnswer` | 解答例の配列。No.2 は5文入る |
| `extraCheckPoints` | そのセット固有の観点。任意 |

## 講評の観点

AIには `checkPoints[type]` と、あれば `extraCheckPoints` を渡す。これは採点基準ではなく、何について指摘するかの指示。合否や評点は出させない。

`modelAnswer` は正解ではなく参考。生徒の答えが違う言い方でも、観点を満たしていれば肯定的に扱う。
