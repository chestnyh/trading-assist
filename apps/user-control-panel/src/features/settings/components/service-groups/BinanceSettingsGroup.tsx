import SimpleServiceSettingsGroup from "./SimpleServiceSettingsGroup";
import type { DetailField } from "../RuleSetting";

const BINANCE_FIELDS_SCHEMA: DetailField[] = [
  { key: "apiKey", label: "ApiKey", required: true, exactLength: 32, placeholder: "Insert api key…" },
  { key: "apiSecret", label: "ApiSecret", required: true, exactLength: 64, placeholder: "Insert secret key…" },
  { key: "baseUrl", label: "BaseUrl", required: true, minLength: 20, maxLength: 100, placeholder: "Insert base url…" },
];

export default function BinanceSettingsGroup() {
  return (
    <SimpleServiceSettingsGroup
      serviceCode="BINANCE"
      name="Binance"
      logoUrl="/logos/binance.svg"
      fieldsSchema={BINANCE_FIELDS_SCHEMA}
    />
  );
}