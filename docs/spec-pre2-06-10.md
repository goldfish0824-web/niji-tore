# 英検準2級 二次試験 練習セット 6–10 仕様書

最終更新: 2026-11-05

第1〜5回の共通仕様（5問の型、チェックリスト）は `docs/spec-pre2.md` を参照。ここの生成プロンプトは共通ヘッダーを先頭に入れてあるので、枠の中をそのまま1回で貼ればよい。

## 作業手順

第6〜10回は sets.json に `"draft": true` をつけて入れてある。下書きの回は、生徒の画面には出ない。

1. 各回の「イラストA」「イラストB」のプロンプトを貼って生成する（Nano Banana 2 以降）
2. `docs/spec-pre2.md` のチェックリストで確かめ、崩れた箇所だけ直させる
3. 採用した画像を名前を変えずに `images/pre2/_incoming/` に置く
4. `mapping.json` を `{"イラストAの元のファイル名": "06-a", "イラストBの元のファイル名": "06-b"}` の形で書き、`python scripts/rename_images.py pre2` を実行する
5. 画像を見て、No.2 の想定解答と No.3 の解答例を実物に合わせて直し、`"draft": true` の行を消すと生徒に見えるようになる

公開前の回は、URL に `&draft=1` をつけると確認できる（例: `app/?grade=pre2&draft=1&set=pre2-06`）。

## 取り込みの記録（2026-11-21）

- 第7〜10回：画像を取り込み、No.2・No.3 の解答例が絵と合っていることを確かめて公開した
- 第7回イラストA：左上の空に緑色のにじみがあったので、背景の色で塗りつぶした。元の画像は `images/pre2/_incoming/_archive/` にある
- 第6回イラストB：上着が小さすぎることが絵から読み取りにくい（袖が七分丈に見え、吹き出しの中とも差がない）ので、描き直すまで下書きのままにしている

第6回イラストBは、今の画像（`images/pre2/pre2-06-b.jpg`）を Gemini にアップロードして、これを貼る。

```text
Edit this image. Make the brown jacket that the man is wearing in the real scene (not in the thought bubble) obviously far too small for him: the sleeves end just below his elbows, the jacket is so short that it ends well above his belt, and the front is pulled tight and cannot be buttoned, with a wide gap showing his white shirt. In the thought bubble, show the same man wearing the same brown jacket in a bigger size that fits him perfectly, with the sleeves reaching his wrists and the front neatly buttoned. Keep everything else the same. Do not add any text.
```

できた画像を `images/pre2/_incoming/` に置き、mapping.json に `"06-b"` と書いて rename_images.py を実行すれば差し替わる。

## イラストBの型

第1〜5回（両手がふさがっている／道具が壊れている／禁止マーク／高くて届かない／行列が長い）と重ならないようにした。

| 回 | 型 | 解答例 |
| --- | --- | --- |
| 第6回 | サイズが合わない | He wants to buy the jacket, but it is too small for him. |
| 第7回 | 雨が降っている | She wants to play tennis, but it is raining. |
| 第8回 | 電池が切れている | She wants to pay with her smartphone, but its battery is dead. |
| 第9回 | 重すぎて運べない | The box is too heavy, so he can't carry it. |
| 第10回 | 乗り物が出てしまった | She wants to take the bus, but it has just left. |

---

## Set 6 — Secondhand Clothes

パッセージ49語。イラストBは「サイズが合わない」型。

```text
Secondhand Clothes

Many young people like fashion, but new clothes are often expensive. These days, some stores buy used clothes and sell them at low prices. Many students shop at such stores. In this way, they can enjoy fashion without spending much money. These stores are also good for the environment.
```

**No.1** — According to the passage, how can many students enjoy fashion without spending much money?

解答例: By shopping at stores that sell used clothes at low prices.

**イラストA 生成プロンプト**（共通ヘッダー込み）

```text
Simple, clean educational illustration for an English exam card. Flat vector style, clear black outlines, soft flat colors. Plain light background with only the objects the scene needs. Draw every person full-body, clearly separated from the others, with hands and actions unmistakably visible. Absolutely no letters, words, numbers, logos, or text signs anywhere in the image. Landscape orientation, 4:3.

Scene: inside a bright secondhand clothing store with racks of clothes, shelves, and a tall mirror on the wall. Exactly five people, evenly spaced, each doing one clear action: (1) a woman looking at herself in the tall mirror while holding a dress in front of her body, (2) a man folding T-shirts on a table, (3) a girl trying on a straw hat, (4) a boy sitting on a low stool and tying his shoelaces, (5) a woman walking while carrying two large paper shopping bags, one in each hand. No other people in the scene.
```

