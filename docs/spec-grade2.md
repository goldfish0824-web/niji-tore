# 英検2級 二次試験 練習セット 1–5 仕様書

最終更新: 2026-10-17

問題文・イラストはすべて自作。英検公式サイトの2級サンプル（2013年）で形式だけを確認した（文章は転載しない）。

## 作業手順

準2級と同じく、画像を先に作り、出来上がった画像を見てから No.2 の解答例を確定する。

1. 各セットの「3コマ漫画 生成プロンプト」を、共通ヘッダーのあとに続けて貼って生成する。Google AI Studio なら縦横比で 21:9 を選ぶ。Gemini アプリではプロンプトの指定に従わせる（16:9 で出てきても使える）
2. 下のチェックリストで確かめ、崩れたコマだけ「2コマ目だけ描き直して、〜にして」と直させる
3. 採用した画像を名前を変えずに `images/grade2/_incoming/` に置く
4. `mapping.json` に `{"元のファイル名": "01"}` のようにセット番号だけを書き、`python scripts/rename_images.py grade2` を実行する。3コマの1枚絵を `grade2-01.jpg` として置き、コマごとの画像（`grade2-01-1.jpg` 〜 `-3.jpg`）と問題選択画面の小さな画像を自動で作る
5. 画像を見て、No.2 の解答例と、せりふの吹き出しを出す側（`speech.side`）を実物に合わせて直す
6. パッセージ・No.1・No.3・No.4 は画像に依存しないので、そのまま使える

モデルは Gemini 3.1 Flash Image（Nano Banana 2）以降を使う。

## 共通仕様

1セットは、約60語のパッセージ、3コマ漫画、質問4問で構成する。

### 4問の型

| 問 | 面接官の指示文 | 答え方 |
| --- | --- | --- |
| 音読 | 20秒黙読のあとタイトルから音読 | — |
| No.1 | According to the passage, how ...? | By -ing ... |
| No.2 | Now, please look at the picture and describe the situation. You have 20 seconds to prepare. Your story should begin with the sentence on the card. →（20秒）→ Please begin. | カードの1文から始め、3コマを過去形で。1コマにつき2文程度 |
| No.3 | （カードを裏返す）Some people say that ... . What do you think about that? | I agree. / I disagree. ＋ 理由2文 |
| No.4 | Today, ... . Do you think ...? → Yes: Why? / No: Why not? | Yes / No ＋ 2文 |

No.2 のあとに "Now, please turn over the card and put it down." でカードを裏返す（準2級は No.3 のあと）。

### 3コマ漫画の作り方

本物のカードでは、2コマ目・3コマ目の前の矢印に「That evening」のような語句が入り、1コマ目にはせりふの吹き出しがある。生成画像は英単語が崩れやすいので、文字は画像に入れず、アプリが重ねて表示する。

- 矢印と語句：アプリがコマの間に描く（`story.panels[].arrow`）
- 1コマ目のせりふ：アプリが吹き出しを重ねる（`story.panels[0].speech`）。そのため、画像では1コマ目の上4分の1を空けておき、話している人を左側に置く
- 思考の吹き出し：中身が絵だけなので、画像に描かせる
- 3コマは1枚の横長の絵として生成する。1枚で描かせたほうが、3コマの人物の顔や服がそろうため。コマの間を白いすき間にしておくと、スクリプトがそこで切り分ける

### 生成プロンプトの共通ヘッダー

各セットのプロンプトの前に、毎回この英文を貼る。

```text
Simple, clean educational illustration for an English exam card: a three-panel comic strip arranged in one horizontal row, read from left to right. Flat vector style, clear black outlines, soft flat colors. The three panels are exactly the same size, each surrounded by a thin black rectangular border, and separated by plain white gaps. Draw nothing in the white gaps, and no arrows. The same characters appear in every panel with the same faces, hairstyles, and clothes. Show people from at least the knees up, with their hands and actions clearly visible. Absolutely no letters, words, numbers, logos, or text anywhere in the image, including on screens, signs, posters, and packages. Do not draw speech bubbles. Draw cloud-shaped thought bubbles only where described. Wide landscape image, 21:9 aspect ratio.
```

### 生成後チェックリスト

