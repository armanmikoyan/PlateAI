import { describe, expect, it } from 'vitest';
import {
  NAV_MAIN_SECTION_LINKS,
  NAV_SCROLL_SPY_HEADER_OFFSET_PX,
  NAV_SCROLL_SPY_VIEWPORT_EXTRA_PX,
} from './constants';
import {
  getActiveSectionId,
  navScrollSpyBandPx,
  scrollBehavior,
  sectionIdFromHref,
  shouldInterceptSamePageHashClick,
} from './utils';

const SECTIONS = [{ SECTION_ID: 'how-it-works' }, { SECTION_ID: 'features' }, { SECTION_ID: 'faq' }] as const;

const PRIMARY_CLICK = {
  META: false,
  CTRL: false,
  SHIFT: false,
  ALT: false,
  BUTTON: 0,
} as const;

/**
 * Measured tops with the page scrolled to `how-it-works`: `features` renders before
 * it and has scrolled above the viewport, so its negative top must not win.
 */
const MEASURED_TOPS = {
  features: -700,
  'how-it-works': 224,
  'use-cases': 900,
  feedback: 1600,
  pricing: 2400,
  faq: 3200,
} as const;

describe('NAV_MAIN_SECTION_LINKS', () => {
  it('lists sections in the order app/page.tsx renders them', () => {
    expect(NAV_MAIN_SECTION_LINKS.map((row) => row.SECTION_ID)).toEqual([
      'features',
      'how-it-works',
      'use-cases',
      'feedback',
      'pricing',
      'faq',
    ]);
  });
});

describe('navScrollSpyBandPx', () => {
  it('adds header offset and extra slack', () => {
    expect(navScrollSpyBandPx(NAV_SCROLL_SPY_HEADER_OFFSET_PX, NAV_SCROLL_SPY_VIEWPORT_EXTRA_PX)).toBe(400);
  });

  it('clears the anchor landing offset so a clicked section is active right away', () => {
    // scroll-mt-28 (112) + scroll-pt-28 (112); measured at the band constant.
    const bandPx = navScrollSpyBandPx(NAV_SCROLL_SPY_HEADER_OFFSET_PX, NAV_SCROLL_SPY_VIEWPORT_EXTRA_PX);
    expect(bandPx).toBeGreaterThan(224);
  });
});

describe('getActiveSectionId', () => {
  it('returns null while the page top is still on screen', () => {
    expect(getActiveSectionId(SECTIONS, { 'how-it-works': 480, features: 900, faq: 1400 }, 400)).toBeNull();
  });

  it('returns null when there are no sections at all', () => {
    expect(getActiveSectionId([], {}, 400)).toBeNull();
  });

  it('picks the section nearest the band, not the last one in array order', () => {
    expect(getActiveSectionId(NAV_MAIN_SECTION_LINKS, MEASURED_TOPS, 400)).toBe('how-it-works');
  });

  it('advances past a section that is still above the band', () => {
    expect(getActiveSectionId(NAV_MAIN_SECTION_LINKS, { ...MEASURED_TOPS, 'use-cases': 380 }, 400)).toBe(
      'use-cases',
    );
  });

  it('keeps a clicked section active at its post-jump landing offset', () => {
    expect(getActiveSectionId(NAV_MAIN_SECTION_LINKS, { features: -880, 'how-it-works': 224 }, 400)).toBe(
      'how-it-works',
    );
  });

  it('returns the section nearest the band', () => {
    expect(getActiveSectionId(SECTIONS, { 'how-it-works': 40, features: 220, faq: 900 }, 400)).toBe(
      'features',
    );
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
    expect(shouldInterceptSamePageHashClick('/#faq', '/', { ...PRIMARY_CLICK, META: true })).toBe(false);
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
