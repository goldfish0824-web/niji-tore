# 英検3級 二次試験 練習セット 6–10 仕様書

最終更新: 2026-11-21

第1〜5回の共通仕様（5問の型、イラストの作り方、チェックリスト、直す用のプロンプト）は `docs/spec-grade3.md` を参照。ここの生成プロンプトは共通ヘッダーを先頭に入れてあるので、枠の中をそのまま1回で貼ればよい。

## 作業手順

第6〜10回は sets.json に `"draft": true` をつけて入れてある。下書きの回は、生徒の画面には出ない。

1. 各回の「イラスト 生成プロンプト」を貼って生成する（Nano Banana 2 以降。縦横比は 4:3）
2. `docs/spec-grade3.md` のチェックリストで確かめ、崩れたところだけ直させる（数・位置・思考の吹き出し・文字）
3. 採用した画像を名前を変えずに `images/grade3/_incoming/` に置く
4. `mapping.json` を `{"元のファイル名": "06"}` のようにセット番号だけで書き、`python scripts/rename_images.py grade3` を実行する
5. 画像を見て、No.2・No.3 の解答例を実物に合わせて直し、`"draft": true` の行を消すと生徒に見えるようになる

公開前の回は、URL に `&draft=1` をつけると確認できる（例: `app/?grade=grade3&draft=1&set=grade3-06`）。

## 取り込みの記録（2026-11-21）

- 5回分の画像を取り込み、数（雪だるま2つ・折り鶴4羽・鳥1羽）と位置（鳥は枝の上、帽子は座席の上）が指定どおりなのを確かめて公開した
- 第7回 No.3 は、男の子のすくい網にもう金魚が乗っていて、吹き出しは金魚の袋を持っている絵だったので、解答例を get a goldfish にした（catch / take ... home も正解とする）

## No.2・No.3 の聞き方

第1〜5回と同じく、No.2 は How many / Where / What is ... doing、No.3 は What is ... doing / What is ... going to do をばらして使った。

| 回 | No.2 | No.3 |
| --- | --- | --- |
| 第6回 | Where is the bird? | Please look at the woman. What is she doing? |
| 第7回 | What is the woman doing? | Please look at the boy. What is he going to do? |
| 第8回 | How many snowmen are there? | Please look at the man. What is he going to do? |
| 第9回 | How many paper cranes are there? | Please look at the boy. What is he doing? |
| 第10回 | Where is the hat? | Please look at the girl. What is she going to do? |

---

## Set 6 — Cherry Blossoms

パッセージ33語。

```text
Cherry Blossoms

In spring, many people in Japan enjoy looking at cherry blossoms. They often have picnics under the trees with their families. Cherry blossoms are very beautiful, so many tourists visit Japan in spring.
```

**No.1** — Please look at the passage. Why do many tourists visit Japan in spring?

解答例: Because cherry blossoms are very beautiful.

**イラスト 生成プロンプト**（共通ヘッダー込み）

```text
Simple, clean educational illustration for an English exam card. Flat vector style, clear black outlines, soft flat colors. Plain light background with only the objects the scene needs. Draw every person full-body, clearly separated from the others, with hands and actions unmistakably visible. Absolutely no letters, words, numbers, logos, or text signs anywhere in the image. Landscape orientation, 4:3.

Scene: a park in spring with large pink cherry blossom trees and a light blue picnic sheet spread on the grass under one tree. Exactly one small yellow bird is sitting on a low branch of that tree, clearly visible, and there are no other birds anywhere. A woman is sitting on the picnic sheet and eating a rice ball, holding it with both hands. A man is standing and taking a picture of the cherry blossoms with a camera. A boy is running on the grass and flying a kite. Only these three people in the scene.
```

**No.2** — Please look at the picture. Where is the bird? — 解答例: It's on the branch.（画像を見て直す）

**No.3** — Please look at the woman. What is she doing? — 解答例: She's eating a rice ball.（画像を見て直す）

**No.4** — What are you going to do this weekend? — 解答例: I'm going to play tennis with my friends.

**No.5** — Do you often go to parks? → Yes: Please tell me more. / No: Where do you like to go on weekends?

- Yes. (Please tell me more.) I often go to the park near my house with my dog.
- No. (Where do you like to go on weekends?) I like to go to the library.

---

## Set 7 — Fireworks Festivals

パッセージ32語。

```text
Fireworks Festivals

In Japan, fireworks festivals are popular in summer. Many people wear yukata and go to see the fireworks. There are also many food stands, so people can enjoy different kinds of food.
```

**No.1** — Please look at the passage. Why can people enjoy different kinds of food?

解答例: Because there are many food stands.

**イラスト 生成プロンプト**（共通ヘッダー込み）

```text
Simple, clean educational illustration for an English exam card. Flat vector style, clear black outlines, soft flat colors. Plain light background with only the objects the scene needs. Draw every person full-body, clearly separated from the others, with hands and actions unmistakably visible. Absolutely no letters, words, numbers, logos, or text signs anywhere in the image. Landscape orientation, 4:3.

Scene: a summer festival at night by a river, with a dark blue sky and colorful fireworks bursting in the sky. There is one food stand with a plain striped roof, and there are no signs or lanterns anywhere. A woman in a yukata is standing and taking a picture of the fireworks with her smartphone. A boy is standing next to a small blue pool with goldfish swimming in it, holding a small round paper scoop; above his head, a cloud-shaped thought bubble shows the same boy happily holding a small clear plastic bag with one goldfish in it. A man is cooking noodles on a hot iron plate at the food stand. Only these three people in the scene.
```

**No.2** — Please look at the picture. What is the woman doing? — 解答例: She's taking a picture of the fireworks.（画像を見て直す）

