// マイクの音を受け取り、録音中だけメインスレッドへ送る。音量は常に送る（レベルメーター用）。
class CaptureProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.recording = false;
    this.buf = new Float32Array(4096);
    this.len = 0;
    this.levelSum = 0;
    this.levelCount = 0;
    this.port.onmessage = (e) => {
      if (e.data === "start") {
        this.recording = true;
      } else if (e.data === "pause") {
        this.recording = false;
        this.flush();
      } else if (e.data === "stop") {
        this.recording = false;
        this.flush();
        this.port.postMessage({ type: "stopped" });
      }
    };
  }

  flush() {
    if (this.len === 0) return;
    const out = this.buf.slice(0, this.len);
    this.port.postMessage({ type: "chunk", data: out }, [out.buffer]);
    this.len = 0;
  }

  process(inputs) {
    const ch = inputs[0] && inputs[0][0];
    if (!ch) return true;
    for (let i = 0; i < ch.length; i++) {
      const s = ch[i];
      this.levelSum += s * s;
      if (this.recording) {
        this.buf[this.len++] = s;
        if (this.len === this.buf.length) this.flush();
      }
    }
    this.levelCount += ch.length;
    if (this.levelCount >= sampleRate / 20) {
      this.port.postMessage({ type: "level", rms: Math.sqrt(this.levelSum / this.levelCount) });
      this.levelSum = 0;
      this.levelCount = 0;
    }
    return true;
  }
}

registerProcessor("capture", CaptureProcessor);