**No.2 想定解答**（画像を見て直す）

- A woman is looking in the mirror.
- A man is folding T-shirts.
- A girl is trying on a hat.
- A boy is tying his shoes.
- A woman is carrying shopping bags.

**イラストB 生成プロンプト**（共通ヘッダー込み）

```text
Simple, clean educational illustration for an English exam card. Flat vector style, clear black outlines, soft flat colors. Plain light background with only the objects the scene needs. Draw every person full-body, clearly separated from the others, with hands and actions unmistakably visible. Absolutely no letters, words, numbers, logos, or text signs anywhere in the image. Landscape orientation, 4:3.

Scene: one young man standing next to a clothes rack in a clothing store, with no mirror in the scene. He is wearing a jacket that is obviously far too small for him: the sleeves end well above his wrists, and the front of the jacket cannot close over his stomach. He is looking down at the short sleeves with a disappointed face. Above his head, a cloud-shaped thought bubble shows the same man wearing the same jacket in a bigger size that fits him perfectly, smiling. Only one person in the real scene.
```

**No.3** — 解答例: He wants to buy the jacket, but it is too small for him.

**No.4** — Some people say that young people spend too much money on clothes. What do you think about that?

- I agree. Many young people buy new clothes every season. They should save money for more important things.
- I disagree. Many young people buy cheap clothes at secondhand stores. They are careful about how they use their money.

**No.5** — Today, many people buy things on the Internet. Do you often shop online?

- Yes. (Please tell me more.) I often buy books and clothes online. It is easy to compare prices on the Internet.
- No. (Why not?) I like to see things with my own eyes before I buy them. I usually go shopping with my friends.

---

## Set 7 — Exercise Machines in Parks

パッセージ50語。イラストBは「雨が降っている」型。

```text
Exercise Machines in Parks

Many people want to stay healthy, but going to a gym can be expensive. Now, some cities have put simple exercise machines in parks. Local people can use these machines for free. By doing so, they can exercise every day without spending money. Such parks are popular with elderly people.
```

**No.1** — According to the passage, how can local people exercise every day without spending money?

解答例: By using simple exercise machines in parks for free.

**イラストA 生成プロンプト**（共通ヘッダー込み）

```text
Simple, clean educational illustration for an English exam card. Flat vector style, clear black outlines, soft flat colors. Plain light background with only the objects the scene needs. Draw every person full-body, clearly separated from the others, with hands and actions unmistakably visible. Absolutely no letters, words, numbers, logos, or text signs anywhere in the image. Landscape orientation, 4:3.

Scene: a large green park on a sunny day with a walking path, trees, and benches, and a few simple outdoor exercise machines in the background. Exactly five people, evenly spaced, each doing one clear action: (1) a man jogging along the path, (2) a woman walking a dog on a leash, (3) a boy kicking a soccer ball, (4) a girl sitting on a bench and drinking water from a bottle, (5) an elderly woman stretching with both arms raised high above her head. No other people in the scene.
```

**No.2 想定解答**（画像を見て直す）

- A man is jogging.
- A woman is walking a dog.
- A boy is kicking a ball.
- A girl is drinking water.
- A woman is stretching.

**イラストB 生成プロンプト**（共通ヘッダー込み）

```text
Simple, clean educational illustration for an English exam card. Flat vector style, clear black outlines, soft flat colors. Plain light background with only the objects the scene needs. Draw every person full-body, clearly separated from the others, with hands and actions unmistakably visible. Absolutely no letters, words, numbers, logos, or text signs anywhere in the image. Landscape orientation, 4:3.

Scene: one young woman standing inside her house at a large window, holding a tennis racket in one hand and looking outside. Heavy rain is falling outside the window, shown with clear rain lines and puddles. Her eyebrows are lowered and her mouth is turned down, so she clearly looks disappointed. Above her head, a cloud-shaped thought bubble shows the same woman happily playing tennis on a sunny tennis court. Only one person in the real scene.
```

**No.3** — 解答例: She wants to play tennis, but it is raining.

**No.4** — Some people say that schools should have more P.E. classes. What do you think about that?

- I agree. Many students do not get enough exercise these days. P.E. classes are also a good way to relieve stress.
- I disagree. Students need more time to study other subjects. They can exercise in club activities after school.

**No.5** — Today, many people exercise to stay healthy. Do you do any exercise outside school?

- Yes. (Please tell me more.) I go jogging near my house every morning. It helps me feel refreshed before school.
- No. (Why not?) I am too busy with homework and club activities. I get enough exercise at school.