**No.3** — Please look at the boy. What is he going to do? — 解答例: He's going to get a goldfish.（すくい網にもう金魚が乗っている絵になったので catch から直した）

**No.4** — What kind of food do you like? — 解答例: I like curry and rice.

**No.5** — Have you ever worn a yukata? → Yes: Please tell me more. / No: What would you like to do this summer?

- Yes. (Please tell me more.) I wore a yukata at a summer festival last year.
- No. (What would you like to do this summer?) I'd like to go to the beach with my friends.

---

## Set 8 — Skiing

パッセージ29語。

```text
Skiing

Skiing is a popular winter sport. Many people go to snowy mountains on weekends. Some ski areas have lessons for beginners, so people can learn how to ski easily.
```

**No.1** — Please look at the passage. Why can people learn how to ski easily?

解答例: Because some ski areas have lessons for beginners.

**イラスト 生成プロンプト**（共通ヘッダー込み）

```text
Simple, clean educational illustration for an English exam card. Flat vector style, clear black outlines, soft flat colors. Plain light background with only the objects the scene needs. Draw every person full-body, clearly separated from the others, with hands and actions unmistakably visible. Absolutely no letters, words, numbers, logos, or text signs anywhere in the image. Landscape orientation, 4:3.

Scene: a snowy ski area on a sunny day, with a white slope, a small wooden lodge, and pine trees. Exactly two snowmen stand next to the lodge, and there are no other snowmen anywhere. A girl wearing a red ski jacket and goggles is skiing down the slope. A boy is throwing a snowball. A man is sitting on a bench in front of the lodge and taking off his ski boots; above his head, a cloud-shaped thought bubble shows the same man happily eating a bowl of hot ramen noodles at a table inside the lodge. Only these three people in the scene.
```

**No.2** — Please look at the picture. How many snowmen are there? — 解答例: There are two snowmen.（画像を見て直す）

**No.3** — Please look at the man. What is he going to do? — 解答例: He's going to eat ramen.（画像を見て直す）

**No.4** — What is your favorite season? — 解答例: My favorite season is winter.

**No.5** — Have you ever made a snowman? → Yes: Please tell me more. / No: What do you like to do in winter?

- Yes. (Please tell me more.) I made a big snowman with my brother last winter.
- No. (What do you like to do in winter?) I like to stay home and read books.

---

## Set 9 — Origami

パッセージ32語。

```text
Origami

Origami is a traditional Japanese art. People can make birds, flowers, and many other things with just one sheet of paper. It is easy and fun, so it is popular with children.
```

**No.1** — Please look at the passage. Why is origami popular with children?

解答例: Because it is easy and fun.

**イラスト 生成プロンプト**（共通ヘッダー込み）

```text
Simple, clean educational illustration for an English exam card. Flat vector style, clear black outlines, soft flat colors. Plain light background with only the objects the scene needs. Draw every person full-body, clearly separated from the others, with hands and actions unmistakably visible. Absolutely no letters, words, numbers, logos, or text signs anywhere in the image. Landscape orientation, 4:3.

Scene: a bright living room with a low wooden table and a sofa. On the table there are exactly four paper cranes made of origami paper, one red, one blue, one yellow, and one green, and there are no other paper cranes anywhere. A girl is sitting at the table and folding a sheet of pink origami paper with both hands. A boy is sitting at the table and cutting paper with scissors. A woman with gray hair is sitting on the sofa and reading a book with no text on its cover. Only these three people in the scene.
```

**No.2** — Please look at the picture. How many paper cranes are there? — 解答例: There are four paper cranes.（画像を見て直す）

**No.3** — Please look at the boy. What is he doing? — 解答例: He's cutting paper.（画像を見て直す）

**No.4** — What do you like to do on rainy days? — 解答例: I like to watch movies at home.

**No.5** — Do you like to draw pictures? → Yes: Please tell me more. / No: What subject do you like at school?

- Yes. (Please tell me more.) I often draw pictures of animals in my notebook.
- No. (What subject do you like at school?) I like science.

---

## Set 10 — Train Trips

パッセージ29語。

```text
Train Trips

Traveling by train is fun. People can enjoy beautiful views from the train window. Many stations sell special lunch boxes, so people can enjoy local food on the train.
```

**No.1** — Please look at the passage. Why can people enjoy local food on the train?

解答例: Because many stations sell special lunch boxes.

**イラスト 生成プロンプト**（共通ヘッダー込み）

```text
Simple, clean educational illustration for an English exam card. Flat vector style, clear black outlines, soft flat colors. Plain light background with only the objects the scene needs. Draw every person full-body, clearly separated from the others, with hands and actions unmistakably visible. Absolutely no letters, words, numbers, logos, or text signs anywhere in the image. Landscape orientation, 4:3.

Scene: inside a train car with seats and a large window that shows green mountains and a blue sky. A red hat is lying on an empty seat, clearly visible, and nobody is wearing a hat. A girl is sitting by the window, holding a closed lunch box and chopsticks on her lap; above her head, a cloud-shaped thought bubble shows the same girl happily eating food from the open lunch box. A man is sitting and sleeping with his eyes closed. A boy is sitting and reading a comic book with no text on its cover. Only these three people in the scene.
```

**No.2** — Please look at the picture. Where is the hat? — 解答例: It's on the seat.（画像を見て直す）

**No.3** — Please look at the girl. What is she going to do? — 解答例: She's going to eat lunch.（画像を見て直す）

**No.4** — What time do you usually get up? — 解答例: I usually get up at six thirty.

**No.5** — Do you like traveling? → Yes: Please tell me more. / No: What do you like to do on holidays?

- Yes. (Please tell me more.) I went to Kyoto with my family last spring.
- No. (What do you like to do on holidays?) I like to play games with my friends.
