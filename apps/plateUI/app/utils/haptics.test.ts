import { afterEach, describe, expect, it, vi } from 'vitest';
import { hapticTap } from './haptics';

function stubVibrate() {
  const vibrate = vi.fn().mockReturnValue(true);
  vi.stubGlobal('navigator', { vibrate });
  return vibrate;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('hapticTap', () => {
  it('vibrates for a short tap', () => {
    const vibrate = stubVibrate();

    hapticTap();

    expect(vibrate).toHaveBeenCalledWith(18);
  });

  it('accepts a custom duration', () => {
    const vibrate = stubVibrate();

    hapticTap(40);

    expect(vibrate).toHaveBeenCalledWith(40);
  });

  it('does nothing when vibration is unsupported', () => {
    vi.stubGlobal('navigator', {});

    expect(() => hapticTap()).not.toThrow();
  });

  it('swallows vibrate errors', () => {
    vi.stubGlobal('navigator', {
      vibrate: () => {
        throw new Error('blocked');
      },
    });

    expect(() => hapticTap()).not.toThrow();
  });
});
