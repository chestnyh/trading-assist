import SimpleServiceSettingsGroup from "./SimpleServiceSettingsGroup";
import type { DetailField } from "../RuleSetting";

const WEBHOOKS_FIELDS_SCHEMA: DetailField[] = [
  { key: "webhookUrl", label: "WebhookUrl", required: true, minLength: 80, maxLength: 120, placeholder: "Insert webhook url…" },
];

export default function WebhooksSettingsGroup() {
  return (
    <SimpleServiceSettingsGroup
      serviceCode="WEBHOOKS"
      name="Webhooks"
      logoUrl="/logos/webhooks.png"
      fieldsSchema={WEBHOOKS_FIELDS_SCHEMA}
    />
  );
}