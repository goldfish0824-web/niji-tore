import { WORKER_URL } from "./config.js";
import { Recorder } from "./recorder.js";

const params = new URLSearchParams(location.search);
const GRADE = params.get("grade");
// 級の指定がなければトップページ（級を選ぶ画面）へ戻す
if (!GRADE) location.replace(new URL("../", location.href));
// 動作確認用: ?timescale=0.1 で黙読・解答の時間を10分の1にする
const TIME_SCALE = Number(params.get("timescale")) || 1;
const ROOT = new URL("../", location.href);
const PASSWORD_KEY = "eiken2ji.password";
const SHOW_TEXT_KEY = "eiken2ji.showText";
const DONE_KEY = "eiken2ji.done";
const REPEAT = "__repeat";
const CONTINUE = "__continue";
const VOICE_RMS = 0.015; // これより大きい音を声として数える
const SPEAK_WARNING_MS = 1500; // 録音していない区間でこれだけ声がしたら注意を出す
const SHORT_ANSWER_MS = 1500; // 録音中の声がこれ未満で「答え終わった」を押したら確かめる
const YES_NO = [
  { label: "Yes と答えた", value: "yes", kind: "primary" },
  { label: "No と答えた", value: "no", kind: "primary" },
];

const $ = (sel) => document.querySelector(sel);
const recorder = new Recorder();
// いまの区間でマイクに入った声の長さ（ミリ秒）。マイクは面接中ずっと開いているので録音前の声も分かる
const voice = { ms: 0, counting: false };

const state = {
  data: null,
  set: null,
  password: "",
  limit: null,
  remaining: null,
  clips: {}, // 録音の名前 → { blob, url, seconds, silent }
  choices: {}, // 問題番号 → "yes" | "no"
  running: null, // 面接中の AbortController
  reviewed: true, // 録音を講評画面で見たか（見ずに閉じようとしたら止める）
  showText: false,
};

// ---------------------------------------------------------------------------
// 起動（呼び出しはファイル末尾。下で宣言する定数を使うため）

async function init() {
  if (!GRADE) return;
  speech.init();
  bindEvents();
  state.showText = storage.get(SHOW_TEXT_KEY) === "1";
  $("#opt-show-text").checked = state.showText;

  try {
    const res = await fetch(new URL(`data/${GRADE}/sets.json`, ROOT));
    if (!res.ok) throw new Error(String(res.status));
    state.data = await res.json();
  } catch {
    fatal("問題データを読み込めませんでした。ページを開き直してください。");
    return;
  }
  document.title = `ニジトレ - ${state.data.gradeLabel}`;
  for (const el of document.querySelectorAll("[data-grade-label]")) el.textContent = state.data.gradeLabel;

  // URL で指定がなければ、まだ練習していない最初の回を選んでおく
  const want = params.get("set");
  const done = doneSets();
  const { sets } = state.data;
  selectSet(sets.find((s) => s.setId === want) || sets.find((s) => !done.includes(s.setId)) || sets[0]);
  renderFlow();
  $("#guide").open = done.length === 0;

  if (!WORKER_URL) {
    $("#offline-note").hidden = false;
    show("ready");
    return;
  }
  const saved = storage.get(PASSWORD_KEY);
  if (saved) $("#password").value = saved;
  show("login");
}

function bindEvents() {
  $("#login-form").addEventListener("submit", onLogin);
  $("#btn-start").addEventListener("click", startInterview);
  $("#opt-show-text").addEventListener("change", (e) => setShowText(e.target.checked));
  $("#btn-toggle-text").addEventListener("click", () => setShowText(!state.showText));
  $("#btn-quit").addEventListener("click", () => {
    if (state.running && confirm("面接を中断しますか？ここまでの録音は消えます。")) {
      state.running.abort("中断しました。");
    }
  });
  $("#btn-feedback").addEventListener("click", requestFeedback);
  $("#btn-self").addEventListener("click", () => renderFeedback(null));
  $("#btn-again").addEventListener("click", backToReady);
  $("#btn-logout").addEventListener("click", () => {
    storage.remove(PASSWORD_KEY);
    $("#password").value = "";
    show("login");
  });

  window.addEventListener("beforeunload", (e) => {
    if (state.running || !state.reviewed) {
      e.preventDefault();
      e.returnValue = "";
    }
  });
  document.addEventListener("visibilitychange", () => {
    // 別のアプリに切り替えると録音も読み上げも止まるので、続けずにやり直してもらう
    if (document.hidden && state.running) {
      state.running.abort("画面を離れたので面接を中断しました。最初からやり直してください。");
    }
  });
}

