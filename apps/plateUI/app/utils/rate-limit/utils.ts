export function retryAfterSecondsFromHeader(header: string | null): number | undefined {
  if (!header) {
    return undefined;
  }

  const seconds = Number.parseInt(header, 10);

  if (!Number.isInteger(seconds) || seconds < 1) {
    return undefined;
  }

  return seconds;
}

export function formatRetryDescription(seconds: number): string {
  const safeSeconds = Math.max(1, Math.round(seconds));

  if (safeSeconds < 60) {
    return `Try again in about ${safeSeconds} second${safeSeconds === 1 ? '' : 's'}.`;
  }

  const minutes = Math.ceil(safeSeconds / 60);

  return `Try again in about ${minutes} minute${minutes === 1 ? '' : 's'}.`;
}