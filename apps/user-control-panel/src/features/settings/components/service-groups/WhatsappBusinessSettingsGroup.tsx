import SimpleServiceSettingsGroup from "./SimpleServiceSettingsGroup";
import type { DetailField } from "../RuleSetting";

const WHATSAPP_FIELDS_SCHEMA: DetailField[] = [
  { key: "phoneNumberId", label: "PhoneNumberId", required: true, pattern: "^\\+?[0-9]{7,15}$", placeholder: "Insert phone number…" },
  { key: "accessToken", label: "AccessToken", required: true, minLength: 200, maxLength: 300, placeholder: "Insert access token…" },
  { key: "recipientNumber", label: "RecipientNumber", required: true, pattern: "^\\+?[0-9]{7,15}$", placeholder: "Insert recipient number…" },
];

export default function WhatsappBusinessSettingsGroup() {
  return (
    <SimpleServiceSettingsGroup
      serviceCode="WHATSAPP_BUSINESS"
      name="WhatsApp Business API"
      logoUrl="/logos/whatsapp-business.svg"
      fieldsSchema={WHATSAPP_FIELDS_SCHEMA}
    />
  );
}