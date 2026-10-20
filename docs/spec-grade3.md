# 英検3級 二次試験 練習セット 1–5 仕様書

最終更新: 2026-10-20

問題文・イラストはすべて自作。英検公式サイトの3級の説明とサンプル（2013年）で形式だけを確認した（文章は転載しない）。

## 作業手順

準2級・2級と同じく、画像を先に作り、出来上がった画像を見てから No.2・No.3 の解答例を確定する。

1. 各セットの「イラスト 生成プロンプト」を、共通ヘッダーのあとに続けて貼って生成する（4:3 の横長）
2. 下のチェックリストで確かめ、崩れたところだけ直させる（直す用のプロンプトは下にある）
3. 採用した画像を名前を変えずに `images/grade3/_incoming/` に置く
4. `mapping.json` に `{"元のファイル名": "01"}` のようにセット番号だけを書き、`python scripts/rename_images.py grade3` を実行する（`grade3-01.jpg` になり、問題選択画面の小さな画像も作られる）
5. 画像を見て、No.2・No.3 の解答例を実物に合わせて直す
6. パッセージ・No.1・No.4・No.5 は画像に依存しないので、そのまま使える

## 共通仕様

1セットは、約30語のパッセージ、イラスト1枚、質問5問で構成する。

### 5問の型

| 問 | 面接官の質問の例 | 答え方 |
| --- | --- | --- |
| 音読 | 20秒黙読のあとタイトルから音読 | — |
| No.1 | Please look at the passage. Why ...? | Because ... |
| No.2 | Please look at the picture. How many ...? / Where is ...? / What is ... doing? | There are ... / It's under ... / He's -ing ... |
| No.3 | Please look at the girl. What is she going to do? など | She's going to ... |
| No.4 | （カードを裏返す）What do you usually do after school? | 自分のことを1〜2文 |
| No.5 | Do you ...? → Yes: Please tell me more. / No: 質問ごとの別の質問 | Yes / No ＋ 1〜2文 |

No.3 のあとに "Now, please turn the card over." でカードを裏返す。考える時間はない（すぐ答える）。

No.5 で No と答えたときの質問は、Why not? ではなく問題ごとに違う（例: What do you like to do in your free time?）。`questions[].noFollowUp` に書く。

### イラストの作り方

1枚の絵の中に、No.2・No.3 で聞く材料をすべて入れる。

- 「何をしているか」を聞く人物：動作が一目で分かるように描く
- 「これから何をするか」を聞く人物：頭の上の思考の吹き出しに、その人がこれからすることを描く
- 「いくつあるか」を聞く物：数をプロンプトで「exactly three」のように指定し、ほかの場所に同じ物を描かせない
- 「どこにあるか」を聞く物：under / on / next to など、位置がはっきり分かるように描く
- 「the girl」「the boy」で指せるように、女の子・男の子・男性・女性はそれぞれ1人ずつにする

### 生成プロンプトの共通ヘッダー

準2級と同じ。各セットの場面文の前に、毎回この英文を貼る。

```text
Simple, clean educational illustration for an English exam card. Flat vector style, clear black outlines, soft flat colors. Plain light background with only the objects the scene needs. Draw every person full-body, clearly separated from the others, with hands and actions unmistakably visible. Absolutely no letters, words, numbers, logos, or text signs anywhere in the image. Landscape orientation, 4:3.
```

### 生成後チェックリスト

- 質問で聞く物の数が、指定どおりか（風船・卵など）。ほかの場所に同じ物がないか
- 質問で聞く物の位置が、はっきり分かるか（犬がベンチの下、など）
- 思考の吹き出しの中身が、絵だけで分かるか。吹き出しの中の人物が本人と同じ服か
- 女の子・男の子・男性・女性がそれぞれ1人ずつで、「the girl」などで指せるか
- 文字・数字・ロゴが写り込んでいないか（黒板、本、地図、看板も）
- 手や指が破綻していないか
- 実在の人物や商標に似ていないか

### 直す用のプロンプト（画像をアップロードして使う）

崩れた画像を Gemini にアップロードし、当てはまるものを貼る。［ ］の中を書き換える。直したい点が複数あるときは、1回に1つずつ直させるほうが失敗しにくい。

一部だけ描き直す:

```text
Edit this image. Change only this part: [make sure there are exactly three balloons on the wall, and no balloons anywhere else]. Keep everything else exactly the same, including the people, their clothes, the art style, and the background. Do not add any text.
```

文字が入ってしまった:

```text
Edit this image. Remove all letters, words, numbers, and logos, including those on the blackboard, books, maps, signs, and packages. Replace them with plain colors or simple pictures. Change nothing else.
```

思考の吹き出しが分かりにくい:

```text
Edit this image. Make the cloud-shaped thought bubble above [the girl] larger and clearer, so that it clearly shows [the same girl playing the guitar on a stage]. Keep everything else the same.
```

---

## Set 1 — School Festivals

パッセージ34語。

```text
School Festivals

Many schools in Japan have school festivals every year. Students sing songs, act in plays, and sell food. They can work together with their classmates, so school festivals are good chances to make friends.
```

**No.1** — Please look at the passage. Why are school festivals good chances to make friends?

解答例: Because students can work together with their classmates.

**イラスト 生成プロンプト**

```text
Scene: a classroom being decorated for a school festival. The blackboard is plain and empty. Exactly three round balloons, red, yellow, and blue, are tied to the wall next to the blackboard, and there are no other balloons anywhere. A boy is kneeling on the floor, painting a big picture of a flower on a large sheet of paper with a brush. A girl is standing and holding a guitar; above her head, a cloud-shaped thought bubble shows the same girl happily playing the guitar on a stage. A female teacher is carrying a cardboard box. Only these three people in the scene.
```

