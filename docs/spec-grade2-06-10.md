# 英検2級 二次試験 練習セット 6–10 仕様書

最終更新: 2026-11-05

第1〜5回の共通仕様（4問の型、3コマ漫画の作り方、チェックリスト、直す用のプロンプト）は `docs/spec-grade2.md` を参照。ここの生成プロンプトは共通ヘッダーを先頭に入れてあるので、枠の中をそのまま1回で貼ればよい。

## 作業手順

第6〜10回は sets.json に `"draft": true` をつけて入れてある。下書きの回は、生徒の画面には出ない。

1. 各回の「3コマ漫画 生成プロンプト」を貼って生成する（Nano Banana 2 以降。Google AI Studio なら縦横比 21:9）
2. `docs/spec-grade2.md` のチェックリストで確かめ、崩れたコマだけ直させる（直す用のプロンプトも同じファイルにある）
3. 採用した画像を名前を変えずに `images/grade2/_incoming/` に置く
4. `mapping.json` を `{"元のファイル名": "06"}` のようにセット番号だけで書き、`python scripts/rename_images.py grade2` を実行する
5. 画像を見て、No.2 の解答例と `speech.side` を実物に合わせて直し、`"draft": true` の行を消すと生徒に見えるようになる

公開前の回は、URL に `&draft=1` をつけると確認できる（例: `app/?grade=grade2&draft=1&set=grade2-06`）。

第7回の1コマ目は屋外なので、上4分の1は壁ではなく空を空けておく指示にしてある。

---

## Set 6 — Animal Shelters

パッセージ64語。

```text
Animal Shelters

Every year, many dogs and cats in Japan lose their homes. Animal shelters take care of these pets and look for new owners for them. Now, some shelters hold events where people can meet the animals. By doing so, they are able to find new families for more pets. However, owners need to be ready to take care of their pets for many years.
```

**No.1** — According to the passage, how are some animal shelters able to find new families for more pets?

解答例: By holding events where people can meet the animals.

**カードの1文**: One day, Aya was talking with her parents about getting a dog.

| コマ | 矢印の語句 | 内容 |
| --- | --- | --- |
| 1 | — | アヤが両手を合わせて頼む。せりふ "I promise I'll walk the dog every day." |
| 2 | That weekend | 保護施設のイベントでアヤが子犬を抱く。公園で散歩するところを思い浮かべる |
| 3 | A month later | 雨の朝、父が眠そうに犬の散歩をしている。アヤはベッドで寝ていると思う |

**3コマ漫画 生成プロンプト**（共通ヘッダー込み）

```text
Simple, clean educational illustration for an English exam card: a three-panel comic strip arranged in one horizontal row, read from left to right. Flat vector style, clear black outlines, soft flat colors. The three panels are exactly the same size, each surrounded by a thin black rectangular border, and separated by plain white gaps. Draw nothing in the white gaps, and no arrows. The same characters appear in every panel with the same faces, hairstyles, and clothes. Show people from at least the knees up, with their hands and actions clearly visible. Absolutely no letters, words, numbers, logos, or text anywhere in the image, including on screens, signs, posters, and packages. Do not draw speech bubbles. Draw cloud-shaped thought bubbles only where described. Wide landscape image, 21:9 aspect ratio.

Characters: Aya, a girl about ten years old with two short pigtails, wearing a pink sweater. Mr. Kimura, her father, a man in his forties with short black hair and a short beard, wearing a gray sweatshirt. Mrs. Kimura, her mother, a woman in her forties with long brown hair tied back, wearing a green blouse. A small brown puppy with floppy ears.
Panel 1 (living room): Aya stands on the LEFT with her hands pressed together in front of her chest, asking eagerly and talking with her mouth open. Her parents sit side by side on a sofa on the RIGHT, listening with gentle smiles. Keep the top quarter of this panel as a plain empty wall with nothing on it.
Panel 2 (a bright room at an animal shelter, with a few dogs in open pens in the background): Aya is kneeling and hugging the small brown puppy, smiling happily. A female shelter worker in a green apron stands nearby, smiling. Mr. and Mrs. Kimura stand behind Aya, watching. Above Aya's head, a cloud-shaped thought bubble shows Aya happily walking the puppy on a leash in a sunny park.
Panel 3 (the street in front of their house early in the morning, gray sky and rain falling): Mr. Kimura is walking the brown dog on a leash while holding an umbrella. He is yawning and looks sleepy. Above his head, a cloud-shaped thought bubble shows Aya sleeping in her bed.
```

