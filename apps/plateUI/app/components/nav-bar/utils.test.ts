import { describe, expect, it } from 'vitest';

import {
  getActiveSectionId,
  navScrollSpyBandPx,
  scrollBehavior,
  sectionIdFromHref,
  shouldInterceptSamePageHashClick,
} from './utils';

const SECTIONS = [
  { SECTION_ID: 'how-it-works' },
  { SECTION_ID: 'features' },
  { SECTION_ID: 'faq' },
] as const;

const PRIMARY_CLICK = {
  META: false,
  CTRL: false,
  SHIFT: false,
  ALT: false,
  BUTTON: 0,
} as const;

describe('navScrollSpyBandPx', () => {
  it('adds header offset and extra slack', () => {
    expect(navScrollSpyBandPx(80, 320)).toBe(400);
  });
});

describe('getActiveSectionId', () => {
  it('returns null when no section has entered the band', () => {
    expect(
      getActiveSectionId(SECTIONS, { 'how-it-works': 480, features: 900, faq: 1400 }, 400),
    ).toBeNull();
  });

  it('returns the last section whose top is at or above the band', () => {
    expect(
      getActiveSectionId(SECTIONS, { 'how-it-works': 40, features: 220, faq: 900 }, 400),
    ).toBe('features');
  });

  it('skips missing measurements and still picks the last entered section', () => {
    expect(getActiveSectionId(SECTIONS, { 'how-it-works': 10, faq: 200 }, 400)).toBe('faq');
  });
});

describe('sectionIdFromHref', () => {
  it('reads the hash from a same-origin section href', () => {
    expect(sectionIdFromHref('/#features')).toBe('features');
  });

  it('returns null when there is no hash or an empty hash', () => {
    expect(sectionIdFromHref('/snap')).toBeNull();
    expect(sectionIdFromHref('/#')).toBeNull();
  });
});

describe('shouldInterceptSamePageHashClick', () => {
  it('intercepts a primary click to a hash on the home path', () => {
    expect(shouldInterceptSamePageHashClick('/#faq', '/', PRIMARY_CLICK)).toBe(true);
  });

  it('leaves modified clicks and off-home paths to the browser', () => {
    expect(shouldInterceptSamePageHashClick('/#faq', '/', { ...PRIMARY_CLICK, META: true })).toBe(
      false,
    );
    expect(shouldInterceptSamePageHashClick('/#faq', '/snap', PRIMARY_CLICK)).toBe(false);
    expect(shouldInterceptSamePageHashClick('/snap', '/', PRIMARY_CLICK)).toBe(false);
  });
});

describe('scrollBehavior', () => {
  it('uses instant scroll when motion is reduced', () => {
    expect(scrollBehavior(true)).toBe('auto');
    expect(scrollBehavior(false)).toBe('smooth');
  });
});
