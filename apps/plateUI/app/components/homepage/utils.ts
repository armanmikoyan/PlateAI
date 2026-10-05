import { HOMEPAGE_BG_VIDEOS } from './constants';

/**
 * Random entry point so repeat visits don't open on the same clip. Uses the full 32-bit
 * range rather than `length`, since `% 3` over `Math.random()` skews toward the low
 * indices. Falls back to the first clip so a bad `crypto.getRandomValues` can't render
 * an empty background.
 */
export function pickHomepageBgVideoIndex(): number {
  if (typeof globalThis.crypto?.getRandomValues !== 'function') {
    return 0;
  }

  const range = new Uint32Array(1);
  globalThis.crypto.getRandomValues(range);
  return (range[0] % HOMEPAGE_BG_VIDEOS.length) as number;
}
