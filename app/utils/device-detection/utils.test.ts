import { describe, expect, it } from 'vitest';

import { DEVICE_TYPE } from './types';
import { detectDeviceType } from './utils';

describe('detectDeviceType', () => {
  it('detects phones from the user agent', () => {
    expect(
      detectDeviceType({
        USER_AGENT:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      }),
    ).toBe(DEVICE_TYPE.PHONE);
    expect(
      detectDeviceType({
        USER_AGENT:
          'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36',
      }),
    ).toBe(DEVICE_TYPE.PHONE);
  });

  it('treats computers and tablets as desktop', () => {
    expect(
      detectDeviceType({
        USER_AGENT:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      }),
    ).toBe(DEVICE_TYPE.DESKTOP);
    expect(
      detectDeviceType({
        USER_AGENT:
          'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      }),
    ).toBe(DEVICE_TYPE.DESKTOP);
    expect(
      detectDeviceType({
        USER_AGENT:
          'Mozilla/5.0 (Linux; Android 13; SM-X810) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      }),
    ).toBe(DEVICE_TYPE.DESKTOP);
  });

  it('trusts the mobile client hint when present', () => {
    expect(
      detectDeviceType({
        USER_AGENT:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        USER_AGENT_MOBILE: true,
      }),
    ).toBe(DEVICE_TYPE.PHONE);
    expect(
      detectDeviceType({
        USER_AGENT:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        USER_AGENT_MOBILE: false,
      }),
    ).toBe(DEVICE_TYPE.DESKTOP);
  });
});
