// マイク録音。Gemini がもともと 16kHz・モノラルに落として聞くので、こちらでも 16kHz の WAV にして送る。
// MediaRecorder は端末ごとに出てくる形式が違う（iPhone は mp4、Chrome は webm）ので使わない。

const OUT_RATE = 16000;
const SPEECH_RMS = 0.01; // これより大きい音を「声」とみなす（約 -40dB）
const MIN_SPEECH_MS = 200; // 声とみなす音がこれ未満なら無音扱い
const PAD_BEFORE_S = 0.4;
const PAD_AFTER_S = 0.6;
// Android の Chrome はエコー除去つきでマイクを開くと端末を通話モードにし、その間の読み上げが
// 電話の音質になって割れることがある（Pixel で報告あり）。面接官が話している間は録音しないので
// エコー除去はなくても困らない。iPhone は問題が出ていないので今のまま
const ECHO_CANCELLATION = !/Android/i.test(navigator.userAgent);

export class Recorder {
  constructor() {
    this.ctx = null;
    this.stream = null;
    this.node = null;
    this.chunks = [];
    this.onlevel = null;
    this.onStopped = null;
  }

  /** クリックの処理の中で、await より前に呼ぶこと（iPhone は操作の直後でないと音を出せない）。 */
  async open() {
    const AC = window.AudioContext || window.webkitAudioContext;
    const ctx = new AC();
    this.ctx = ctx;
    const resumed = ctx.resume();

    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: ECHO_CANCELLATION, noiseSuppression: true, autoGainControl: true },
    });
    await resumed;
    await ctx.audioWorklet.addModule(new URL("./recorder-worklet.js", import.meta.url).href);

    const source = ctx.createMediaStreamSource(this.stream);
    this.node = new AudioWorkletNode(ctx, "capture", {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      channelCount: 1,
      channelCountMode: "explicit",
    });
    // 出力をつながないと処理を止めるブラウザがあるので、音量0で出力につなぐ
    const mute = ctx.createGain();
    mute.gain.value = 0;
    source.connect(this.node).connect(mute).connect(ctx.destination);

    this.node.port.onmessage = (e) => {
      const msg = e.data;
      if (msg.type === "chunk") this.chunks.push(msg.data);
      else if (msg.type === "level") this.onlevel?.(msg.rms);
      else if (msg.type === "stopped") this.onStopped?.();
    };
  }

  start() {
    this.chunks = [];
    this.node.port.postMessage("start");
  }

  pause() {
    this.node.port.postMessage("pause");
  }

  resume() {
    this.node.port.postMessage("start");
  }

  /** @returns {Promise<{blob: Blob, seconds: number, silent: boolean}>} */
  stop() {
    return new Promise((resolve) => {
      this.onStopped = () => {
        this.onStopped = null;
        resolve(this.finish());
      };
      this.node.port.postMessage("stop");
    });
  }

  /** 録音開始の合図音。 */
  async beep() {
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.25, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.2);
    await new Promise((r) => setTimeout(r, 250));
  }

  close() {
    this.stream?.getTracks().forEach((t) => t.stop());
    this.ctx?.close().catch(() => {});
    this.ctx = null;
    this.stream = null;
    this.node = null;
  }

  finish() {
    const length = this.chunks.reduce((n, c) => n + c.length, 0);
    const merged = new Float32Array(length);
    let offset = 0;
    for (const c of this.chunks) {
      merged.set(c, offset);
      offset += c.length;
    }
    this.chunks = [];

    const rate = Math.min(OUT_RATE, this.ctx.sampleRate);
    const pcm = downsample(merged, this.ctx.sampleRate, rate);
    const speech = findSpeech(pcm, rate);
    // 無音のときは送らないが、生徒が確かめられるように録音そのものは残す
    const kept = speech ? pcm.subarray(speech.start, speech.end) : pcm;
    return { blob: encodeWav(kept, rate), seconds: kept.length / rate, silent: !speech };
  }
}

function downsample(input, inRate, outRate) {
  if (inRate === outRate) return input;
  const ratio = inRate / outRate;
  const out = new Float32Array(Math.floor(input.length / ratio));
  let from = 0;
  for (let i = 0; i < out.length; i++) {
    // 区間の平均をとる（簡単な低域通過フィルタを兼ねる）
    const to = Math.min(input.length, Math.floor((i + 1) * ratio));
    let sum = 0;
    for (let j = from; j < to; j++) sum += input[j];
    out[i] = to > from ? sum / (to - from) : 0;
    from = to;
  }
  return out;
}

/** 声のある範囲を前後に少し余白をつけて返す。声がなければ null。 */
function findSpeech(pcm, rate) {
  const frame = Math.round(rate * 0.02);
  let first = -1;
  let last = -1;
  let loud = 0;
  for (let i = 0; i + frame <= pcm.length; i += frame) {
    let sum = 0;
    for (let j = i; j < i + frame; j++) sum += pcm[j] * pcm[j];
    if (Math.sqrt(sum / frame) >= SPEECH_RMS) {
      loud++;
      if (first < 0) first = i;
      last = i + frame;
    }
  }
  if (loud * 20 < MIN_SPEECH_MS) return null;
  return {
    start: Math.max(0, first - Math.round(rate * PAD_BEFORE_S)),
    end: Math.min(pcm.length, last + Math.round(rate * PAD_AFTER_S)),
  };
}

function encodeWav(samples, rate) {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const ascii = (offset, s) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };
  ascii(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  ascii(8, "WAVE");
  ascii(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // モノラル
  view.setUint32(24, rate, true);
  view.setUint32(28, rate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  ascii(36, "data");
  view.setUint32(40, samples.length * 2, true);
  for (let i = 0, o = 44; i < samples.length; i++, o += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Blob([buffer], { type: "audio/wav" });
}