**No.2 想定解答**（画像を見て直す）

- One day, Aya was talking with her parents about getting a dog.
- She said to them, "I promise I'll walk the dog every day."
- That weekend, Aya was holding a puppy at an animal shelter.
- She was looking forward to walking it in the park.
- A month later, Aya's father was walking the dog in the rain.
- He was thinking that Aya was still sleeping.

**No.3** — Some people say that it is good for children to take care of pets. What do you think about that?

- I agree. Taking care of pets teaches children to be responsible. They also learn that all living things are important.
- I disagree. Taking care of pets is hard work for children. In many cases, their parents end up doing most of the work.

**No.4** — Today, there are many cafés where people can play with animals such as cats. Do you think the number of such cafés will increase in the future?

- Yes. (Why?) Many people want to have pets but cannot keep them at home. At such cafés, they can relax with animals easily.
- No. (Why not?) Some people worry that these cafés are stressful for the animals. Also, many people prefer to keep their own pets.

---

## Set 7 — Electric Cars

パッセージ62語。

```text
Electric Cars

Electric cars are becoming more common in Japan. They do not produce harmful gases while they are running, so they are better for the environment than gasoline cars. Some local governments give money to people who buy such cars. By doing so, they are trying to increase the number of electric cars. However, there are still not enough places to charge them.
```

**No.1** — According to the passage, how are some local governments trying to increase the number of electric cars?

解答例: By giving money to people who buy electric cars.

**カードの1文**: One day, the Sato family was going to the beach in their new electric car.

| コマ | 矢印の語句 | 内容 |
| --- | --- | --- |
| 1 | — | 家の前で充電中の車。父が自慢げに指さす。せりふ "The battery is full, so we can drive to the beach without stopping." |
| 2 | On the highway | 渋滞で電池の表示が残りわずか。父は心配し、母は充電することを考える |
| 3 | At a service area | 充電器の前に車が並んでいる。父は腕時計を見て、ケンは退屈している |

**3コマ漫画 生成プロンプト**（共通ヘッダー込み）

```text
Simple, clean educational illustration for an English exam card: a three-panel comic strip arranged in one horizontal row, read from left to right. Flat vector style, clear black outlines, soft flat colors. The three panels are exactly the same size, each surrounded by a thin black rectangular border, and separated by plain white gaps. Draw nothing in the white gaps, and no arrows. The same characters appear in every panel with the same faces, hairstyles, and clothes. Show people from at least the knees up, with their hands and actions clearly visible. Absolutely no letters, words, numbers, logos, or text anywhere in the image, including on screens, signs, posters, and packages. Do not draw speech bubbles. Draw cloud-shaped thought bubbles only where described. Wide landscape image, 21:9 aspect ratio.

Characters: Mr. Sato, a man in his forties with short black hair, wearing a green polo shirt. Mrs. Sato, a woman in her forties with shoulder-length black hair, wearing an orange blouse. Their son Ken, about eight years old, wearing a blue cap and a yellow T-shirt. A small white electric car.
Panel 1 (in front of their house in the morning): the small white electric car is parked with a charging cable connected from the car to a charger on the house wall. Mr. Sato stands on the LEFT, pointing at the car proudly and talking with his mouth open. Mrs. Sato and Ken stand on the RIGHT, holding a beach bag and a beach ball. Keep the top quarter of this panel as plain empty sky with nothing in it.
Panel 2 (inside the white car on a highway, seen from behind the front seats): Mr. Sato is driving and Mrs. Sato sits in the passenger seat. Through the windshield, many cars are stopped in a long traffic jam. On the car's dashboard screen, a large red battery pictogram is almost empty, with no numbers. Mr. Sato turns his face to the side and looks worried. Above Mrs. Sato's head, a cloud-shaped thought bubble shows the white car connected to a charger.
Panel 3 (a charging station at a highway service area, daytime): four electric cars are waiting in a line in front of a single charger, and the white car is at the end of the line. Mr. Sato stands next to the white car, looking at his watch with a tired face. Ken sits on a bench nearby with his chin in his hands, looking bored. Mrs. Sato sits next to Ken.
```

**No.2 想定解答**（画像を見て直す）