// ---------------------------------------------------------------------------
// ログイン（パスワードの照合は Worker が行う。ここでは結果を表示するだけ）

async function onLogin(e) {
  e.preventDefault();
  const button = e.submitter || $("#login-form button");
  const pw = $("#password").value.trim();
  if (!pw) return;
  $("#login-error").textContent = "";
  button.disabled = true;
  state.password = pw;
  try {
    const res = await api("/api/check");
    storage.set(PASSWORD_KEY, pw);
    state.limit = res.limit;
    state.remaining = res.remaining;
    backToReady();
  } catch (err) {
    $("#login-error").textContent = err.message;
  } finally {
    button.disabled = false;
  }
}

function backToReady() {
  resetSession();
  renderSetList();
  renderRemaining($("#ready-remaining"));
  $("#btn-logout").hidden = !WORKER_URL;
  show("ready");
}

// ---------------------------------------------------------------------------
// 問題（回）の選択。練習済みの回はこの端末にだけ記録する

function selectSet(set) {
  state.set = set;
  for (const el of document.querySelectorAll("[data-set-title]")) el.textContent = set.title;
  fillCard();
  renderSetList();
}

// 回ごとのカードの色（虹の順）
const SET_COLORS = ["#f0447a", "#f57c1f", "#23a565", "#2f80ed", "#7b5cf0"];

function renderSetList() {
  const done = doneSets();
  $("#set-list").replaceChildren(
    ...state.data.sets.map((s, i) =>
      h(
        "button",
        {
          type: "button",
          class: "set-item",
          role: "radio",
          "aria-checked": String(s === state.set),
          style: `--c: ${SET_COLORS[i % SET_COLORS.length]}`,
          onclick: () => selectSet(s),
        },
        // 小さな画像は scripts/make_thumbs.py が作る。なければ出さない
        h("img", { class: "set-thumb", src: asset(`images/${GRADE}/thumbs/${s.setId}.jpg`), alt: "", onerror: (e) => e.target.remove() }),
        h(
          "span",
          { class: "set-text" },
          h("span", { class: "set-no" }, `第${i + 1}回`),
          h("span", { class: "set-name", lang: "en" }, s.title),
          done.includes(s.setId) && h("span", { class: "set-done" }, "✓ 練習済み")
        ),
        h("span", { class: "set-check", "aria-hidden": "true" }, "✓")
      )
    )
  );
}

/** 準備画面の「流れ」を、級ごとの問題の並びから作る。 */
function renderFlow() {
  const first = state.data.sets[0];
  const qs = first.questions;
  const turn = qs.findIndex((q) => q.type === "opinion" || q.type === "personal");
  const range = (list) =>
    list.length > 2 ? `No.${list[0].no}〜No.${list.at(-1).no}` : list.map((q) => `No.${q.no}`).join("・");
  const story = qs.find((q) => q.type === "story");
  $("#flow").replaceChildren(
    h("li", {}, `パッセージを黙読（${first.reading.prepSeconds}秒）してから音読`),
    h("li", {}, `${range(qs.slice(0, turn))} はカードを見て答える`, story && `（No.${story.no} は3コマの絵を説明する）`),
    h("li", {}, `カードを裏返して ${range(qs.slice(turn))} に答える`),
    h("li", {}, "終わったら、録音をもとに講評を見る")
  );
}