**No.2** — Please look at the picture. How many balloons are there? — 解答例: There are three balloons.

**No.3** — Please look at the girl. What is she going to do? — 解答例: She's going to play the guitar.

**No.4** — What do you usually do after school?

**No.5** — Do you like to sing songs? → Yes: Please tell me more. / No: What do you like to do in your free time?

---

## Set 2 — Riding Bicycles

パッセージ33語。

```text
Riding Bicycles

Many people enjoy riding bicycles. Bicycles are good for our health, and they do not make the air dirty. Some people go to school by bicycle, so they can get exercise every day.
```

**No.1** — Please look at the passage. Why can some people get exercise every day?

解答例: Because they go to school by bicycle.

**イラスト 生成プロンプト**

```text
Scene: a sunny park with a path, green trees, and one wooden bench. A woman wearing a helmet is riding a bicycle along the path. A boy is sitting on the bench and reading a book; the book has no text on its cover. A small brown dog is lying on the ground directly under the bench, clearly visible between the bench legs. A man in sportswear is jogging on the path behind the bench. Only these three people and one dog in the scene, and only one bicycle.
```

**No.2** — Please look at the picture. Where is the dog? — 解答例: It's under the bench.

**No.3** — Please look at the woman. What is she doing? — 解答例: She's riding a bicycle.

**No.4** — How do you usually go to school?

**No.5** — Do you often watch sports on TV? → Yes: Please tell me more. / No: What do you like to watch on TV?

---

## Set 3 — Camping

パッセージ31語。

```text
Camping

Camping is popular in Japan. People can cook outside and look at beautiful stars at night. Many campsites lend tents to visitors, so people can go camping without their own tents.
```

**No.1** — Please look at the passage. Why can people go camping without their own tents?

解答例: Because many campsites lend tents to visitors.

**イラスト 生成プロンプト**

```text
Scene: a campsite next to a small river on a sunny afternoon, with one green tent and some trees. A man is cooking meat and vegetables on a barbecue grill, holding tongs. A girl is standing near the river, holding a fishing rod; above her head, a cloud-shaped thought bubble shows the same girl happily catching a fish in the river. A woman is sitting on a folding camping chair and drinking from a cup. Only these three people in the scene.
```

**No.2** — Please look at the picture. What is the man doing? — 解答例: He's cooking meat.

**No.3** — Please look at the girl. What is she going to do? — 解答例: She's going to catch a fish.

**No.4** — What do you like to do in summer?

**No.5** — Have you ever cooked dinner for your family? → Yes: Please tell me more. / No: What would you like to cook in the future?

---

## Set 4 — Making Sweets

パッセージ31語。

```text
Making Sweets

Many young people enjoy making sweets at home. They often find easy recipes on the Internet. Homemade cookies and cakes make good presents, so people often give them to their friends.
```

**No.1** — Please look at the passage. Why do people often give homemade cookies and cakes to their friends?

解答例: Because they make good presents.

**イラスト 生成プロンプト**

```text
Scene: a bright kitchen with a sink, a window, and a wooden table. On the table there is a small plate with exactly three white eggs, a mixing bowl, and a round cake, and there are no other eggs anywhere. A boy is standing at the sink, washing dishes with a sponge. A girl is standing at the table, putting strawberries on top of the cake. A woman is sitting at the table and drinking a cup of tea. Only these three people in the scene.
```

**No.2** — Please look at the picture. How many eggs are there on the table? — 解答例: There are three eggs.

**No.3** — Please look at the boy. What is he doing? — 解答例: He's washing the dishes.

**No.4** — What did you do last Sunday?

**No.5** — Do you like to cook? → Yes: Please tell me more. / No: What do you like to do at home?

---

## Set 5 — Visiting Aquariums

パッセージ31語。

```text
Visiting Aquariums

Aquariums are popular places for families. Visitors can see many kinds of sea animals there. Some aquariums have exciting shows with dolphins and sea lions, so children can enjoy watching them.
```

**No.1** — Please look at the passage. Why can children enjoy watching shows at some aquariums?

解答例: Because some aquariums have exciting shows with dolphins and sea lions.

**イラスト 生成プロンプト**

```text
Scene: inside an aquarium. A large glass water tank fills the back wall, with colorful fish swimming and exactly one turtle sitting on top of a big rock inside the tank. A girl is taking a picture of the fish with a camera. A boy is standing near the tank and looking at the fish; above his head, a cloud-shaped thought bubble shows the same boy happily eating an ice cream cone. A man is sitting on a bench and looking at a folded map that shows only simple pictures. Only these three people in the scene.
```

**No.2** — Please look at the picture. Where is the turtle? — 解答例: It's on the rock.

**No.3** — Please look at the boy. What is he going to do? — 解答例: He's going to eat ice cream.

**No.4** — Where would you like to go next summer?

**No.5** — Do you have any pets? → Yes: Please tell me more. / No: What animal would you like to have?

---

## アプリに渡すデータ形式

実データは `data/grade3/sets.json`（No.4・No.5 の解答例もここにある）。スキーマは `data/README.md` を参照。

## 残りの作業

- 5回分の画像を取り込み、No.2・No.3 の解答例を照合済み（2026-10-20）。第1回 No.3 は、女の子がすでにギターを持っている絵なので on the stage まで入れた
