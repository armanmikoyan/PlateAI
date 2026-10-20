const TAP_DURATION_MS = 18;

export function hapticTap(durationMs = TAP_DURATION_MS): void {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') {
    return;
  }

  try {
    navigator.vibrate(durationMs);
  } catch {
    // Vibration can be blocked; treat as a no-op.
  }
}