function doneSets() {
  try {
    const list = JSON.parse(storage.get(`${DONE_KEY}.${GRADE}`) || "[]");
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function markDone(setId) {
  const list = doneSets();
  if (!list.includes(setId)) storage.set(`${DONE_KEY}.${GRADE}`, JSON.stringify([...list, setId]));
}

// ---------------------------------------------------------------------------
// 面接

async function startInterview() {
  const button = $("#btn-start");
  $("#ready-error").textContent = "";
  // どちらも iPhone ではボタンを押した直後（await より前）に始める必要がある
  speech.unlock();
  const opening = recorder.open();
  button.disabled = true;
  try {
    await opening;
  } catch (err) {
    recorder.close();
    $("#ready-error").textContent = micErrorMessage(err);
    return;
  } finally {
    button.disabled = false;
  }

  resetSession();
  const ctrl = new AbortController();
  state.running = ctrl;
  state.reviewed = false;
  recorder.onlevel = renderLevel;
  wakeLock.request();
  show("interview");
  idleDock();

  try {
    await runInterview(ctrl.signal);
    state.running = null;
    markDone(state.set.setId);
    renderDone();
  } catch (err) {
    state.running = null;
    if (err.name !== "AbortError") console.error(err);
    backToReady();
    $("#ready-error").textContent =
      err.name === "AbortError" ? String(ctrl.signal.reason || "中断しました。") : "途中でエラーが起きました。もう一度始めてください。";
  } finally {
    recorder.close();
    wakeLock.release();
    speech.cancel();
  }
}

async function runInterview(signal) {
  const { data, set } = state;
  const L = data.interviewerLines;
  const say = (text) => speak(text, signal);

  showCard("front");
  focusCard("passage");
  await say(L.start);
  await say(L.silentReading);
  await phase(signal, {
    label: "黙読",
    seconds: set.reading.prepSeconds,
    hint: "パッセージを声に出さずに読みましょう。",
    speakWarning: "黙読の時間です。声に出して読むのは、このあと指示されてからです。",
  });
  await say(L.readAloud);
  state.clips.reading = (await recordAnswer(signal, {
    label: "音読",
    seconds: set.reading.answerSeconds,
    hint: "タイトルから読み始めましょう。",
    done: "読み終わった",
  })).clip;

  let turned = false;
  for (const q of set.questions) {
    const id = `q${q.no}`;
    const question = questionLine(q);
    if (!turned && (q.type === "opinion" || q.type === "personal")) {
      await say(L.turnOver);
      showCard("back");
      turned = true;
    }
    focusCard(q.type);
    if (q.type === "personal") idleDock("次は Yes か No で答える質問です。まず Yes / No だけを言います。");
    await say(`${q.no === 1 ? `${L.q1} ` : ""}No. ${q.no}. ${question}`);
    if (q.prepSeconds) {
      await phase(signal, {
        label: `No.${q.no} 考える時間（まだ話さない）`,
        seconds: q.prepSeconds,
        repeat: question,
        hint: "「ピッ」と鳴ったら録音が始まります。それまでは頭の中で考えましょう。",
        speakWarning: "まだ録音していません。「ピッ」と鳴ってから話してください。",
      });
      // 2級の No.2 は考える時間のあとに "Please begin." と言われる
      if (L.begin) await say(L.begin);
    }

    if (q.type === "personal") {
      // Yes / No を言ったらボタンで選ぶ。選んだほうの追加質問が続く
      const first = await recordAnswer(signal, {
        label: `No.${q.no} まず Yes / No`,
        seconds: Math.min(20, q.answerSeconds),
        repeat: question,
        hint: "Yes か No だけを言ってから、言ったほうのボタンを押してください。理由はこのあと聞かれます。",
        choices: YES_NO,
      });
      let choice = first.choice;
      if (choice === "timeout") {
        choice = await phase(signal, { label: "Yes / No のどちらで答えましたか", seconds: Infinity, choices: YES_NO });
      }
      state.clips[`${id}a`] = first.clip;
      state.choices[q.no] = choice;
      const followUp = choice === "no" ? L.noFollowUp : L.yesFollowUp;
      await say(followUp);
      state.clips[`${id}b`] = (await recordAnswer(signal, { label: `No.${q.no}`, seconds: q.answerSeconds, repeat: followUp })).clip;
    } else {
      state.clips[id] = (await recordAnswer(signal, {
        label: `No.${q.no}`,
        seconds: q.answerSeconds,
        repeat: question,
        hint: q.type === "story" ? "カードに書かれた文から話し始めましょう。" : "",
      })).clip;
    }
  }

  showCard("returned");
  await say(L.end);
}

/** 合図の音を鳴らして録音し、ボタンか時間切れで止める。 */
async function recordAnswer(signal, opts) {
  await recorder.beep();
  recorder.start();
  let choice;
  try {
    choice = await phase(signal, { ...opts, recording: true });
  } catch (err) {
    recorder.pause();
    throw err;
  }
  const clip = await recorder.stop();
  clip.url = URL.createObjectURL(clip.blob);
  return { clip, choice };
}

/**
 * 時間を数える区間（黙読・考える時間・解答）。押されたボタンの value か "timeout" を返す。
 * 「もう一度聞く」の間は時間と録音を止める。
 * speakWarning: 録音していない区間で話し始めたときに出す注意。
 * 録音中は、声がほとんど入っていないのに「答え終わった」を押したら一度確かめる。
 */
function phase(signal, { label, seconds, hint = "", repeat = null, choices = null, recording = false, done = "答え終わった", speakWarning = null }) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) return reject(abortError());
    const total = seconds * 1000 * TIME_SCALE;
    let elapsed = 0;
    let last = performance.now();
    let paused = false;
    let finished = false;
    let warned = false;
    let confirming = false;

    const actions = [];
    if (repeat) actions.push({ label: "もう一度聞く", value: REPEAT, kind: "secondary" });
    if (choices) actions.push(...choices);
    else if (recording) actions.push({ label: done, value: "done", kind: "primary" });

    setDock({ label, hint, recording, actions, onAction });
    voice.ms = 0;
    voice.counting = true;
    const timer = setInterval(tick, 100);
    signal.addEventListener("abort", onAbort);
    tick();

    function tick() {
      const now = performance.now();
      if (!paused) elapsed += now - last;
      last = now;
      renderTime(total - elapsed, total);
      if (speakWarning && !warned && voice.ms >= SPEAK_WARNING_MS) {
        warned = true;
        setDockWarning(speakWarning);
      }
      if (elapsed >= total) finish("timeout");
    }
    function cleanup() {
      finished = true;
      voice.counting = false;
      clearInterval(timer);
      signal.removeEventListener("abort", onAbort);
      idleDock();
    }
    function finish(value) {
      if (finished) return;
      cleanup();
      resolve(value);
    }
    function onAbort() {
      if (finished) return;
      cleanup();
      reject(abortError());
    }
    async function onAction(value) {
      if (finished) return;
      if (value === CONTINUE) {
        confirming = false;
        setDockWarning("");
        renderActions(actions);
        return;
      }
      if (value === "done" && recording && !confirming && voice.ms < SHORT_ANSWER_MS) {
        // 勘違いで押してしまったときに、録音が空のまま次へ進まないようにする
        confirming = true;
        setDockWarning("まだほとんど声が録音されていません。答え終わりましたか？");
        renderActions([
          { label: "続けて話す", value: CONTINUE, kind: "secondary" },
          { label: "終わる", value: "done", kind: "primary" },
        ]);
        return;
      }
      if (value !== REPEAT) {
        finish(value);
        return;
      }
      if (paused) return;
      paused = true;
      voice.counting = false; // 読み上げの音を声として数えない
      if (recording) recorder.pause();
      setActionsDisabled(true);
      try {
        await speak(repeat, signal);
      } catch {
        return; // 中断は onAbort が片づける
      }
      if (finished) return;
      paused = false;
      voice.counting = true;
      last = performance.now();
      if (recording) recorder.resume();
      setActionsDisabled(false);
    }
  });
}

