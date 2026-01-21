import ExternalServiceSettingsGroup, { DetailField } from "./components/ExternalServiceSettingsGroup";

const LOGOS_BASE = "/logos";
const SERVICES: { key: string; name: string; logoUrl: string; fieldsSchema?: DetailField[] }[] = [
  {
    key: "binance",
    name: "Binance",
    logoUrl: `${LOGOS_BASE}/binance.svg`,
    fieldsSchema: [
      { key: "apiKey", label: "ApiKey", required: true, exactLength: 32, placeholder: "Insert api key…" },
      { key: "apiSecret", label: "ApiSecret", required: true, exactLength: 64, placeholder: "Insert secret key…" },
      { key: "baseUrl", label: "BaseUrl", required: true, minLength: 20, maxLength: 100, placeholder: "Insert base url…" },
    ],
  },
  {
    key: "bybit",
    name: "Bybit",
    logoUrl: `${LOGOS_BASE}/bybit.jpg`,
    fieldsSchema: [
      { key: "apiKey", label: "ApiKey", required: true, exactLength: 32, placeholder: "Insert api key…" },
      { key: "apiSecret", label: "ApiSecret", required: true, exactLength: 64, placeholder: "Insert secret key…" },
      { key: "baseUrl", label: "BaseUrl", required: true, minLength: 20, maxLength: 100, placeholder: "Insert base url…" },
    ],
  },
  {
    key: "kraken",
    name: "Kraken",
    logoUrl: `${LOGOS_BASE}/kraken.png`,
    fieldsSchema: [
      { key: "apiKey", label: "ApiKey", required: true, minLength: 50, maxLength: 64, placeholder: "Insert api key…" },
      { key: "apiSecret", label: "ApiSecret", required: true, minLength: 80, maxLength: 96, placeholder: "Insert secret key…" },
      { key: "baseUrl", label: "BaseUrl", required: true, minLength: 20, maxLength: 100, placeholder: "Insert base url…" },
    ],
  },
  {
    key: "telegram",
    name: "Telegram",
    logoUrl: `${LOGOS_BASE}/telegram.png`,
    fieldsSchema: [
      { key: "botToken", label: "BotToken", required: true, minLength: 45, maxLength: 50, placeholder: "Insert bot token…" },
      { key: "baseUrl", label: "BaseUrl", required: false, minLength: 20, maxLength: 100, placeholder: "Insert base url…" },
    ],
  },
  {
    key: "whatsapp-business",
    name: "WhatsApp Business API",
    logoUrl: `${LOGOS_BASE}/whatsapp-business-api.svg`,
    fieldsSchema: [
      { key: "phoneNumberId", label: "PhoneNumberId", required: true, pattern: /^\\+?[0-9]{7,15}$/, placeholder: "Insert phone number…" },
      { key: "accessToken", label: "AccessToken", required: true, minLength: 200, maxLength: 300, placeholder: "Insert access token…" },
      { key: "recipientNumber", label: "RecipientNumber", required: true, pattern: /^\\+?[0-9]{7,15}$/, placeholder: "Insert recipient number…" },
    ],
  },
  {
    key: "discord-webhooks",
    name: "Discord Webhooks",
    logoUrl: `${LOGOS_BASE}/discord.svg`,
    fieldsSchema: [
      { key: "webhookUrl", label: "WebhookUrl", required: true, minLength: 80, maxLength: 120, placeholder: "Insert webhook url…" },
      { key: "userName", label: "UserName", required: false, placeholder: "Optional user name…" },
      { key: "avatarUrl", label: "AvatarUrl", required: false, placeholder: "Optional avatar url…" },
    ],
  },
  {
    key: "slack-webhooks",
    name: "Slack Webhooks",
    logoUrl: `${LOGOS_BASE}/slack.png`,
    fieldsSchema: [
      { key: "webhookUrl", label: "WebhookUrl", required: true, minLength: 80, maxLength: 120, placeholder: "Insert webhook url…" },
      { key: "channel", label: "Channel", required: false, placeholder: "Optional channel…" },
      { key: "userName", label: "UserName", required: false, placeholder: "Optional user name…" },
      { key: "iconUrl", label: "IconUrl", required: false, placeholder: "Optional icon url…" },
    ],
  },
  {
    key: "sms-twilio",
    name: "SMS (via Twilio)",
    logoUrl: `${LOGOS_BASE}/twilio.svg`,
    fieldsSchema: [
      { key: "accountSid", label: "AccountSID", required: true, exactLength: 34, placeholder: "Insert Account SID…" },
      { key: "authToken", label: "AuthToken", required: true, exactLength: 32, placeholder: "Insert Auth Token…" },
      { key: "fromNumber", label: "FromNumber", required: true, pattern: /^\\+?[0-9]{7,15}$/, placeholder: "Insert from number…" },
      { key: "toNumber", label: "ToNumber", required: true, pattern: /^\\+?[0-9]{7,15}$/, placeholder: "Insert to number…" },
      { key: "message", label: "Message", required: true, placeholder: "Insert message…" },
    ],
  },
  {
    key: "push-notifications-onesignal",
    name: "Push Notifications (One Signal)",
    logoUrl: `${LOGOS_BASE}/onesignal.svg`,
    fieldsSchema: [
      { key: "appId", label: "AppId", required: true, exactLength: 36, placeholder: "Insert App ID…" },
      { key: "apiKey", label: "ApiKey", required: true, minLength: 32, maxLength: 50, placeholder: "Insert API key…" },
      { key: "playerIds", label: "PlayerIds", required: true, type: "array" as const, placeholder: "Comma separated player IDs…" },
    ],
  },
  {
    key: "email",
    name: "Email",
    logoUrl: `${LOGOS_BASE}/email.png`,
    fieldsSchema: [
      { key: "email", label: "EmailAddress", required: true, pattern: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/, placeholder: "user.name@some-domain.com" },
    ],
  },
  {
    key: "webhooks",
    name: "Webhooks",
    logoUrl: `${LOGOS_BASE}/webhooks.png`,
    fieldsSchema: [
      { key: "webhookUrl", label: "WebhookUrl", required: true, minLength: 80, maxLength: 120, placeholder: "Insert webhook url…" },
    ],
  },
];

export default function Settings() {
  return (
    <div className="px-4 md:px-8 lg:px-12 py-6 max-w-5xl mx-auto">
      <h1 className="text-h4 text-primary mb-6">Rules Settings</h1>
      <div className="flex flex-col gap-3">
        {SERVICES.map((s) => (
          <ExternalServiceSettingsGroup
            key={s.key}
            name={s.name}
            logoUrl={s.logoUrl}
            logoKey={s.key}
            fieldsSchema={s.fieldsSchema}
          />
        ))}
      </div>
    </div>
  );
}
