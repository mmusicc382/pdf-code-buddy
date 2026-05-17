// Simple gesture classifier based on MediaPipe Hand landmarks (21 points)
// Landmark indices: 0=wrist, thumb 1-4, index 5-8, middle 9-12, ring 13-16, pinky 17-20

export type Landmark = { x: number; y: number; z: number };

const fingerTipIds = [4, 8, 12, 16, 20];
const fingerPipIds = [3, 6, 10, 14, 18];

function fingersUp(lm: Landmark[], handedness: "Left" | "Right"): boolean[] {
  const up: boolean[] = [];
  // Thumb: compare x of tip vs ip (mirrored depending on handedness)
  if (handedness === "Right") {
    up.push(lm[4].x < lm[3].x);
  } else {
    up.push(lm[4].x > lm[3].x);
  }
  // Other fingers: tip.y < pip.y means extended (y grows downward)
  for (let i = 1; i < 5; i++) {
    up.push(lm[fingerTipIds[i]].y < lm[fingerPipIds[i]].y - 0.02);
  }
  return up;
}

export function classifyGesture(
  lm: Landmark[],
  handedness: "Left" | "Right" = "Right"
): { label: string; meaning: string } | null {
  if (!lm || lm.length < 21) return null;
  const f = fingersUp(lm, handedness);
  const [thumb, index, middle, ring, pinky] = f;
  const count = f.filter(Boolean).length;

  // Thumbs up: only thumb, and thumb tip above wrist
  if (thumb && !index && !middle && !ring && !pinky && lm[4].y < lm[0].y) {
    return { label: "Thumbs Up", meaning: "Good" };
  }
  // Fist: nothing up
  if (count === 0) return { label: "Fist", meaning: "Yes" };
  // Open palm: all five
  if (count === 5) return { label: "Open Palm", meaning: "Hello" };
  // Peace: index + middle
  if (!thumb && index && middle && !ring && !pinky) {
    return { label: "Peace", meaning: "Peace" };
  }
  // Pointing: only index
  if (!thumb && index && !middle && !ring && !pinky) {
    return { label: "Pointing", meaning: "You" };
  }
  // Rock: index + pinky
  if (index && !middle && !ring && pinky) {
    return { label: "Rock", meaning: "I love you" };
  }
  // OK: thumb tip close to index tip, other 3 up
  const dx = lm[4].x - lm[8].x;
  const dy = lm[4].y - lm[8].y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < 0.06 && middle && ring && pinky) {
    return { label: "OK", meaning: "Okay" };
  }
  // Call me: thumb + pinky
  if (thumb && !index && !middle && !ring && pinky) {
    return { label: "Call", meaning: "Call me" };
  }
  return null;
}
