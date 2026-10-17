# 英検準2級 二次試験 練習セット 1–5 仕様書

最終更新: 2026-10-11

## 明日の作業手順（セット追加時の手順）

画像を先に作り、出来上がった画像を見てから質問を確定する。生成画像は指示どおりにならないことがあるので、先に質問を固定すると手戻りする。

1. 各セットの「イラストA 生成プロンプト」「イラストB 生成プロンプト」をそのまま貼って生成する
2. 下のチェックリストで合否を見て、崩れた箇所だけ指示して描き直す
3. 確定した画像を見て、No.2 の想定解答（5人の動作）と No.3 の解答例を実物に合わせて直す
4. パッセージ・No.1・No.4・No.5 は画像に依存しないので、そのまま使える

モデルは Gemini 3.1 Flash Image（Nano Banana 2）以降を使う。初代の `gemini-2.5-flash-image` は 2026年10月2日に停止。

## 共通仕様

1セットは、約50語のパッセージ、イラストA（5人が別々の動作をしている場面）、イラストB（1人と吹き出し、何かができない状況）、質問5問で構成する。

### 5問の型

| 問 | 面接官の指示文 | 答え方 |
| --- | --- | --- |
| 音読 | 20秒黙読のあとタイトルから音読 | — |
| No.1 | Please look at the passage. How can ...? | By -ing ... / Because ... |
| No.2 | Now, please look at the people in Picture A. They are doing different things. Tell me as much as you can about what they are doing. | 20秒考える。現在進行形で5文 |
| No.3 | Now, look at the man / woman in Picture B. Please describe the situation. | 20秒考える。「～, so ... can't ～」か「～, but ～」で理由ごと |
| No.4 | （カードを裏返す）Some people say that ... . What do you think about that? | I agree. / I disagree. ＋ 理由2文 |
| No.5 | Today, ... . Do you ...? → Yes: Please tell me more. / No: Why not? | Yes / No ＋ 2文 |

### 生成プロンプトの共通ヘッダー

各セットの場面文の前に、毎回この英文を貼る。

```text
Simple, clean educational illustration for an English exam card. Flat vector style, clear black outlines, soft flat colors. Plain light background with only the objects the scene needs. Draw every person full-body, clearly separated from the others, with hands and actions unmistakably visible. Absolutely no letters, words, numbers, logos, or text signs anywhere in the image. Landscape orientation, 4:3.
```

文字を禁止しているのは、生成モデルが英単語を崩すから。禁止や状態を示したいときは、赤い斜線入りのピクトグラムなど、文字を使わない記号で指定する。

### 生成後チェックリスト

- イラストAに人物がちょうど5人いるか
- 5つの動作がそれぞれ別で、一目で英語にできるか
- 文字・数字・ロゴが写り込んでいないか
- 手や指が破綻していないか
- イラストBの「できない理由」が、絵だけで伝わるか
- 吹き出しの中の人物は穏やかな表情か（現実との対比を効かせるため）
- 実在の人物や商標に似ていないか

---

## Set 1 — Online Cooking Classes

パッセージ47語。イラストBは「両手がふさがっていてドアを開けられない」型。

```text
Online Cooking Classes

These days, many people want to learn how to cook at home. Some cooking schools offer classes on the Internet, and students can join these classes from their own kitchens. In this way, people can learn new recipes without going out. Such classes are becoming more popular.
```

**No.1** — According to the passage, how can people learn new recipes without going out?

解答例: By joining cooking classes on the Internet from their own kitchens.

**イラストA 生成プロンプト**

```text
Scene: a bright cooking classroom with a long counter and a stove. Exactly five people, evenly spaced, each doing one clear action: (1) a woman washing vegetables at a sink, (2) a man cutting a carrot on a cutting board with a knife, (3) a girl taking a tray of cookies out of an open oven while wearing oven mitts, (4) a boy wiping a table with a cloth, (5) a woman pouring water from a pitcher into a pot on the stove. No other people in the scene.
```

**No.2 想定解答**

- A woman is washing vegetables.
- A man is cutting a carrot.
- A girl is taking cookies out of the oven.
- A boy is wiping the table.
- A woman is pouring water into a pot.

**イラストB 生成プロンプト**