- 3コマが同じ大きさで横1列に並び、コマの間が白いすき間になっているか（矢印や飾りがないか）
- 3コマとも同じ人物が、同じ顔・髪型・服で描かれているか
- 文字・数字・ロゴが写り込んでいないか（スマホやパソコンの画面、ポスターも）
- 1コマ目の上4分の1が空いていて、話している人が左側にいるか
- 思考の吹き出しの中身が、絵だけで分かるか
- 夕方・朝・夜などの時間帯が、窓の光などで分かるか
- 手や指が破綻していないか
- 実在の人物や商標に似ていないか

話している人が右側にいる場合は、描き直さなくてよい（`speech.side` を `right` にすれば吹き出しの向きを合わせられる）。

### 直す用のプロンプト（画像をアップロードして使う）

崩れた画像を Gemini にアップロードし、当てはまるものを貼る。［ ］の中を書き換える。直したい点が複数あるときは、1回に1つずつ直させるほうが失敗しにくい。

1コマだけ描き直す:

```text
Edit this image. Keep the other two panels exactly as they are. Redraw only panel [2] so that [the red warning lamp on top of the machine is clearly lit and larger]. Keep the same characters, faces, clothes, art style, panel size, and white gaps. Do not add any text.
```

文字が入ってしまった:

```text
Edit this image. Remove all letters, words, numbers, and logos, including those on screens, signs, posters, and packages. Replace them with plain colors or simple pictures. Change nothing else.
```

1コマ目の上が空いていない:

```text
Edit this image. In panel 1, make the top quarter of the panel a plain empty wall with nothing on it, by moving or shrinking anything that is there. Keep everything else the same.
```

人物の見た目がコマによって違う:

```text
Edit this image. Make [the grandmother] look exactly the same in all three panels: [an elderly woman with short gray hair, wearing a purple cardigan]. Change nothing else.
```

コマの大きさがそろっていない、矢印や飾りがある:

```text
Edit this image. Make the three panels exactly the same size, each with a thin black border, separated by plain white gaps with nothing in them. Remove any arrows. Keep the contents of each panel the same.
```

---

## Set 1 — Saving Leftover Food

パッセージ66語。

```text
Saving Leftover Food

Many restaurants and bakeries throw away food that is not sold by the end of the day. Now, some shops are using smartphone apps to sell such food at lower prices. Customers order the food through an app and pick it up before the shop closes. By doing so, they can save money and help reduce food waste. These apps are becoming popular in many cities.
```

**No.1** — According to the passage, how can customers save money and help reduce food waste?

解答例: By ordering food through an app and picking it up before the shop closes.

**カードの1文**: One day, Mr. and Mrs. Mori were talking about an app for buying leftover food.

| コマ | 矢印の語句 | 内容 |
| --- | --- | --- |
| 1 | — | 妻がスマホを見せる。せりふ "Let's buy some bread from the bakery near the station." |
| 2 | That evening | 夫がパン屋で大きな袋を受け取る。家族でパンを食べるところを思い浮かべる |
| 3 | The next morning | 食卓にパンがたくさん残っている。妻が近所の人に分けることを考える |

**3コマ漫画 生成プロンプト**

```text
Characters: Mr. Mori, a man in his forties with short black hair and glasses, wearing a navy sweater. Mrs. Mori, a woman in her forties with shoulder-length brown hair, wearing a yellow cardigan over a white shirt.
Panel 1 (living room): Mrs. Mori stands on the LEFT, holding up her smartphone and showing its screen to Mr. Mori, who sits on a sofa on the RIGHT. The phone screen shows only a simple picture of bread. Mrs. Mori is talking with her mouth open. Keep the top quarter of this panel as a plain empty wall with nothing on it.
Panel 2 (a small bakery in the evening, orange sunset light through the window): most of the bread shelves behind the counter are empty. A young female clerk in a white apron and white cap hands a large paper bag full of bread across the counter to Mr. Mori, who smiles. Above Mr. Mori's head, a cloud-shaped thought bubble shows Mr. and Mrs. Mori happily eating bread together at a dinner table.
Panel 3 (the kitchen the next morning, bright sunlight through the window): the dining table is covered with many loaves and rolls of leftover bread. Mrs. Mori stands next to the table with a troubled face and one hand on her cheek. Above her head, a cloud-shaped thought bubble shows Mrs. Mori handing a paper bag of bread to an older woman with gray hair at a front door.
```

