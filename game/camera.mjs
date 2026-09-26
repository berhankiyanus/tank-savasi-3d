// World framing is shared by every competitive device, independent of CSS pixels.
export function combatFraming(width, height, competitive = false) {
  const aspect = Math.max(1, width) / Math.max(1, height);
  // Keep portrait solo's familiar scale; compensate for the shorter landscape screen.
  const elevation = competitive ? 12.5 : 12.5 + 5.5 * Math.max(0, Math.min(1, (1.3 - aspect) / .7));
  return { fov: 50, aspect: competitive ? 16 / 9 : aspect, elevation, back: elevation * 2 / 3, ahead: elevation / 12 };
}