function questionLine(q) {
  if (q.prompt) return q.prompt;
  const L = state.data.interviewerLines;
  if (q.type === "pictureA" || q.type === "story") return L.q2;
  if (q.type === "pictureB") return L.q3.replace("{subject}", q.subject || "person");
  return "";
}

function abortError() {
  return new DOMException("中断", "AbortError");
}

function micErrorMessage(err) {
  if (!navigator.mediaDevices || !window.isSecureContext) {
    return "このブラウザでは録音できません。https のページを Safari か Chrome で開いてください。";
  }
  if (err && (err.name === "NotAllowedError" || err.name === "SecurityError")) {
    return "マイクの使用が許可されませんでした。ブラウザの設定でこのページのマイクを「許可」にしてから、もう一度押してください。";
  }
  if (err && err.name === "NotFoundError") return "マイクが見つかりませんでした。";
  return "マイクを準備できませんでした。ほかのアプリでマイクを使っていないか確かめてください。";
}

// ---------------------------------------------------------------------------
// 面接官の読み上げ

const speech = {
  supported: "speechSynthesis" in window,
  voice: null,
  current: null,
  init() {
    if (!this.supported) return;
    const pick = () => {
      this.voice = pickVoice(speechSynthesis.getVoices());
    };
    pick();
    speechSynthesis.addEventListener?.("voiceschanged", pick);
  },
  unlock() {
    if (!this.supported) return;
    const u = new SpeechSynthesisUtterance(" ");
    u.volume = 0;
    speechSynthesis.speak(u);
  },
  cancel() {
    if (this.supported) speechSynthesis.cancel();
  },
};

