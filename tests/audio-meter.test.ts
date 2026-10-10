import { afterEach, beforeEach, expect, it, vi } from "vitest";

let amplitude = 128;
let blocked = false;
const connect = vi.fn();
const disconnect = vi.fn();
class FakeAudio {
  paused = true;
  onended: (() => void) | null = null;
  onerror: (() => void) | null = null;
  play() { this.paused = false; return Promise.resolve(); }
  pause() { this.paused = true; }
}
class FakeContext {
  state = "suspended";
  destination = {};
  resume() { if (blocked) return Promise.reject(new Error("blocked")); this.state = "running"; return Promise.resolve(); }
  createAnalyser() { return { fftSize: 512, getByteTimeDomainData: (samples: Uint8Array) => samples.fill(amplitude) }; }
  createMediaElementSource() { return { connect, disconnect }; }
}
beforeEach(() => { vi.resetModules(); vi.clearAllMocks(); amplitude = 128; blocked = false; vi.stubGlobal("Audio", FakeAudio); vi.stubGlobal("AudioContext", FakeContext); });
afterEach(() => vi.unstubAllGlobals());
it("measures silence and volume, then resets to zero on stop", async () => {
  const speech = await import("@/lib/speech");
  speech.enableAudioMeter(); speech.playAudio("/track.mp3", vi.fn(), vi.fn());
  await Promise.resolve();
  expect(speech.audioLevel()).toBe(0);
  amplitude = 144; expect(speech.audioLevel()).toBeCloseTo(0.625);
  amplitude = 255; expect(speech.audioLevel()).toBe(1);
  speech.stopSpeaking(); expect(speech.audioLevel()).toBe(0); expect(disconnect).toHaveBeenCalled();
});
it("keeps the native audio path if the context cannot resume", async () => {
  blocked = true;
  const speech = await import("@/lib/speech");
  speech.enableAudioMeter(); const fail = vi.fn(); speech.playAudio("/track.mp3", vi.fn(), fail);
  await Promise.resolve(); await Promise.resolve();
  expect(connect).not.toHaveBeenCalled(); expect(fail).not.toHaveBeenCalled(); expect(speech.audioLevel()).toBe(0);
});
it("does not connect a stopped track after context resume", async () => {
  const speech = await import("@/lib/speech");
  speech.enableAudioMeter(); speech.playAudio("/track.mp3", vi.fn(), vi.fn()); speech.stopSpeaking();
  await Promise.resolve(); expect(connect).not.toHaveBeenCalled();
});
