const UNIT_MS: Record<string, number> = {
  ms: 1,
  s: 1000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
};

/**
 * Parses a duration such as `15m`, `24h`, `30d` or `60s` into milliseconds.
 * Falls back to `fallbackMs` when the value is missing or malformed.
 */
export function parseDurationToMs(
  value: string | boolean | undefined,
  fallbackMs: number
): number {
  if (typeof value !== 'string') {
    return fallbackMs;
  }

  const match = /^\s*(\d+(?:\.\d+)?)\s*(ms|s|m|h|d)?\s*$/.exec(value);
  if (!match) {
    return fallbackMs;
  }

  const amount = Number(match[1]);
  const unit = match[2] ?? 'ms';
  return Math.round(amount * UNIT_MS[unit]);
}
