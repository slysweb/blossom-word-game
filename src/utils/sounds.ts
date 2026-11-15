export type SoundName = "type" | "error" | "correct" | "bloom";

let audio: AudioContext | null = null;

function context(): AudioContext | null {
  const Ctx = window.AudioContext;
  if (!Ctx) return null;
  if (!audio) audio = new Ctx();
  return audio;
}

function tone(
  ctx: AudioContext,
  frequency: number,
  start: number,
  duration: number,
  gain: number,
  type: OscillatorType,
): void {
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, start);
  amp.gain.setValueAtTime(0.0001, start);
  amp.gain.exponentialRampToValueAtTime(gain, start + 0.015);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(amp);
  amp.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function schedule(play: (ctx: AudioContext, now: number) => void): void {
  const ctx = context();
  if (!ctx) return;
  const start = () => play(ctx, ctx.currentTime);
  if (ctx.state === "suspended") {
    void ctx.resume().then(start);
    return;
  }
  start();
}

/** Short sounds for a letter, a wrong guess, a correct word, and a flower. */
export function playSound(name: SoundName): void {
  if (name === "type") {
    schedule((ctx, now) => {
      tone(ctx, 340, now, 0.045, 0.04, "sine");
      tone(ctx, 180, now, 0.05, 0.025, "sine");
    });
    return;
  }
  if (name === "error") {
    schedule((ctx, now) => {
      tone(ctx, 196, now, 0.09, 0.05, "triangle");
      tone(ctx, 146, now + 0.08, 0.14, 0.05, "triangle");
    });
    return;
  }
  if (name === "correct") {
    schedule((ctx, now) => {
      tone(ctx, 523, now, 0.1, 0.05, "sine");
      tone(ctx, 784, now + 0.08, 0.16, 0.05, "sine");
    });
    return;
  }
  schedule((ctx, now) => {
    [523, 659, 784, 1046].forEach((frequency, index) => {
      tone(ctx, frequency, now + index * 0.09, 0.2, 0.045, "sine");
    });
  });
}