- One day, the Sato family was going to the beach in their new electric car.
- Mr. Sato said to his family, "The battery is full, so we can drive to the beach without stopping."
- On the highway, there was a traffic jam, and the battery was getting low.
- Mrs. Sato was thinking of charging the car.
- At a service area, many cars were waiting to use the charger.
- Mr. Sato was looking at his watch, and Ken looked bored.

**No.3** — Some people say that people should use public transportation instead of their own cars. What do you think about that?

- I agree. Using public transportation is better for the environment. It can also reduce traffic jams in big cities.
- I disagree. In the countryside, there are not many buses or trains. People there need their own cars in their daily lives.

**No.4** — Today, some companies are developing cars that can drive themselves. Do you think such cars will become common in the future?

- Yes. (Why?) Technology is improving very quickly. Such cars will also help elderly people who cannot drive.
- No. (Why not?) Many people are worried about accidents caused by such cars. It will take a long time to make them safe enough.

---

## Set 8 — Crowded Tourist Spots

パッセージ62語。

```text
Crowded Tourist Spots

The number of tourists visiting Japan has been increasing. Some famous places are now so crowded that local people have trouble taking buses to work or school. For this reason, some cities have started charging tourists special fees. By doing so, they hope to reduce crowds and keep their towns clean. Other cities are telling tourists about places that are less famous.
```

**No.1** — According to the passage, how do some cities hope to reduce crowds and keep their towns clean?

解答例: By charging tourists special fees.

**カードの1文**: One day, Kenta and his parents were on a trip to a famous old town.

| コマ | 矢印の語句 | 内容 |
| --- | --- | --- |
| 1 | — | 旅館の部屋でケンタがタブレットの寺の写真を見せる。せりふ "Let's go to the temple early tomorrow morning before it gets crowded." |
| 2 | The next morning | 朝の寺はすいている。母が写真を撮る。父はカフェで和菓子を食べるところを思い浮かべる |
| 3 | That afternoon | 午後の商店街は大混雑。カフェの前に長い行列ができていて、父はがっかりしている |

**3コマ漫画 生成プロンプト**（共通ヘッダー込み）

```text
Simple, clean educational illustration for an English exam card: a three-panel comic strip arranged in one horizontal row, read from left to right. Flat vector style, clear black outlines, soft flat colors. The three panels are exactly the same size, each surrounded by a thin black rectangular border, and separated by plain white gaps. Draw nothing in the white gaps, and no arrows. The same characters appear in every panel with the same faces, hairstyles, and clothes. Show people from at least the knees up, with their hands and actions clearly visible. Absolutely no letters, words, numbers, logos, or text anywhere in the image, including on screens, signs, posters, and packages. Do not draw speech bubbles. Draw cloud-shaped thought bubbles only where described. Wide landscape image, 21:9 aspect ratio.

Characters: Kenta, a high school boy with short black hair, wearing a white T-shirt and a navy jacket. His father, a man in his fifties with short gray hair and glasses, wearing a brown jacket. His mother, a woman in her fifties with short black hair, wearing a beige coat and carrying a small shoulder bag.
Panel 1 (a Japanese-style hotel room in the evening, with a dark window): Kenta sits on the LEFT, holding up a tablet and showing its screen to his parents. The screen shows only a simple picture of a temple. Kenta is talking with his mouth open. His parents sit on the RIGHT at a low table with cups of tea, listening. Keep the top quarter of this panel as a plain empty wall with nothing on it.
Panel 2 (the grounds of an old wooden temple early in the morning, soft morning light, nobody else around): his mother is taking a picture with a camera of Kenta and his father standing in front of the temple. Above the father's head, a cloud-shaped thought bubble shows the three of them happily eating Japanese sweets at a small café.
Panel 3 (a narrow shopping street in the afternoon, very crowded, with many tourists drawn small and simply in the background): a very long line of people is waiting in front of a small café. Kenta and his parents stand at the end of the line. The father looks disappointed, and the mother looks tired.
```

**No.2 想定解答**（画像を見て直す）

- One day, Kenta and his parents were on a trip to a famous old town.
- Kenta said to his parents, "Let's go to the temple early tomorrow morning before it gets crowded."
- The next morning, there were no other people at the temple, and Kenta's mother was taking a picture.
- Kenta's father was looking forward to eating Japanese sweets at a café.
- That afternoon, the shopping street was very crowded.
- There was a long line in front of the café, and Kenta's father was disappointed.

**No.3** — Some people say that Japan should welcome more tourists from other countries. What do you think about that?