```text
Scene: one woman standing directly in front of a closed wooden door in a hallway, close enough to touch it, with the door on the right side of the image. She is holding a very large cooking pot with both hands, so both of her hands are clearly full. Her eyebrows are lowered and her mouth is turned down, so she clearly looks troubled. Above her head on the LEFT side of the image, well away from the real door and not overlapping it, a cloud-shaped thought bubble shows the same woman opening that door and walking through it. Only one person in the real scene.
```

**No.3** — 解答例: She is holding a big pot with both hands, so she can't open the door.

**No.4** — Some people say that cooking at home is better than eating at restaurants. What do you think about that?

**No.5** — Today, many people watch videos on the Internet to learn new things. Do you often watch videos to learn something?

---

## Set 2 — Sharing Umbrellas

パッセージ50語。イラストBは「道具が壊れていてできない」型。

```text
Sharing Umbrellas

Sudden rain can be a problem for people who do not have umbrellas. Now, some train stations have umbrella-sharing services. People can borrow an umbrella at one station and return it at another one. By doing so, they can avoid buying new umbrellas. Such services are useful on rainy days.
```

**No.1** — According to the passage, how can people avoid buying new umbrellas?

解答例: By borrowing an umbrella at one station and returning it at another one.

**イラストA 生成プロンプト**

```text
Scene: inside a train station concourse on a rainy day. Exactly five people, evenly spaced, each doing one clear action: (1) a woman buying a ticket at a ticket machine, (2) a man walking while pulling a suitcase, (3) a girl sitting on a bench and reading a book, (4) a boy throwing a can into a trash can, (5) a woman closing her wet umbrella near the entrance. No other people in the scene.
```

**No.2 想定解答**

- A woman is buying a ticket.
- A man is carrying a suitcase.
- A girl is reading a book on a bench.
- A boy is throwing a can into a trash can.
- A woman is closing her umbrella.

**イラストB 生成プロンプト**

```text
Scene: one man standing just inside a station exit. Heavy rain is falling outside, shown with clear rain lines and puddles on the ground. He is holding an umbrella that is obviously broken, with bent ribs and torn fabric. Above his head, a cloud-shaped thought bubble shows the same man walking outside under a normal open umbrella. Only one person in the scene.
```

**No.3** — 解答例: His umbrella is broken, so he can't go out in the rain.

**No.4** — Some people say that people should use trains and buses more often. What do you think about that?

**No.5** — Today, many people check the weather on their smartphones. Do you check the weather every morning?

---

## Set 3 — Visiting Farms

パッセージ46語。イラストBは「禁止マークがあるからできない」型。ピクトグラムのみで、文字は入れない。

```text
Visiting Farms

In Japan, some farmers welcome visitors to their farms. Visitors can pick fresh vegetables and learn how food is grown. In this way, children can understand the importance of farming. These programs are popular with families, and the number of such farms is increasing every year.
```

**No.1** — According to the passage, how can children understand the importance of farming?

解答例: By picking fresh vegetables and learning how food is grown.

**イラストA 生成プロンプト**

```text
Scene: a sunny vegetable farm with open fields and a small greenhouse in the background. Exactly five people, evenly spaced, each doing one clear action: (1) a man carrying a wooden box full of tomatoes, (2) a woman watering plants with a watering can, (3) a girl picking strawberries from a low plant, (4) a boy feeding chickens from a bucket, (5) a woman digging the ground with a shovel. No other people in the scene.
```

**No.2 想定解答**

- A man is carrying a box of tomatoes.
- A woman is watering the plants.
- A girl is picking strawberries.
- A boy is feeding the chickens.
- A woman is digging the ground with a shovel.

**イラストB 生成プロンプト**

```text
Scene: one woman standing in front of the glass door of a greenhouse, holding a camera up in her hands. On the door there is a round sign showing a simple camera pictogram crossed out with a thick red diagonal line, and no text of any kind. Through the glass, colorful flowers are visible. Above her head, a cloud-shaped thought bubble shows the same woman taking a photo of those flowers. Only one person in the scene.
```

**No.3** — 解答例: She wants to take a picture of the flowers, but she can't because taking pictures is not allowed.

**No.4** — Some people say that schools should give students more chances to learn outside the classroom. What do you think about that?