---

## Set 8 — Paying with Smartphones

パッセージ46語。イラストBは「電池が切れている」型。

```text
Paying with Smartphones

In Japan, more and more people are paying without cash. At many shops, customers can pay just by holding their smartphones over a small machine. In this way, they can pay quickly without carrying coins. However, some people still feel safer using cash, especially elderly people.
```

**No.1** — According to the passage, how can customers pay quickly without carrying coins?

解答例: By holding their smartphones over a small machine.

**イラストA 生成プロンプト**（共通ヘッダー込み）

```text
Simple, clean educational illustration for an English exam card. Flat vector style, clear black outlines, soft flat colors. Plain light background with only the objects the scene needs. Draw every person full-body, clearly separated from the others, with hands and actions unmistakably visible. Absolutely no letters, words, numbers, logos, or text signs anywhere in the image. Landscape orientation, 4:3.

Scene: a food court in a shopping mall, with tables, chairs, and a self-order kiosk whose screen shows only a simple picture of a hamburger. Exactly five people, evenly spaced, each doing one clear action: (1) a man walking while carrying a tray with a hamburger and a drink, (2) a woman paying by holding her smartphone over a small payment machine at the self-order kiosk, (3) a girl drinking juice through a straw at a table, (4) a boy eating noodles with chopsticks at a table, (5) a man cleaning the floor with a mop. No other people in the scene, and no staff behind any counter.
```

**No.2 想定解答**（画像を見て直す）

- A man is carrying a tray.
- A woman is paying with her smartphone.
- A girl is drinking juice.
- A boy is eating noodles.
- A man is cleaning the floor.

**イラストB 生成プロンプト**（共通ヘッダー込み）

```text
Simple, clean educational illustration for an English exam card. Flat vector style, clear black outlines, soft flat colors. Plain light background with only the objects the scene needs. Draw every person full-body, clearly separated from the others, with hands and actions unmistakably visible. Absolutely no letters, words, numbers, logos, or text signs anywhere in the image. Landscape orientation, 4:3.

Scene: one woman standing in front of a small payment machine on a shop counter, with no clerk visible. She has a shopping basket with bread and milk on one arm, and she is holding up her smartphone in the other hand. The smartphone screen is black except for one simple red battery pictogram that is completely empty, with no numbers. She looks troubled, with her eyebrows lowered. Above her head, a cloud-shaped thought bubble shows the same woman smiling while holding her smartphone over the payment machine. Only one person in the scene.
```

**No.3** — 解答例: She wants to pay with her smartphone, but its battery is dead.

**No.4** — Some people say that children should learn how to use money wisely at school. What do you think about that?

- I agree. Many young people pay with smartphones, so they do not notice how much they spend. Learning about money at school will help them in the future.
- I disagree. Children can learn about money from their parents at home. Schools should spend more time on other subjects.

**No.5** — Today, many people go to shopping malls on weekends. Do you often go to shopping malls?

- Yes. (Please tell me more.) I often go to a shopping mall near the station with my friends. We enjoy eating at the food court.
- No. (Why not?) Shopping malls are always crowded on weekends. I prefer to stay home and relax.

---

## Set 9 — Delivery Boxes

パッセージ49語。イラストBは「重すぎて運べない」型。

```text
Delivery Boxes

Online shopping has become popular, and delivery workers are busier than before. Now, many apartment buildings have delivery boxes near their entrances. Workers can leave packages in these boxes when people are not at home. By doing so, workers can save time. People can also get their packages anytime.
```

**No.1** — According to the passage, how can delivery workers save time?

解答例: By leaving packages in delivery boxes when people are not at home.

**イラストA 生成プロンプト**（共通ヘッダー込み）

```text
Simple, clean educational illustration for an English exam card. Flat vector style, clear black outlines, soft flat colors. Plain light background with only the objects the scene needs. Draw every person full-body, clearly separated from the others, with hands and actions unmistakably visible. Absolutely no letters, words, numbers, logos, or text signs anywhere in the image. Landscape orientation, 4:3.

Scene: the front of an apartment building on a sunny morning, with a small parking area, a garbage collection area, and a row of metal delivery boxes near the entrance. Exactly five people, evenly spaced, each doing one clear action: (1) a woman washing a car with a sponge, (2) a male delivery worker in a plain uniform and cap carrying a cardboard box toward the entrance, (3) a girl jumping rope, (4) a boy riding a skateboard, (5) a man putting a garbage bag in the garbage collection area. No other people in the scene.
```

**No.2 想定解答**（画像を見て直す）