function pickVoice(voices) {
  const us = voices.filter((v) => /^en[-_]US/i.test(v.lang));
  for (const re of [/Samantha/, /Google US English/, /Aria|Jenny|Natural/, /Alex/]) {
    const v = us.find((x) => re.test(x.name));
    if (v) return v;
  }
  return us[0] || voices.find((v) => /^en/i.test(v.lang)) || null;
}

function speak(text, signal) {
  showLine(text);
  return new Promise((resolve, reject) => {
    if (signal.aborted) return reject(abortError());
    let done = false;
    let timer;
    const finish = (err) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      signal.removeEventListener("abort", onAbort);
      setSpeaking(false);
      if (err) reject(err);
      else setTimeout(resolve, 400);
    };
    const onAbort = () => {
      speech.cancel();
      finish(abortError());
    };
    signal.addEventListener("abort", onAbort);
    setSpeaking(true);

    const words = text.split(/\s+/).length;
    if (!speech.supported) {
      // 読み上げが使えない端末では文字を出し、読める程度の時間だけ待つ
      timer = setTimeout(() => finish(), 1500 + words * 450);
      return;
    }
    const u = new SpeechSynthesisUtterance(text.replace(/\bNo\. ?(\d+)/g, "Number $1"));
    u.lang = "en-US";
    u.rate = 0.9;
    if (speech.voice) u.voice = speech.voice;
    u.onend = () => finish();
    u.onerror = () => finish();
    speech.current = u; // 参照を残さないと onend が呼ばれない端末がある
    timer = setTimeout(() => finish(), 6000 + words * 700); // onend が来ないときの保険
    speechSynthesis.speak(u);
  });
}

function showLine(text) {
  $("#examiner-line").textContent = text;
  renderLineVisibility();
}

function setShowText(on) {
  state.showText = on;
  storage.set(SHOW_TEXT_KEY, on ? "1" : "0");
  $("#opt-show-text").checked = on;
  renderLineVisibility();
}

function renderLineVisibility() {
  const visible = state.showText || !speech.supported;
  $("#examiner-line").hidden = !visible;
  $("#btn-toggle-text").setAttribute("aria-pressed", String(visible));
  $("#btn-toggle-text").textContent = visible ? "文字をかくす" : "文字で見る";
}

function setSpeaking(on) {
  $("#screen-interview").classList.toggle("speaking", on);
  $("#examiner-status").textContent = on ? "面接官が話しています" : "面接官";
}

// ---------------------------------------------------------------------------
// カードと操作パネル

function fillCard() {
  const { set } = state;
  $("#card-title").textContent = set.title;
  $("#card-passage").textContent = set.passage;
  // 準2級はイラスト2枚、2級は3コマ漫画
  $("#pictures").hidden = Boolean(set.story);
  $("#story").hidden = !set.story;
  if (set.story) {
    renderStory(set.story);
  } else {
    $("#pic-a").src = asset(set.pictureA);
    $("#pic-b").src = asset(set.pictureB);
  }
}

