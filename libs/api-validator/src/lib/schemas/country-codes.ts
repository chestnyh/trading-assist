export const ISO_COUNTRY_CODES = [
  'GB', 'US', 'CA', 'AU', 'DE', 'FR', 'IT', 'ES',
  'NL', 'BE', 'CH', 'AT', 'SE', 'NO', 'DK', 'FI',
  'PL', 'CZ', 'IE', 'PT', 'GR', 'UA',
] as const;

export type CountryCode = (typeof ISO_COUNTRY_CODES)[number];

export function isCountryCode(value: unknown): value is CountryCode {
  return (
    typeof value === 'string' &&
    (ISO_COUNTRY_CODES as readonly string[]).includes(value)
  );
}