- A woman is washing a car.
- A man is carrying a box.
- A girl is jumping rope.
- A boy is riding a skateboard.
- A man is taking out the garbage.

**イラストB 生成プロンプト**（共通ヘッダー込み）

```text
Simple, clean educational illustration for an English exam card. Flat vector style, clear black outlines, soft flat colors. Plain light background with only the objects the scene needs. Draw every person full-body, clearly separated from the others, with hands and actions unmistakably visible. Absolutely no letters, words, numbers, logos, or text signs anywhere in the image. Landscape orientation, 4:3.

Scene: one man in the entrance hall of an apartment building, next to a row of metal delivery boxes, one of which is open. He is bending over and trying to lift a very large cardboard box from the floor with both hands, but the box does not move at all. His face is red and strained, with sweat drops flying from his head. Above his head, a cloud-shaped thought bubble shows the same man smiling and putting the box down inside his room. Only one person in the scene.
```

**No.3** — 解答例: The box is too heavy, so he can't carry it.

**No.4** — Some people say that shopping online is better than shopping at stores. What do you think about that?

- I agree. People can shop online at any time of day. They do not have to carry heavy things home.
- I disagree. At stores, people can see and touch things before they buy them. They can also ask store staff for advice.

**No.5** — Today, many people live in apartments in big cities. Would you like to live in a big city in the future?

- Yes. (Please tell me more.) There are many shops and restaurants in big cities. I also think it is easy to find a good job there.
- No. (Why not?) Big cities are too crowded and noisy for me. I want to live in a quiet place with a lot of nature.

---

## Set 10 — Community Buses

パッセージ51語。イラストBは「乗り物が出てしまった」型。

```text
Community Buses

In some areas of Japan, there are not many trains or buses. This is a problem for elderly people who cannot drive. Now, some towns run small buses that stop near people's homes. In this way, elderly people can go shopping and visit hospitals easily. Such buses are becoming more common.
```

**No.1** — According to the passage, how can elderly people go shopping and visit hospitals easily?

解答例: By taking small buses that stop near their homes.

**イラストA 生成プロンプト**（共通ヘッダー込み）

```text
Simple, clean educational illustration for an English exam card. Flat vector style, clear black outlines, soft flat colors. Plain light background with only the objects the scene needs. Draw every person full-body, clearly separated from the others, with hands and actions unmistakably visible. Absolutely no letters, words, numbers, logos, or text signs anywhere in the image. Landscape orientation, 4:3.

Scene: a quiet street in a small country town, with a small bus stopped at a bus stop, a few low houses, a small shop, a red post box, and green mountains in the background. Exactly five people, evenly spaced, each doing one clear action: (1) an elderly woman with a walking stick getting off the small bus, (2) a man carrying a large sack of rice on his shoulder, (3) a girl waving her hand, (4) a boy picking up a cap from the ground, (5) a woman putting a letter into the red post box. No other people in the scene, and no driver or passengers visible in the bus.
```

**No.2 想定解答**（画像を見て直す）

- A woman is getting off the bus.
- A man is carrying a bag of rice.
- A girl is waving her hand.
- A boy is picking up a cap.
- A woman is putting a letter into the mailbox.

**イラストB 生成プロンプト**（共通ヘッダー込み）

```text
Simple, clean educational illustration for an English exam card. Flat vector style, clear black outlines, soft flat colors. Plain light background with only the objects the scene needs. Draw every person full-body, clearly separated from the others, with hands and actions unmistakably visible. Absolutely no letters, words, numbers, logos, or text signs anywhere in the image. Landscape orientation, 4:3.

Scene: one woman running on the sidewalk with one arm stretched out toward a bus that is driving away from a bus stop, with a small puff of exhaust behind the bus. The bus is already several meters past the bus stop, which has only a plain round sign with no text. She looks upset, with her mouth open. Above her head, a cloud-shaped thought bubble shows the same woman sitting in a seat on the bus and smiling. Only one person in the scene; no driver or passengers are visible in the bus.
```

**No.3** — 解答例: She wants to take the bus, but it has just left.

**No.4** — Some people say that it is better to live in a small town than in a big city. What do you think about that?

- I agree. People in small towns often know their neighbors well. They can also enjoy a quiet life in nature.
- I disagree. It is not easy to go shopping or see a doctor in small towns. There are also not many jobs there.

**No.5** — Today, many people take buses to get around their towns. Do you often take a bus?

- Yes. (Please tell me more.) I take a bus to the station every day. It is convenient because the bus stop is near my house.
- No. (Why not?) I usually ride a bicycle to school. It is cheaper and faster than taking a bus.
