import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const sampleRate = 44100;
const beat = 0.46;
const melody = [
  [392.0, 0.7], [392.0, 0.3], [440.0, 1], [392.0, 1], [523.25, 1], [493.88, 2],
  [392.0, 0.7], [392.0, 0.3], [440.0, 1], [392.0, 1], [587.33, 1], [523.25, 2],
  [392.0, 0.7], [392.0, 0.3], [783.99, 1], [659.25, 1], [523.25, 1], [493.88, 1], [440.0, 2],
  [698.46, 0.7], [698.46, 0.3], [659.25, 1], [523.25, 1], [587.33, 1], [523.25, 2.4],
];

const leadIn = 0.35;
const tail = 1.8;
const duration = leadIn + melody.reduce((sum, [, beats]) => sum + beats * beat, 0) + tail;
const samples = new Float64Array(Math.ceil(duration * sampleRate));

function envelope(time, noteDuration) {
  const attack = Math.min(0.035, noteDuration * 0.12);
  const release = Math.min(0.32, noteDuration * 0.42);
  if (time < attack) return time / attack;
  if (time > noteDuration - release) return Math.max(0, (noteDuration - time) / release);
  return 0.82 * Math.exp(-time * 0.5) + 0.18;
}

function addBell(frequency, start, noteDuration, volume) {
  const startSample = Math.floor(start * sampleRate);
  const endSample = Math.min(samples.length, Math.ceil((start + noteDuration) * sampleRate));
  for (let i = startSample; i < endSample; i += 1) {
    const t = (i - startSample) / sampleRate;
    const env = envelope(t, noteDuration);
    const fundamental = Math.sin(2 * Math.PI * frequency * t);
    const warm = Math.sin(2 * Math.PI * frequency * 2 * t) * 0.2;
    const shimmer = Math.sin(2 * Math.PI * frequency * 3.01 * t) * 0.09 * Math.exp(-t * 2.4);
    samples[i] += (fundamental + warm + shimmer) * env * volume;
  }
}

let cursor = leadIn;
melody.forEach(([frequency, beats], index) => {
  const noteDuration = beats * beat * 0.94;
  addBell(frequency, cursor, noteDuration, 0.52);
  addBell(frequency / 2, cursor, noteDuration, 0.16);
  if (index % 6 === 0) {
    const root = frequency < 500 ? 130.81 : 196;
    addBell(root, cursor, Math.min(beat * 2.8, noteDuration + beat), 0.09);
    addBell(root * 1.5, cursor, Math.min(beat * 2.8, noteDuration + beat), 0.065);
  }
  cursor += beats * beat;
});

const echoDelay = Math.floor(sampleRate * 0.19);
for (let i = echoDelay; i < samples.length; i += 1) {
  samples[i] += samples[i - echoDelay] * 0.13;
}

let peak = 0;
for (const sample of samples) peak = Math.max(peak, Math.abs(sample));
const scale = peak ? 0.88 / peak : 1;
const dataSize = samples.length * 2;
const output = Buffer.alloc(44 + dataSize);
output.write("RIFF", 0);
output.writeUInt32LE(36 + dataSize, 4);
output.write("WAVE", 8);
output.write("fmt ", 12);
output.writeUInt32LE(16, 16);
output.writeUInt16LE(1, 20);
output.writeUInt16LE(1, 22);
output.writeUInt32LE(sampleRate, 24);
output.writeUInt32LE(sampleRate * 2, 28);
output.writeUInt16LE(2, 32);
output.writeUInt16LE(16, 34);
output.write("data", 36);
output.writeUInt32LE(dataSize, 40);
for (let i = 0; i < samples.length; i += 1) {
  const value = Math.max(-1, Math.min(1, samples[i] * scale));
  output.writeInt16LE(Math.round(value * 32767), 44 + i * 2);
}

const destination = resolve("public/audio/happy-birthday.wav");
mkdirSync(dirname(destination), { recursive: true });
writeFileSync(destination, output);
console.log(`Created ${destination} (${duration.toFixed(1)} seconds)`);