/** 3コマと、コマの間の矢印の語句、1コマ目のせりふ。画像には文字がないので、ここで重ねる。 */
function renderStory(story) {
  $("#story-first").textContent = story.firstSentence;
  $("#story-panels").replaceChildren(
    ...story.panels.flatMap((p, i) => [
      p.arrow && h("div", { class: "story-arrow" }, h("span", { lang: "en" }, p.arrow)),
      h(
        "figure",
        { class: "story-panel" },
        h("img", { src: asset(p.image), alt: `${i + 1}コマ目` }),
        p.speech && h("p", { class: `speech speech-${p.speech.side === "right" ? "right" : "left"}`, lang: "en" }, p.speech.text)
      ),
    ]).filter(Boolean)
  );
}

function asset(path) {
  return new URL(path, ROOT).href;
}

function showCard(side) {
  $("#card-front").hidden = side !== "front";
  $("#card-back").hidden = side !== "back";
  $("#card-returned").hidden = side !== "returned";
}

function focusCard(type) {
  const target = { passage: "#card-passage", pictureA: "#fig-a", pictureB: "#fig-b", story: "#story" }[type];
  for (const el of document.querySelectorAll(".card .focus")) el.classList.remove("focus");
  if (!target) return;
  const el = $(target);
  el.classList.add("focus");
  el.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

let dockAction = null;

function setDock({ label, hint, recording, actions, onAction }) {
  const dock = $("#dock");
  dock.classList.toggle("recording", recording);
  dock.classList.remove("idle");
  $("#phase-label").textContent = recording ? `録音中 ${label}` : label;
  $("#phase-hint").textContent = hint || (recording ? "どうぞ、話してください。" : "");
  setDockWarning("");
  $("#level").hidden = !recording;
  if (recording) {
    // 録音が始まったことがはっきり分かるように、パネルを一度光らせる
    dock.classList.remove("started");
    void dock.offsetWidth;
    dock.classList.add("started");
  }
  dockAction = onAction;
  renderActions(actions);
}

function renderActions(actions) {
  $("#phase-actions").replaceChildren(
    ...actions.map((a) => h("button", { type: "button", class: `btn ${a.kind}`, onclick: () => dockAction?.(a.value) }, a.label))
  );
}

function setDockWarning(text) {
  $("#phase-warning").textContent = text;
}

function idleDock(note = "") {
  const dock = $("#dock");
  dock.classList.remove("recording", "started");
  dock.classList.add("idle");
  dockAction = null;
  $("#phase-label").textContent = "面接官の話を聞きましょう";
  $("#phase-time").textContent = "";
  $("#phase-hint").textContent = note;
  setDockWarning("");
  $("#progress-bar").style.width = "0%";
  $("#level").hidden = true;
  $("#phase-actions").replaceChildren();
}

function setActionsDisabled(disabled) {
  for (const b of document.querySelectorAll("#phase-actions button")) b.disabled = disabled;
}

function renderTime(remainingMs, totalMs) {
  if (!Number.isFinite(totalMs)) {
    $("#phase-time").textContent = "";
    $("#progress-bar").style.width = "0%";
    return;
  }
  const left = Math.max(0, remainingMs);
  $("#phase-time").textContent = `あと ${Math.ceil(left / 1000 / TIME_SCALE)} 秒`;
  $("#progress-bar").style.width = `${(left / totalMs) * 100}%`;
}

function renderLevel(rms) {
  // 音量は 1/20 秒ごとに届く
  if (voice.counting && rms >= VOICE_RMS) voice.ms += 50;
  const db = 20 * Math.log10(rms + 1e-8);
  const pct = Math.max(0, Math.min(1, (db + 60) / 50));
  $("#level-bar").style.width = `${pct * 100}%`;
}

// ---------------------------------------------------------------------------
// 終了後

function renderDone() {
  const clips = Object.values(state.clips);
  const voiced = clips.filter((c) => !c.silent).length;
  const ai = Boolean(WORKER_URL);
  $("#done-ai").hidden = !ai;
  $("#done-error").textContent = "";
  $("#done-warning").textContent =
    voiced === 0 ? "声が録音されていませんでした。マイクの設定を確かめてから、もう一度練習してください。" : "";
  if (ai) {
    renderRemaining($("#done-remaining"));
    $("#btn-feedback").disabled = voiced === 0 || state.remaining === 0;
  }
  show("done");
}

async function requestFeedback() {
  const form = new FormData();
  form.append("grade", GRADE);
  form.append("setId", state.set.setId);
  for (const [no, choice] of Object.entries(state.choices)) form.append(`q${no}Choice`, choice);
  for (const [id, clip] of Object.entries(state.clips)) {
    if (!clip.silent) form.append(id, clip.blob, `${id}.wav`);
  }

  show("loading");
  try {
    const res = await api("/api/feedback", form);
    state.limit = res.limit;
    state.remaining = res.remaining;
    renderFeedback(res.items, res.overall);
  } catch (err) {
    if (typeof err.payload?.remaining === "number") state.remaining = err.payload.remaining;
    renderDone();
    $("#done-error").textContent = err.message;
  }
}

function renderFeedback(items, overall = null) {
  const { set } = state;
  const byId = new Map((items || []).map((it) => [it.id, it]));
  const L = state.data.interviewerLines;

  const list = [
    feedbackItem({
      title: "音読",
      question: set.title,
      clips: [["", state.clips.reading]],
      ai: byId.get("reading"),
      extra: h("details", { class: "fb-model" }, h("summary", {}, "カードの文"), h("p", { lang: "en" }, set.passage)),
    }),
  ];
  for (const q of set.questions) {
    const id = `q${q.no}`;
    const followUp = state.choices[q.no] === "no" ? L.noFollowUp : L.yesFollowUp;
    const pictures =
      q.type === "pictureA" ? [set.pictureA]
      : q.type === "pictureB" ? [set.pictureB]
      : q.type === "story" ? set.story.panels.map((p) => p.image)
      : null;
    list.push(
      feedbackItem({
        title: `No.${q.no}`,
        question: questionLine(q),
        pictures,
        clips: q.type === "personal" ? [["Yes / No", state.clips[`${id}a`]], [followUp, state.clips[`${id}b`]]] : [["", state.clips[id]]],
        ai: byId.get(id),
        extra: q.modelAnswer?.length
          ? h("details", { class: "fb-model" }, h("summary", {}, "解答例"), h("ul", { lang: "en" }, q.modelAnswer.map((s) => h("li", {}, s))))
          : null,
      })
    );
  }

  if (overall) list.push(overallItem(overall));

  $("#feedback-list").replaceChildren(...list);
  $("#feedback-ai-note").hidden = !items;
  $("#feedback-self-note").hidden = Boolean(items);
  renderRemaining($("#feedback-remaining"));
  state.reviewed = true;
  show("feedback");
}

function feedbackItem({ title, question, pictures = null, clips, ai, extra }) {
  return h(
    "article",
    { class: "fb-item" },
    h("header", { class: "fb-head" }, h("h2", {}, title), h("p", { class: "fb-question", lang: "en" }, question)),
    pictures &&
      h(
        "div",
        { class: `fb-pictures${pictures.length > 1 ? " multi" : ""}` },
        pictures.map((src) => h("img", { class: "fb-picture", src: asset(src), alt: "", loading: "lazy" }))
      ),
    h(
      "section",
      { class: "fb-answer" },
      h("h3", {}, "あなたの録音"),
      clips.map(([label, clip]) =>
        h(
          "div",
          { class: "fb-clip" },
          label && h("p", { class: "fb-clip-label", lang: "en" }, label),
          !clip
            ? h("p", { class: "muted" }, "（録音なし）")
            : clip.silent
              ? h("p", { class: "muted" }, "（声が録音されていません）")
              : h("audio", { controls: true, preload: "metadata", src: clip.url })
        )
      ),
      ai?.transcript && h("div", { class: "fb-transcript" }, h("h3", {}, "AIが聞き取った英語"), h("p", { lang: "en" }, ai.transcript))
    ),
    ai && aiBlocks(ai),
    extra
  );
}

function overallItem(overall) {
  const rows = [
    ["発音", overall.pronunciation],
    ["文法・語彙", overall.grammar],
    ["流暢さ", overall.fluency],
    ["答え方", overall.response],
  ].filter(([, text]) => text);
  return h(
    "article",
    { class: "fb-item fb-overall" },
    h("header", { class: "fb-head" }, h("h2", {}, "全体の講評")),
    h("dl", { class: "overall-list" }, rows.map(([label, text]) => [h("dt", {}, label), h("dd", {}, text)])),
    overall.nextStep && h("div", { class: "fb-block next" }, h("h3", {}, "次の練習で意識すること"), h("p", {}, overall.nextStep))
  );
}

function aiBlocks(ai) {
  const blocks = [];
  if (ai.good) blocks.push(h("div", { class: "fb-block good" }, h("h3", {}, "できていた点"), h("p", {}, ai.good)));
  if (ai.fixes.length) {
    blocks.push(h("div", { class: "fb-block fix" }, h("h3", {}, "直すとよい点"), h("ul", {}, ai.fixes.map((f) => h("li", {}, f)))));
  }
  if (ai.rewrite) blocks.push(h("div", { class: "fb-block rewrite" }, h("h3", {}, "書き換え例"), h("p", { lang: "en" }, ai.rewrite)));
  if (ai.unclear.length) {
    blocks.push(h("div", { class: "fb-block unclear" }, h("h3", {}, "聞き取りにくかった語"), h("p", { lang: "en" }, ai.unclear.join(", "))));
  }
  if (ai.note) blocks.push(h("p", { class: "fb-note" }, ai.note));
  return blocks;
}

function renderRemaining(el) {
  el.textContent = WORKER_URL && state.remaining != null ? `今日はあと ${state.remaining} 回、AIの講評をもらえます。` : "";
}

function resetSession() {
  for (const clip of Object.values(state.clips)) if (clip.url) URL.revokeObjectURL(clip.url);
  state.clips = {};
  state.choices = {};
  state.reviewed = true;
  $("#feedback-list").replaceChildren();
  showCard("front");
  focusCard(null);
}

// ---------------------------------------------------------------------------
// 小物

async function api(path, body) {
  let res;
  try {
    res = await fetch(new URL(path, WORKER_URL), {
      method: "POST",
      headers: { Authorization: `Bearer ${encodeURIComponent(state.password)}` },
      body,
    });
  } catch {
    throw Object.assign(new Error("サーバーにつながりませんでした。通信状態を確かめてください。"), { status: 0 });
  }
  let payload = null;
  try {
    payload = await res.json();
  } catch {
    // 本文が JSON でないときは下の汎用メッセージを使う
  }
  if (!res.ok) {
    throw Object.assign(new Error(payload?.message || `エラーが起きました（${res.status}）。`), { status: res.status, payload });
  }
  return payload;
}

function show(name) {
  for (const s of document.querySelectorAll(".screen")) s.hidden = s.id !== `screen-${name}`;
  document.body.dataset.screen = name; // 面接中だけ背景を落ち着いた色にする
  window.scrollTo(0, 0);
}

function fatal(message) {
  $("#fatal-message").textContent = message;
  show("fatal");
}

function h(tag, props = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v == null || v === false) continue;
    if (k === "class") el.className = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? "" : v);
  }
  for (const c of children.flat(2)) {
    if (c != null && c !== false && c !== "") el.append(c);
  }
  return el;
}

const storage = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // 保存できなくても毎回入力すれば使える
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch {
      // 同上
    }
  },
};

// 黙読や音読の途中で画面が消えないようにする（対応していない端末では何もしない）
const wakeLock = {
  lock: null,
  async request() {
    try {
      this.lock = await navigator.wakeLock?.request("screen");
    } catch {
      this.lock = null;
    }
  },
  release() {
    this.lock?.release().catch(() => {});
    this.lock = null;
  },
};

init();
