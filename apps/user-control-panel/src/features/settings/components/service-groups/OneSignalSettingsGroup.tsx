import SimpleServiceSettingsGroup from "./SimpleServiceSettingsGroup";
import type { DetailField } from "../RuleSetting";

const ONESIGNAL_FIELDS_SCHEMA: DetailField[] = [
  { key: "appId", label: "AppId", required: true, exactLength: 36, placeholder: "Insert App ID…" },
  { key: "apiKey", label: "ApiKey", required: true, minLength: 32, maxLength: 50, placeholder: "Insert API key…" },
  { key: "playerIds", label: "PlayerIds", required: true, type: "array", placeholder: "Comma separated player IDs…" },
];

export default function OneSignalSettingsGroup() {
  return (
    <SimpleServiceSettingsGroup
      serviceCode="PUSH_NOTIFICATIONS_ONESIGNAL"
      name="Push Notifications (One Signal)"
      logoUrl="/logos/onesignal.svg"
      fieldsSchema={ONESIGNAL_FIELDS_SCHEMA}
    />
  );
}