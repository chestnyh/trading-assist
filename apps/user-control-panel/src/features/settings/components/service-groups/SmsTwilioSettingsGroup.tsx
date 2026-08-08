import SimpleServiceSettingsGroup from "./SimpleServiceSettingsGroup";
import type { DetailField } from "../RuleSetting";

const SMS_TWILIO_FIELDS_SCHEMA: DetailField[] = [
  { key: "accountSid", label: "AccountSID", required: true, exactLength: 34, placeholder: "Insert Account SID…" },
  { key: "authToken", label: "AuthToken", required: true, exactLength: 32, placeholder: "Insert Auth Token…" },
  { key: "fromNumber", label: "FromNumber", required: true, pattern: "^\\+?[0-9]{7,15}$", placeholder: "Insert from number…" },
  { key: "toNumber", label: "ToNumber", required: true, pattern: "^\\+?[0-9]{7,15}$", placeholder: "Insert to number…" },
  { key: "message", label: "Message", required: true, placeholder: "Insert message…" },
];

export default function SmsTwilioSettingsGroup() {
  return (
    <SimpleServiceSettingsGroup
      serviceCode="SMS_TWILIO"
      name="SMS (via Twilio)"
      logoUrl="/logos/twilio.svg"
      fieldsSchema={SMS_TWILIO_FIELDS_SCHEMA}
    />
  );
}