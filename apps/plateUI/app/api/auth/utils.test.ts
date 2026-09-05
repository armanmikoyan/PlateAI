import { describe, expect, it } from 'vitest';
import {
  readAccessTokenFromCookieHeader,
  readRefreshTokenFromCookieHeader,
  mergeRefreshedCookies,
} from './utils';
import { AUTH } from './constants';

const ACCESS_COOKIE = `${AUTH.ACCESS_COOKIE_NAME}=old-access-token`;
const REFRESH_COOKIE = `${AUTH.REFRESH_COOKIE_NAME}=old-refresh-token`;

describe('readAccessTokenFromCookieHeader', () => {
  it('reads the access cookie by name', () => {
    expect(readAccessTokenFromCookieHeader(`${ACCESS_COOKIE}; ${REFRESH_COOKIE}`)).toBe(
      'old-access-token',
    );
  });

  it('returns null when the cookie is absent', () => {
    expect(readAccessTokenFromCookieHeader(null)).toBeNull();
    expect(readAccessTokenFromCookieHeader(REFRESH_COOKIE)).toBeNull();
  });
});

describe('readRefreshTokenFromCookieHeader', () => {
  it('reads the refresh cookie by name', () => {
    expect(readRefreshTokenFromCookieHeader(`${ACCESS_COOKIE}; ${REFRESH_COOKIE}`)).toBe(
      'old-refresh-token',
    );
  });

  it('returns null when the cookie is absent', () => {
    expect(readRefreshTokenFromCookieHeader(null)).toBeNull();
    expect(readRefreshTokenFromCookieHeader(ACCESS_COOKIE)).toBeNull();
  });
});

describe('mergeRefreshedCookies', () => {
  it('replaces matching cookie values from the set-cookie list', () => {
    const merged = mergeRefreshedCookies(
      `${REFRESH_COOKIE}; ${ACCESS_COOKIE}>; mode=dark`,
      [
        `${AUTH.ACCESS_COOKIE_NAME}=new-access-token; Path=/; HttpOnly`,
        `${AUTH.REFRESH_COOKIE_NAME}=new-refresh-token; Path=/; HttpOnly`,
      ],
    );

    expect(merged).toContain(`${AUTH.ACCESS_COOKIE_NAME}=new-access-token`);
    expect(merged).toContain(`${AUTH.REFRESH_COOKIE_NAME}=new-refresh-token`);
    expect(merged).toContain('mode=dark');
  });

  it('appends new cookies and keeps unrelated ones when the header is null', () => {
    const merged = mergeRefreshedCookies(null, [
      `${AUTH.ACCESS_COOKIE_NAME}=new-access-token; Path=/; HttpOnly`,
    ]);

    expect(merged).toBe(`${AUTH.ACCESS_COOKIE_NAME}=new-access-token`);
  });

  it('returns the original header when there is nothing to merge', () => {
    expect(mergeRefreshedCookies(ACCESS_COOKIE, [])).toBe(ACCESS_COOKIE);
  });

  it('ignores malformed set-cookie entries', () => {
    const merged = mergeRefreshedCookies(REFRESH_COOKIE, ['no-value', '']);

    expect(merged).toBe(REFRESH_COOKIE);
  });
});