import type { CountryCode } from '@trading-bot/api-validator';

export interface CountryOption {
  value: CountryCode;
  label: string;
  countryCode: CountryCode;
}

export const countries: CountryOption[] = [
  { value: 'US', label: 'United States', countryCode: 'US' },
  { value: 'GB', label: 'United Kingdom', countryCode: 'GB' },
  { value: 'CA', label: 'Canada', countryCode: 'CA' },
  { value: 'AU', label: 'Australia', countryCode: 'AU' },
  { value: 'DE', label: 'Germany', countryCode: 'DE' },
  { value: 'FR', label: 'France', countryCode: 'FR' },
  { value: 'IT', label: 'Italy', countryCode: 'IT' },
  { value: 'ES', label: 'Spain', countryCode: 'ES' },
  { value: 'NL', label: 'Netherlands', countryCode: 'NL' },
  { value: 'BE', label: 'Belgium', countryCode: 'BE' },
  { value: 'CH', label: 'Switzerland', countryCode: 'CH' },
  { value: 'AT', label: 'Austria', countryCode: 'AT' },
  { value: 'SE', label: 'Sweden', countryCode: 'SE' },
  { value: 'NO', label: 'Norway', countryCode: 'NO' },
  { value: 'DK', label: 'Denmark', countryCode: 'DK' },
  { value: 'FI', label: 'Finland', countryCode: 'FI' },
  { value: 'PL', label: 'Poland', countryCode: 'PL' },
  { value: 'CZ', label: 'Czech Republic', countryCode: 'CZ' },
  { value: 'IE', label: 'Ireland', countryCode: 'IE' },
  { value: 'PT', label: 'Portugal', countryCode: 'PT' },
  { value: 'GR', label: 'Greece', countryCode: 'GR' },
  { value: 'UA', label: 'Ukraine', countryCode: 'UA' },
];

export const countriesForSelect = countries.map((country) => ({
  value: country.value,
  label: country.label,
}));