**No.2 想定解答**（画像を見て直す）

- One day, Mr. and Mrs. Mori were talking about an app for buying leftover food.
- Mrs. Mori said to her husband, "Let's buy some bread from the bakery near the station."
- That evening, Mr. Mori got a big bag of bread at the bakery.
- He was looking forward to eating it with his family.
- The next morning, there was still a lot of bread on the table.
- Mrs. Mori was thinking of giving some of it to their neighbor.

**No.3** — Some people say that people in Japan waste too much food. What do you think about that?

**No.4** — Today, many people have food delivered to their homes. Do you think more people will use food delivery services in the future?

---

## Set 2 — Working from Home

パッセージ64語。

```text
Working from Home

More and more companies now allow their workers to work from home. Workers do not have to ride crowded trains every day, so they can use their time more effectively. Some companies have also made their offices smaller. By doing so, they are able to save money on rent. However, some workers feel lonely because they cannot talk with their coworkers face to face.
```

**No.1** — According to the passage, how are some companies able to save money on rent?

解答例: By making their offices smaller.

**カードの1文**: One day, Mr. Ota was working from home.

| コマ | 矢印の語句 | 内容 |
| --- | --- | --- |
| 1 | — | 妻が子どもを連れて出かける。せりふ "I'll take the children to the park so you can work quietly." |
| 2 | During an online meeting | 犬が机に飛び乗り、画面に映って同僚が笑う |
| 3 | That evening | 夫が机を小さな部屋に運び込む。犬はしょんぼり |

**3コマ漫画 生成プロンプト**

```text
Characters: Mr. Ota, a man in his thirties with short brown hair, wearing a light blue shirt. Mrs. Ota, a woman in her thirties with a black ponytail, wearing a green jacket. Their son, about six years old, wearing a red cap, and their daughter, about four years old, wearing a yellow hat. A small white dog with brown ears.
Panel 1 (a home office corner in a living room): Mr. Ota sits at a desk with a laptop on the RIGHT. Mrs. Ota stands at the door of the room on the LEFT, holding the two children's hands, ready to go out, and talking to him with her mouth open. The small white dog lies on the floor near the desk. Keep the top quarter of this panel as a plain empty wall with nothing on it.
Panel 2 (the same desk, during an online meeting): the laptop is turned so that the viewer can see its screen, which shows four small faces of coworkers, all laughing. The white dog has jumped up onto the desk and is standing right in front of the laptop camera. Mr. Ota looks surprised, with both hands raised.
Panel 3 (the evening, orange light through the window): Mr. Ota is carrying his desk through the open door of a small room. The white dog sits in the hallway, looking sad with its ears down. Mrs. Ota and the two children, back home, watch from behind and smile.
```

**No.2 想定解答**（画像を見て直す）

- One day, Mr. Ota was working from home.
- His wife said to him, "I'll take the children to the park so you can work quietly."
- During an online meeting, the family's dog jumped onto Mr. Ota's desk.
- His coworkers laughed when they saw the dog on the screen.
- That evening, Mr. Ota was moving his desk into a small room.
- The dog looked sad.

**No.3** — Some people say that students can learn as well in online classes as in classrooms. What do you think about that?

**No.4** — Today, many people use social media to keep in touch with their friends. Do you think people spend too much time on social media?

---

## Set 3 — Preparing for Disasters

パッセージ59語。

```text
Preparing for Disasters

Japan often has natural disasters such as earthquakes and typhoons. For this reason, many local governments hold disaster drills for residents. People practice walking to shelters and learn how to use emergency goods. By doing so, they can act quickly when a real disaster happens. These drills also give neighbors a good chance to get to know each other.
```

**No.1** — According to the passage, how can people act quickly when a real disaster happens?

解答例: By practicing walking to shelters and learning how to use emergency goods.

**カードの1文**: One day, the Tanaka family was talking about a disaster drill in their town.

| コマ | 矢印の語句 | 内容 |
| --- | --- | --- |
| 1 | — | 夫が壁のポスターを指さす。せりふ "Let's join the drill this Sunday." |
| 2 | On Sunday at the park | 息子が消火器の使い方を習う。妻は非常用持ち出し袋を思い浮かべる |
| 3 | That night | 妻が袋に水と食料を詰める。夫の懐中電灯がつかない |

