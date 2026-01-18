import ExternalServiceSettingsGroup from "./components/ExternalServiceSettingsGroup";

const LOGOS_BASE = "/logos";
const SERVICES = [
  { key: "binance", name: "Binance", logoUrl: `${LOGOS_BASE}/binance.svg` },
  { key: "bybit", name: "Bybit", logoUrl: `${LOGOS_BASE}/bybit.jpg` },
  { key: "kraken", name: "Kraken", logoUrl: `${LOGOS_BASE}/kraken.png` },
  { key: "telegram", name: "Telegram", logoUrl: `${LOGOS_BASE}/telegram.png` },
  { key: "whatsapp-business", name: "WhatsApp Business API", logoUrl: `${LOGOS_BASE}/whatsapp-business-api.svg` },
  { key: "discord-webhooks", name: "Discord Webhooks", logoUrl: `${LOGOS_BASE}/discord.svg` },
  { key: "slack-webhooks", name: "Slack Webhooks", logoUrl: `${LOGOS_BASE}/slack.png` },
  { key: "sms-twilio", name: "SMS (via Twilio)", logoUrl: `${LOGOS_BASE}/twilio.svg` },
  { key: "push-notifications-onesignal", name: "Push Notifications (One Signal)", logoUrl: `${LOGOS_BASE}/onesignal.svg` },
  { key: "email", name: "Email", logoUrl: `${LOGOS_BASE}/email.png` },
  { key: "webhooks", name: "Webhooks", logoUrl: `${LOGOS_BASE}/webhooks.png` },
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
          />
        ))}
      </div>
    </div>
  );
}
