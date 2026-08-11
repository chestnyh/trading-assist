import SimpleServiceSettingsGroup from "./SimpleServiceSettingsGroup";
import type { DetailField } from "../RuleSetting";

const KRAKEN_FIELDS_SCHEMA: DetailField[] = [
  { key: "apiKey", label: "ApiKey", required: true, minLength: 50, maxLength: 64, placeholder: "Insert api key…" },
  { key: "apiSecret", label: "ApiSecret", required: true, minLength: 80, maxLength: 96, placeholder: "Insert secret key…" },
  { key: "baseUrl", label: "BaseUrl", required: true, minLength: 20, maxLength: 100, placeholder: "Insert base url…" },
];

export default function KrakenSettingsGroup() {
  return (
    <SimpleServiceSettingsGroup
      serviceCode="KRAKEN"
      name="Kraken"
      logoUrl="/logos/kraken.png"
      fieldsSchema={KRAKEN_FIELDS_SCHEMA}
    />
  );
}