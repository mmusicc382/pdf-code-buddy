// ISL gesture pose library — simplified articulated hand poses.
// Each finger has 3 bend values (knuckle, middle, tip) in radians.
// Hand position/rotation moves the whole hand for the gesture.

export type FingerBend = [number, number, number];
export type HandPose = {
  position: [number, number, number];
  rotation: [number, number, number];
  thumb: FingerBend;
  index: FingerBend;
  middle: FingerBend;
  ring: FingerBend;
  pinky: FingerBend;
  spread?: number; // extra finger spread
};

const FLAT: FingerBend = [0, 0, 0];
const CURL: FingerBend = [1.3, 1.4, 1.0];
const HALF: FingerBend = [0.7, 0.6, 0.4];

export const REST: HandPose = {
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  thumb: [0.3, 0.2, 0.2],
  index: HALF,
  middle: HALF,
  ring: HALF,
  pinky: HALF,
};

export const OPEN_PALM: HandPose = {
  position: [0, 0.2, 0],
  rotation: [-0.3, 0, 0],
  thumb: [0.2, 0.1, 0.1],
  index: FLAT, middle: FLAT, ring: FLAT, pinky: FLAT,
  spread: 0.25,
};

export const FIST: HandPose = {
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  thumb: [0.9, 0.6, 0.4],
  index: CURL, middle: CURL, ring: CURL, pinky: CURL,
};

export const THUMBS_UP: HandPose = {
  position: [0, 0.1, 0],
  rotation: [0, 0, 0.1],
  thumb: [0, 0, 0],
  index: CURL, middle: CURL, ring: CURL, pinky: CURL,
};

export const POINT: HandPose = {
  position: [0, 0.1, 0.1],
  rotation: [-0.2, 0, 0],
  thumb: [0.9, 0.5, 0.3],
  index: FLAT,
  middle: CURL, ring: CURL, pinky: CURL,
};

export const PEACE: HandPose = {
  position: [0, 0.2, 0],
  rotation: [-0.2, 0, 0],
  thumb: [0.9, 0.6, 0.4],
  index: FLAT, middle: FLAT,
  ring: CURL, pinky: CURL,
  spread: 0.3,
};

export const OK_SIGN: HandPose = {
  position: [0, 0.1, 0],
  rotation: [-0.2, 0, 0],
  thumb: [0.9, 0.9, 0.6],
  index: [0.9, 0.9, 0.6],
  middle: FLAT, ring: FLAT, pinky: FLAT,
  spread: 0.2,
};

export const ILY: HandPose = {
  // I Love You — thumb, index, pinky extended
  position: [0, 0.2, 0],
  rotation: [-0.2, 0, 0],
  thumb: [0, 0, 0],
  index: FLAT,
  middle: CURL, ring: CURL,
  pinky: FLAT,
  spread: 0.3,
};

export const WAVE_LEFT: HandPose = {
  ...OPEN_PALM,
  rotation: [-0.3, 0, 0.4],
  position: [-0.3, 0.3, 0],
};

export const WAVE_RIGHT: HandPose = {
  ...OPEN_PALM,
  rotation: [-0.3, 0, -0.4],
  position: [0.3, 0.3, 0],
};

export const POINT_SELF: HandPose = {
  ...POINT,
  position: [0, 0, 0.3],
  rotation: [0.3, 0, 0],
};

export const HAND_CHEST: HandPose = {
  ...OPEN_PALM,
  position: [0, -0.1, 0.2],
  rotation: [0.4, 0, 0],
};

// A word maps to a sequence of poses (each ~600ms)
export const SIGN_DICTIONARY: Record<string, HandPose[]> = {
  hello: [WAVE_LEFT, WAVE_RIGHT, WAVE_LEFT, OPEN_PALM],
  hi: [WAVE_LEFT, WAVE_RIGHT, OPEN_PALM],
  yes: [FIST, FIST, OPEN_PALM, FIST],
  no: [POINT, PEACE, POINT],
  thanks: [HAND_CHEST, OPEN_PALM],
  "thank you": [HAND_CHEST, OPEN_PALM, HAND_CHEST],
  please: [OPEN_PALM, HAND_CHEST, OPEN_PALM],
  good: [THUMBS_UP, THUMBS_UP],
  bad: [POINT, FIST],
  ok: [OK_SIGN, OK_SIGN],
  okay: [OK_SIGN, OK_SIGN],
  i: [POINT_SELF, POINT_SELF],
  me: [POINT_SELF, POINT_SELF],
  you: [POINT, POINT],
  love: [HAND_CHEST, ILY, HAND_CHEST],
  "i love you": [POINT_SELF, ILY, POINT],
  peace: [PEACE, PEACE],
  stop: [OPEN_PALM, OPEN_PALM, OPEN_PALM],
  go: [POINT, OPEN_PALM],
  come: [POINT, HAND_CHEST],
  goodbye: [WAVE_LEFT, WAVE_RIGHT, WAVE_LEFT],
  bye: [WAVE_LEFT, WAVE_RIGHT],
  welcome: [OPEN_PALM, HAND_CHEST, OPEN_PALM],
  namaste: [HAND_CHEST, HAND_CHEST],
  name: [PEACE, OPEN_PALM],
  nice: [OPEN_PALM, THUMBS_UP],
  meet: [POINT, POINT_SELF],
  to: [POINT, OPEN_PALM],
  how: [OPEN_PALM, OK_SIGN],
  are: [OPEN_PALM, OPEN_PALM],
  what: [OPEN_PALM, OPEN_PALM],
  where: [POINT, OPEN_PALM],
  when: [POINT, POINT],
  why: [OK_SIGN, OPEN_PALM],
  help: [FIST, OPEN_PALM],
  friend: [PEACE, ILY],
  family: [OK_SIGN, HAND_CHEST],
  eat: [OK_SIGN, HAND_CHEST],
  drink: [OK_SIGN, OPEN_PALM],
  water: [PEACE, OPEN_PALM],
  home: [OPEN_PALM, HAND_CHEST],
  work: [FIST, FIST],
};

const FINGERSPELL_FALLBACK: HandPose[] = [OPEN_PALM, FIST];

export function textToPoseSequence(text: string): { word: string; poses: HandPose[] }[] {
  const cleaned = text.toLowerCase().replace(/[^a-z\s]/g, " ").replace(/\s+/g, " ").trim();
  if (!cleaned) return [];
  // Try multi-word phrases first
  const phrases = Object.keys(SIGN_DICTIONARY).filter((k) => k.includes(" "));
  let working = cleaned;
  const result: { word: string; poses: HandPose[] }[] = [];
  // greedy phrase match
  while (working.length > 0) {
    let matched = false;
    for (const p of phrases) {
      if (working.startsWith(p)) {
        result.push({ word: p, poses: SIGN_DICTIONARY[p] });
        working = working.slice(p.length).trim();
        matched = true;
        break;
      }
    }
    if (matched) continue;
    const next = working.split(" ")[0];
    working = working.slice(next.length).trim();
    if (SIGN_DICTIONARY[next]) {
      result.push({ word: next, poses: SIGN_DICTIONARY[next] });
    } else {
      result.push({ word: next, poses: FINGERSPELL_FALLBACK });
    }
  }
  return result;
}
