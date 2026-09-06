import { describe, expect, it } from 'vitest';
import { formatRetryDescription, retryAfterSecondsFromHeader } from './utils';

describe('retryAfterSecondsFromHeader', () => {
  it('parses a positive integer', () => {
    expect(retryAfterSecondsFromHeader('47')).toBe(47);
  });

  it('returns undefined for null', () => {
    expect(retryAfterSecondsFromHeader(null)).toBeUndefined();
  });

  it('returns undefined for empty string', () => {
    expect(retryAfterSecondsFromHeader('')).toBeUndefined();
  });

  it('returns undefined for zero', () => {
    expect(retryAfterSecondsFromHeader('0')).toBeUndefined();
  });

  it('returns undefined for garbage', () => {
    expect(retryAfterSecondsFromHeader('soon')).toBeUndefined();
  });
});

describe('formatRetryDescription', () => {
  it('formats seconds', () => {
    expect(formatRetryDescription(47)).toBe('Try again in about 47 seconds.');
  });

  it('forms singular second', () => {
    expect(formatRetryDescription(1)).toBe('Try again in about 1 second.');
  });

  it('rounds fractional seconds up to a minimum of 1', () => {
    expect(formatRetryDescription(0.2)).toBe('Try again in about 1 second.');
  });

  it('formats minutes', () => {
    expect(formatRetryDescription(120)).toBe('Try again in about 2 minutes.');
  });

  it('forms singular minute', () => {
    expect(formatRetryDescription(90)).toBe('Try again in about 2 minutes.');
  });
});