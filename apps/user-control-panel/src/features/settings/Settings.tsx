import ExternalServiceSettingsGroup from "./components/ExternalServiceSettingsGroup";

const SERVICES = [
  { key: "binance", name: "Binance" },
  { key: "bybit", name: "Bybit" },
  { key: "kraken", name: "Kraken" },
  { key: "telegram", name: "Telegram" },
  { key: "whatsapp-business-api", name: "WhatsApp Business API" },
  { key: "discord-webhooks", name: "Discord Webhooks" },
  { key: "slack-webhooks", name: "Slack Webhooks" },
  { key: "sms-twilio", name: "SMS (via Twilio)" },
  { key: "push-notifications-onesignal", name: "Push Notifications (One Signal)" },
  { key: "email", name: "Email" },
  { key: "webhooks", name: "Webhooks" },
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
            logoTag={`logo-${s.key}`}
          />
        ))}
      </div>
    </div>
  );
}