- I agree. Tourists spend a lot of money at shops and hotels, so it is good for the economy. It is also a good chance for Japanese people to learn about other cultures.
- I disagree. Too many tourists cause problems such as crowded trains and trash on the streets. Japan should solve these problems first.

**No.4** — Today, many young people want to study abroad. Do you think it is a good idea for high school students to study abroad?

- Yes. (Why?) Students can improve their foreign language skills quickly. They can also learn to see things from different points of view.
- No. (Why not?) Studying abroad costs a lot of money. High school students should learn more about their own country first.

---

## Set 9 — Staying Safe in the Heat

パッセージ64語。

```text
Staying Safe in the Heat

Summers in Japan have been getting hotter in recent years. Many people suffer from heatstroke, especially elderly people and small children. Now, some cities have opened cool rest areas in public places such as libraries and shopping malls. By doing so, they are trying to protect people from the heat. Experts also advise people to drink water often, even when they are not thirsty.
```

**No.1** — According to the passage, how are some cities trying to protect people from the heat?

解答例: By opening cool rest areas in public places such as libraries and shopping malls.

**カードの1文**: One summer day, Taro and his father were going to watch a baseball game.

| コマ | 矢印の語句 | 内容 |
| --- | --- | --- |
| 1 | — | 母が帽子と水筒を2つずつ差し出す。タロウは受け取るが、父は小さなかばんだけで出かける。せりふ "It's going to be very hot today. Don't forget to take these." |
| 2 | At the stadium | 炎天下の球場。タロウは帽子をかぶって水を飲む。父は帽子なしで汗だくになり、冷たい飲み物を思い浮かべる |
| 3 | During the game | 球場の涼しい部屋で父が首に冷たいタオルを当てて休む。係の人が水を渡し、タロウは心配している |

**3コマ漫画 生成プロンプト**（共通ヘッダー込み）

```text
Simple, clean educational illustration for an English exam card: a three-panel comic strip arranged in one horizontal row, read from left to right. Flat vector style, clear black outlines, soft flat colors. The three panels are exactly the same size, each surrounded by a thin black rectangular border, and separated by plain white gaps. Draw nothing in the white gaps, and no arrows. The same characters appear in every panel with the same faces, hairstyles, and clothes. Show people from at least the knees up, with their hands and actions clearly visible. Absolutely no letters, words, numbers, logos, or text anywhere in the image, including on screens, signs, posters, and packages. Do not draw speech bubbles. Draw cloud-shaped thought bubbles only where described. Wide landscape image, 21:9 aspect ratio.

Characters: Taro, a boy about ten years old with short black hair, wearing a red T-shirt. Mr. Ishii, his father, a man in his forties with short black hair and a mustache, wearing a white T-shirt and jeans. Mrs. Ishii, his mother, a woman in her forties with a short bob haircut, wearing a light blue apron.
Panel 1 (the front entrance of their house, with bright sunshine coming in through the open front door): Mrs. Ishii stands on the LEFT, holding out two caps and two water bottles and talking with her mouth open. Taro stands in the middle, happily taking one cap and one water bottle. Mr. Ishii stands on the RIGHT at the open door, carrying only a small bag and already stepping outside. Keep the top quarter of this panel as a plain empty wall with nothing on it.
Panel 2 (the seats of a baseball stadium under a strong, burning sun): Taro, wearing a cap, is drinking from his water bottle. Mr. Ishii, without a cap and without a water bottle, is sweating a lot and wiping his face with a towel. Above Mr. Ishii's head, a cloud-shaped thought bubble shows a glass of cold juice with ice cubes.
Panel 3 (a cool first-aid room in the stadium, with a bed and an electric fan): Mr. Ishii sits on the bed with a cold wet towel on the back of his neck, looking tired. A female staff member in a yellow polo shirt is handing him a bottle of water. Taro stands next to him, looking worried.
```

**No.2 想定解答**（画像を見て直す）

- One summer day, Taro and his father were going to watch a baseball game.
- Taro's mother said to them, "It's going to be very hot today. Don't forget to take these."
- At the stadium, Taro was drinking water, but his father was sweating a lot.
- Taro's father wanted something cold to drink.
- During the game, Taro's father was not feeling well, so he was resting in a cool room.
- A staff member was giving him some water, and Taro looked worried.

**No.3** — Some people say that schools should have fewer outdoor activities in summer. What do you think about that?

