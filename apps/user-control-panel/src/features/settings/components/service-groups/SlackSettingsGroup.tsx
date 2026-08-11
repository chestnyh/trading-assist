import SimpleServiceSettingsGroup from "./SimpleServiceSettingsGroup";
import type { DetailField } from "../RuleSetting";

const SLACK_FIELDS_SCHEMA: DetailField[] = [
  { key: "webhookUrl", label: "WebhookUrl", required: true, minLength: 80, maxLength: 120, placeholder: "Insert webhook url…" },
  { key: "channel", label: "Channel", required: false, placeholder: "Optional channel…" },
  { key: "userName", label: "UserName", required: false, placeholder: "Optional user name…" },
  { key: "iconUrl", label: "IconUrl", required: false, placeholder: "Optional icon url…" },
];

export default function SlackSettingsGroup() {
  return (
    <SimpleServiceSettingsGroup
      serviceCode="SLACK_WEBHOOKS"
      name="Slack Webhooks"
      logoUrl="/logos/slack.png"
      fieldsSchema={SLACK_FIELDS_SCHEMA}
    />
  );
}