**3コマ漫画 生成プロンプト**

```text
Characters: Mr. Tanaka, a man in his forties with short black hair, wearing a gray polo shirt. Mrs. Tanaka, a woman in her forties with a short bob haircut, wearing a pink sweater. Their son, about ten years old, with spiky black hair, wearing a blue T-shirt.
Panel 1 (living room): Mr. Tanaka stands on the LEFT, pointing at a poster on the wall at shoulder height and talking with his mouth open. The poster shows only a simple green pictogram of a person running toward a house shape, with no text. Mrs. Tanaka and their son sit at a table on the RIGHT, listening. Keep the top quarter of this panel as a plain empty wall with nothing on it.
Panel 2 (a park on a sunny day with green trees): the son is spraying a red fire extinguisher at a small orange training cone, while a firefighter in a navy uniform and helmet stands next to him and guides him. Mrs. Tanaka stands nearby, watching. Above Mrs. Tanaka's head, a cloud-shaped thought bubble shows an open backpack with water bottles, canned food, and a flashlight inside.
Panel 3 (at home at night, a dark window with the moon): Mrs. Tanaka kneels on the floor, putting water bottles and canned food into a backpack. Mr. Tanaka is holding a flashlight and pressing its switch, but no light comes out. He looks surprised. The son watches next to him.
```

**No.2 想定解答**（画像を見て直す）

- One day, the Tanaka family was talking about a disaster drill in their town.
- Mr. Tanaka said to his family, "Let's join the drill this Sunday."
- On Sunday at the park, their son was learning how to use a fire extinguisher.
- Mrs. Tanaka was thinking of preparing an emergency bag.
- That night, Mrs. Tanaka was putting water and food into a bag.
- Mr. Tanaka found that the flashlight did not work.

**No.3** — Some people say that schools should spend more time teaching students what to do in a disaster. What do you think about that?

**No.4** — Today, many people do volunteer work in their local communities. Do you think more young people should take part in such activities?

---

## Set 4 — Self-Checkout Machines

パッセージ62語。

```text
Self-Checkout Machines

Many supermarkets do not have enough workers these days. For this reason, more stores have started using self-checkout machines. Customers scan their items and pay for them by themselves at these machines. Some stores have introduced many such machines. In this way, they can serve a lot of customers with fewer workers. However, some elderly people find the machines difficult to use.
```

**No.1** — According to the passage, how can some stores serve a lot of customers with fewer workers?

解答例: By introducing many self-checkout machines.

**カードの1文**: One day, Yuki went to a supermarket with her grandmother.

| コマ | 矢印の語句 | 内容 |
| --- | --- | --- |
| 1 | — | ユキがセルフレジを指さす。せりふ "I'll show you how to use this machine." |
| 2 | A few minutes later | 祖母が自分で商品を読み取る。次は1人で買い物できると思う |
| 3 | The next week | 祖母が1人でセルフレジにいて、赤いランプがつき困っている。店員が助けに来る |

**3コマ漫画 生成プロンプト**

```text
Characters: Yuki, a high school girl with long black hair, wearing a white hoodie and jeans. Her grandmother, an elderly woman with short gray hair, wearing a purple cardigan and carrying a shopping basket with vegetables.
Panel 1 (the checkout area of a supermarket with three self-checkout machines; the machine screens are plain and show nothing): Yuki stands on the LEFT, pointing at one of the machines and talking with her mouth open. Her grandmother stands on the RIGHT, holding the shopping basket and looking curious. Keep the top quarter of this panel as a plain empty wall with nothing on it.
Panel 2 (the same machine): the grandmother is scanning a vegetable over the machine's scanner by herself, smiling proudly. Yuki stands next to her, smiling and giving a thumbs-up. Above the grandmother's head, a cloud-shaped thought bubble shows the grandmother happily shopping alone in the supermarket with a basket.
Panel 3 (the same self-checkout area, without Yuki): the grandmother is alone at the machine. A red warning lamp on top of the machine is lit. She looks confused and worried. A young male store clerk in a green apron is hurrying toward her to help.
```

