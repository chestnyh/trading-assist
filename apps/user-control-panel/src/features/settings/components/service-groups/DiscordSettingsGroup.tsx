import SimpleServiceSettingsGroup from "./SimpleServiceSettingsGroup";
import type { DetailField } from "../RuleSetting";

const DISCORD_FIELDS_SCHEMA: DetailField[] = [
  { key: "webhookUrl", label: "WebhookUrl", required: true, minLength: 80, maxLength: 120, placeholder: "Insert webhook url…" },
  { key: "userName", label: "UserName", required: false, placeholder: "Optional user name…" },
  { key: "avatarUrl", label: "AvatarUrl", required: false, placeholder: "Optional avatar url…" },
];

export default function DiscordSettingsGroup() {
  return (
    <SimpleServiceSettingsGroup
      serviceCode="DISCORD_WEBHOOKS"
      name="Discord Webhooks"
      logoUrl="/logos/discord.svg"
      fieldsSchema={DISCORD_FIELDS_SCHEMA}
    />
  );
}