- I agree. It is dangerous for students to exercise outside on very hot days. Schools should move such activities to cooler seasons.
- I disagree. Students can stay safe if they drink water often and take breaks. Outdoor activities are also important for their health.

**No.4** — Today, many people use air conditioners for many hours in summer. Do you think people should try to use less electricity?

- Yes. (Why?) Producing electricity can cause pollution. People can save electricity by using fans or wearing cool clothes.
- No. (Why not?) Summers are becoming dangerously hot. People should use air conditioners to protect their health.

---

## Set 10 — Learning at Any Age

パッセージ60語。

```text
Learning at Any Age

Many people in Japan want to keep learning after they finish school. Some community centers offer cheap classes in subjects such as English, computers, and cooking. Local people can join these classes in the evenings or on weekends. By doing so, they can learn new skills and make new friends. Such classes are especially popular among people who have retired.
```

**No.1** — According to the passage, how can local people learn new skills and make new friends?

解答例: By joining classes at community centers in the evenings or on weekends.

**カードの1文**: One day, Miki was talking with her grandfather about a computer class.

| コマ | 矢印の語句 | 内容 |
| --- | --- | --- |
| 1 | — | ミキがパソコン教室のちらしを見せる。せりふ "Why don't you join the computer class at the community center?" |
| 2 | A few weeks later | 祖父が教室でパソコンを習っている。ミキとビデオ通話するところを思い浮かべる |
| 3 | A month later | 夜、ミキがテスト勉強をしていると、祖父からビデオ通話がかかってきて困っている |

**3コマ漫画 生成プロンプト**（共通ヘッダー込み）

```text
Simple, clean educational illustration for an English exam card: a three-panel comic strip arranged in one horizontal row, read from left to right. Flat vector style, clear black outlines, soft flat colors. The three panels are exactly the same size, each surrounded by a thin black rectangular border, and separated by plain white gaps. Draw nothing in the white gaps, and no arrows. The same characters appear in every panel with the same faces, hairstyles, and clothes. Show people from at least the knees up, with their hands and actions clearly visible. Absolutely no letters, words, numbers, logos, or text anywhere in the image, including on screens, signs, posters, and packages. Do not draw speech bubbles. Draw cloud-shaped thought bubbles only where described. Wide landscape image, 21:9 aspect ratio.

Characters: Miki, a high school girl with a long black ponytail, wearing a navy cardigan. Her grandfather, an elderly man with white hair and round glasses, wearing a brown vest over a white shirt.
Panel 1 (her grandfather's living room): Miki sits on the LEFT, holding a leaflet that shows only a simple picture of a laptop, and talking with her mouth open. Her grandfather sits on the RIGHT, holding a cup of tea and looking at the leaflet with interest. Keep the top quarter of this panel as a plain empty wall with nothing on it.
Panel 2 (a classroom at a community center, with a few other elderly students working at laptops in the background): her grandfather is typing on a laptop and smiling happily. A young male teacher stands next to him, pointing at the laptop screen. All the laptop screens show only simple pictures, with no text. Above the grandfather's head, a cloud-shaped thought bubble shows the grandfather and Miki talking happily on a video call.
Panel 3 (Miki's room at night, with a dark window and the moon): Miki sits at her desk with open textbooks and notebooks, holding a pencil. Her smartphone on the desk is ringing, shown with short vibration lines, and its screen shows only her grandfather's smiling face. Miki looks troubled, holding her head with one hand.
```

**No.2 想定解答**（画像を見て直す）

- One day, Miki was talking with her grandfather about a computer class.
- She said to him, "Why don't you join the computer class at the community center?"
- A few weeks later, her grandfather was learning how to use a computer.
- He was looking forward to talking with Miki on a video call.
- A month later, Miki was studying for a test at night.
- Her grandfather was calling her, so she looked troubled.

**No.3** — Some people say that people should keep studying even after they start working. What do you think about that?

- I agree. The world is changing quickly, so people need to learn new skills. Studying can also help them get better jobs.
- I disagree. Many workers are already very busy with their jobs. They need time to rest and spend with their families.

**No.4** — Today, many people use smartphone apps to learn foreign languages. Do you think apps are a good way to learn a foreign language?

- Yes. (Why?) People can study with apps anytime and anywhere. Many apps are also free or cheap.
- No. (Why not?) It is difficult to practice speaking with apps. Talking with real people is a better way to learn.