**No.2 想定解答**（画像を見て直す）

- One day, Yuki went to a supermarket with her grandmother.
- Yuki said to her grandmother, "I'll show you how to use this machine."
- A few minutes later, her grandmother was scanning the items by herself.
- She thought she could go shopping alone next time.
- The next week, Yuki's grandmother was at the supermarket by herself.
- She had trouble with the machine, and a store clerk was coming to help her.

**No.3** — Some people say that robots will do many of the jobs that people do now. What do you think about that?

**No.4** — Today, many elderly people use smartphones. Do you think it is easy for elderly people to learn how to use new technology?

---

## Set 5 — Reducing Plastic Waste

パッセージ66語。

```text
Reducing Plastic Waste

Plastic waste has become a serious problem around the world. For this reason, more cafés now give discounts to customers who bring their own cups. Some cities have also set up water stations where people can fill their bottles for free. In this way, they are trying to reduce the number of plastic bottles that people throw away. Many people are becoming interested in such efforts.
```

**No.1** — According to the passage, how are some cities trying to reduce the number of plastic bottles that people throw away?

解答例: By setting up water stations where people can fill their bottles for free.

**カードの1文**: One day, Mr. and Mrs. Ueda were getting ready to go hiking.

| コマ | 矢印の語句 | 内容 |
| --- | --- | --- |
| 1 | — | 妻が水筒を2本見せる。せりふ "We can fill these bottles at the water station." |
| 2 | At the foot of the mountain | 夫が給水所で水筒に水を入れる。妻は山頂からのながめを思い浮かべる |
| 3 | At the top of the mountain | 妻は水を飲む。夫は給水所に水筒を置き忘れたことに気づく |

**3コマ漫画 生成プロンプト**

```text
Characters: Mr. Ueda, a man in his fifties with short gray hair, wearing a red hiking jacket. Mrs. Ueda, a woman in her fifties with short brown hair, wearing a light blue hiking jacket and a white cap. Both carry hiking backpacks.
Panel 1 (the front entrance of their house): Mrs. Ueda stands on the LEFT, holding up two reusable metal water bottles, one blue and one green, and talking with her mouth open. Mr. Ueda stands on the RIGHT, putting on his backpack. Keep the top quarter of this panel as a plain empty wall with nothing on it.
Panel 2 (the foot of a mountain, with a forest trail behind): there is an outdoor stone drinking fountain with a tap. Mr. Ueda is filling the green bottle with water at the tap. Mrs. Ueda stands nearby, holding the blue bottle and looking up at the mountain. Above Mrs. Ueda's head, a cloud-shaped thought bubble shows Mr. and Mrs. Ueda happily looking at a wide view from the mountaintop.
Panel 3 (the top of the mountain, with a wide view of mountains and clouds): Mrs. Ueda is happily drinking from her blue bottle. Mr. Ueda is searching inside his open backpack with a troubled face. Above his head, a cloud-shaped thought bubble shows the green bottle left alone on the stone drinking fountain.
```

**No.2 想定解答**（画像を見て直す）

- One day, Mr. and Mrs. Ueda were getting ready to go hiking.
- Mrs. Ueda said to her husband, "We can fill these bottles at the water station."
- At the foot of the mountain, Mr. Ueda was filling a bottle with water.
- Mrs. Ueda was looking forward to seeing the view from the top.
- At the top of the mountain, Mrs. Ueda was drinking water.
- Mr. Ueda realized that he had left his bottle at the water station.

**No.3** — Some people say that people should stop buying drinks in plastic bottles. What do you think about that?

**No.4** — Today, many people enjoy outdoor activities such as hiking and camping. Do you think more people will enjoy outdoor activities in the future?

---

## アプリに渡すデータ形式

実データは `data/grade2/sets.json`（No.3・No.4 の解答例もここにある）。スキーマは `data/README.md` を参照。

## 残りの作業

- 画像ができたら、No.2 の解答例と `speech.side` を実物に合わせて直す
- アプリ側：3コマと矢印・せりふの表示、No.2 の "Please begin."、No.2 のあとでカードを裏返す流れ、トップページで級を選ぶボタン
- Worker 側：`story` 型の質問と、No.3・No.4 の解答例が「別解の並び」であることの扱い
