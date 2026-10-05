import { describe, expect, it } from 'vitest';
import { HOMEPAGE_BG_VIDEOS } from './constants';
import { pickHomepageBgVideoIndex } from './utils';

describe('pickHomepageBgVideoIndex', () => {
  it('always returns a valid index', () => {
    for (let attempt = 0; attempt < 200; attempt += 1) {
      const index = pickHomepageBgVideoIndex();
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(HOMEPAGE_BG_VIDEOS.length);
    }
  });

  it('eventually reaches every clip', () => {
    const seen = new Set<number>();
    for (let attempt = 0; attempt < 500; attempt += 1) {
      seen.add(pickHomepageBgVideoIndex());
    }
    expect(seen.size).toBe(HOMEPAGE_BG_VIDEOS.length);
  });

  it('falls back to the first clip without Web Crypto', () => {
    const original = globalThis.crypto;
    Object.defineProperty(globalThis, 'crypto', { value: {}, configurable: true });
    try {
      expect(pickHomepageBgVideoIndex()).toBe(0);
    } finally {
      Object.defineProperty(globalThis, 'crypto', { value: original, configurable: true });
    }
  });
});