**No.5** — Today, many people enjoy outdoor activities. Do you often spend time outdoors on weekends?

---

## Set 4 — Libraries Today

パッセージ46語。イラストBは「高くて手が届かない」型。

```text
Libraries Today

Many libraries in Japan are changing. Some of them hold events such as reading parties and small concerts for local people. In this way, libraries are becoming places where people can meet each other. Many libraries also have cafés, and they are popular with young people.
```

**No.1** — According to the passage, how are libraries becoming places where people can meet each other?

解答例: By holding events such as reading parties and small concerts for local people.

**イラストA 生成プロンプト**

```text
Scene: inside a bright modern public library with bookshelves and reading tables. Exactly five people, evenly spaced, each doing one clear action: (1) a woman reading a newspaper in an armchair, (2) a man walking while carrying a tall pile of books in his arms, (3) a girl studying at a desk with an open notebook and a pencil, (4) a boy using a desktop computer, (5) a woman drinking coffee from a cup at a small table. No other people in the scene.
```

**No.2 想定解答**

- A woman is reading a newspaper.
- A man is carrying a lot of books.
- A girl is studying at a desk.
- A boy is using a computer.
- A woman is drinking coffee.

**イラストB 生成プロンプト**

```text
Scene: one short woman standing in front of a very tall bookshelf, stretching one arm up toward a single book on the top shelf, with a clear gap between her fingertips and the book. Above her head, a cloud-shaped thought bubble shows the same woman happily holding and reading that book. Only one person in the scene.
```

**No.3** — 解答例: The book is on a high shelf, so she can't reach it.

**No.4** — Some people say that reading paper books is better than reading on a smartphone. What do you think about that?

**No.5** — Today, many students study in libraries or cafés. Do you often study outside your home?

---

## Set 5 — Student Volunteer Guides

パッセージ44語。イラストBは「混んでいて時間がない」型。背景の行列も人として数えられないよう、主役を明確に指定している。

```text
Student Volunteer Guides

Japan is popular with tourists from abroad. Some high school students volunteer as guides and show visitors around their towns in English. In this way, they can improve their English and learn more about their own culture. Such programs are increasing in many cities.
```

**No.1** — According to the passage, how can some high school students improve their English and learn more about their own culture?

解答例: By volunteering as guides and showing visitors around their towns in English.

**イラストA 生成プロンプト**

```text
Scene: a sightseeing street in a Japanese town with a red torii gate and a shrine building in the background. Exactly five people in the whole image and no crowd, evenly spaced, each doing one clear action: (1) a man taking a picture of the shrine with a camera, (2) a woman holding an open paper map and looking at it, (3) a girl eating an ice cream cone, (4) a boy riding a bicycle, (5) a woman sweeping the street in front of a shop with a broom.
```

**No.2 想定解答**

- A man is taking a picture of the shrine.
- A woman is looking at a map.
- A girl is eating ice cream.
- A boy is riding a bicycle.
- A woman is sweeping the street.

**イラストB 生成プロンプト**

```text
Scene: one woman in the foreground standing at the end of a very long line of people waiting in front of a museum entrance. She is looking at the watch on her wrist with a worried face. She is the clear main figure, drawn large and in full color; the waiting people behind her are drawn small and simply so they read as a crowd, not as individuals. Above her head, a cloud-shaped thought bubble shows the same woman inside the museum looking at a painting.
```

**No.3** — 解答例: She wants to go into the museum, but the line is too long.

**No.4** — Some people say that high school students should do more volunteer work. What do you think about that?

**No.5** — Today, many people use English on the Internet. Do you often use English outside school?

---

## アプリに渡すデータ形式

実データは `data/pre2/sets.json`。スキーマは `data/README.md` を参照。

`checkPoints` は採点用ではなく、AIに渡す講評の観点。合否やABCは出さず、ここに書いた観点ごとに指摘と書き換え例を返させる。

## 残りの作業

- 画像が固まったら、同じ形式で2級（No.2が3コマのナレーション）と3級に展開する
- Cloudflare Worker にパスワード照合と1日あたりの回数上限を足す
- 音声はGeminiに直接渡す構成にし、必ず課金を有効にしたキーで運用する
