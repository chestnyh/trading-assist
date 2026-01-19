import { useMemo, useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import AddRulesSettingsButton from "./AddRulesSettingsButton";
import RuleSetting from "./RuleSetting";
import RuleSettingForm, { DetailField } from "./RuleSettingForm";

interface ExternalServiceSettingsGroupProps {
  name: string;
  logoUrl?: string;
  logoTag?: string;
  logoKey?: string;
}

export default function ExternalServiceSettingsGroup({
  name,
  logoUrl,
  logoTag,
  logoKey,
}: ExternalServiceSettingsGroupProps) {
  const [expanded, setExpanded] = useState(false);
  const [srcIndex, setSrcIndex] = useState(0);
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [settings, setSettings] = useState<
    {
      name: string;
      code: string;
      tags: string[];
      details: { label: string; value: string }[];
    }[]
  >([]);

  const candidates = useMemo(() => {
    const base = "/logos";
    const key = (logoKey || name).toLowerCase().replace(/\s+/g, "-");
    const list = [
      `${base}/${key}.svg`,
      `${base}/${key}.png`,
      `${base}/${key}.jpg`,
      `${base}/${key}.jpeg`,
      `${base}/${key}.webp`,
      `${base}/${key}.ico`,
    ];
    return logoUrl ? [logoUrl, ...list] : list;
  }, [logoUrl, logoKey, name]);

  const detailsSchema: DetailField[] = useMemo(() => {
    const key = (logoKey || name).toLowerCase().replace(/\s+/g, "-");
    if (key.includes("binance")) {
      return [
        { key: "apiKey", label: "ApiKey", required: true, exactLength: 32, placeholder: "Insert api key…" },
        { key: "apiSecret", label: "ApiSecret", required: true, exactLength: 64, placeholder: "Insert secret key…" },
        { key: "baseUrl", label: "BaseUrl", required: true, minLength: 20, maxLength: 100, placeholder: "Insert base url…" },
      ];
    }
    if (key.includes("bybit")) {
      return [
        { key: "apiKey", label: "ApiKey", required: true, exactLength: 32, placeholder: "Insert api key…" },
        { key: "apiSecret", label: "ApiSecret", required: true, exactLength: 64, placeholder: "Insert secret key…" },
        { key: "baseUrl", label: "BaseUrl", required: true, minLength: 20, maxLength: 100, placeholder: "Insert base url…" },
      ];
    }
    if (key.includes("kraken")) {
      return [
        { key: "apiKey", label: "ApiKey", required: true, minLength: 50, maxLength: 64, placeholder: "Insert api key…" },
        { key: "apiSecret", label: "ApiSecret", required: true, minLength: 80, maxLength: 96, placeholder: "Insert secret key…" },
        { key: "baseUrl", label: "BaseUrl", required: true, minLength: 20, maxLength: 100, placeholder: "Insert base url…" },
      ];
    }
    if (key.includes("telegram")) {
      return [
        { key: "botToken", label: "BotToken", required: true, minLength: 45, maxLength: 50, placeholder: "Insert bot token…" },
        { key: "baseUrl", label: "BaseUrl", required: false, minLength: 20, maxLength: 100, placeholder: "Insert base url…" },
      ];
    }
    if (key.includes("email")) {
      return [
        { key: "email", label: "EmailAddress", required: true, pattern: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/, placeholder: "user.name@some-domain.com" },
      ];
    }
    if (key.includes("discord-webhooks")) {
      return [
        { key: "webhookUrl", label: "WebhookUrl", required: true, minLength: 80, maxLength: 120, placeholder: "Insert webhook url…" },
        { key: "userName", label: "UserName", required: false, placeholder: "Optional user name…" },
        { key: "avatarUrl", label: "AvatarUrl", required: false, placeholder: "Optional avatar url…" },
      ];
    }
    if (key.includes("slack-webhooks")) {
      return [
        { key: "webhookUrl", label: "WebhookUrl", required: true, minLength: 80, maxLength: 120, placeholder: "Insert webhook url…" },
        { key: "channel", label: "Channel", required: false, placeholder: "Optional channel…" },
        { key: "userName", label: "UserName", required: false, placeholder: "Optional user name…" },
        { key: "iconUrl", label: "IconUrl", required: false, placeholder: "Optional icon url…" },
      ];
    }
    if (key.includes("sms-twilio")) {
      return [
        { key: "accountSid", label: "AccountSID", required: true, exactLength: 34, placeholder: "Insert Account SID…" },
        { key: "authToken", label: "AuthToken", required: true, exactLength: 32, placeholder: "Insert Auth Token…" },
        { key: "fromNumber", label: "FromNumber", required: true, pattern: /^\\+?[0-9]{7,15}$/, placeholder: "Insert from number…" },
        { key: "toNumber", label: "ToNumber", required: true, pattern: /^\\+?[0-9]{7,15}$/, placeholder: "Insert to number…" },
        { key: "message", label: "Message", required: true, placeholder: "Insert message…" },
      ];
    }
    if (key.includes("push-notifications-onesignal")) {
      return [
        { key: "appId", label: "AppId", required: true, exactLength: 36, placeholder: "Insert App ID…" },
        { key: "apiKey", label: "ApiKey", required: true, minLength: 32, maxLength: 50, placeholder: "Insert API key…" },
        { key: "playerIds", label: "PlayerIds", required: true, type: "array" as const, placeholder: "Comma separated player IDs…" },
      ];
    }
    if (key.includes("whatsapp-business")) {
      return [
        { key: "phoneNumberId", label: "PhoneNumberId", required: true, pattern: /^\\+?[0-9]{7,15}$/, placeholder: "Insert phone number…" },
        { key: "accessToken", label: "AccessToken", required: true, minLength: 200, maxLength: 300, placeholder: "Insert access token…" },
        { key: "recipientNumber", label: "RecipientNumber", required: true, pattern: /^\\+?[0-9]{7,15}$/, placeholder: "Insert recipient number…" },
      ];
    }
    if (key.includes("webhooks")) {
      return [
        { key: "webhookUrl", label: "WebhookUrl", required: true, minLength: 80, maxLength: 120, placeholder: "Insert webhook url…" },
      ];
    }
    return [
      { key: "endpoint", label: "Endpoint", required: true, placeholder: "Insert endpoint…" },
      { key: "token", label: "Token", required: false, placeholder: "Insert token…" },
    ];
  }, [logoKey, name]);

  return (
    <div className="border-2 border-border rounded-lg overflow-hidden bg-bg-secondary/50">
      <div className="flex items-center gap-4 px-4 py-3">
        <div className="w-10 h-10 flex items-center justify-center rounded-md bg-background border border-border overflow-hidden">
          {!showPlaceholder ? (
            <img
              src={candidates[srcIndex]}
              alt={`${name} logo`}
              className="w-full h-full object-contain"
              onError={() => {
                const next = srcIndex + 1;
                if (next < candidates.length) {
                  setSrcIndex(next);
                } else {
                  setShowPlaceholder(true);
                }
              }}
            />
          ) : (
            <span className="text-xs text-primary" data-logo-tag={logoTag || `logo-${name.toLowerCase()}`}>Logo</span>
          )}
        </div>

        <div className="flex-1 text-primary text-sm md:text-base">
          {name}
        </div>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="
            ml-auto
            h-8 w-8
            flex items-center justify-center
            rounded-md
            hover:bg-accent-hover/40
            text-accent
            transition
            border border-border
          "
          aria-label={expanded ? "Collapse service group" : "Expand service group"}
        >
          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="px-4 pb-4">
          <div className="flex flex-col gap-3">
            {settings.map((s, i) => (
              <RuleSetting
                key={`${s.code}-${i}`}
                name={s.name}
                code={s.code}
                tags={s.tags}
                details={s.details}
              />
            ))}
            {showForm && (
              <RuleSettingForm
                detailsSchema={detailsSchema}
                onCancel={() => setShowForm(false)}
                onSave={(data) => {
                  setSettings((prev) => [...prev, data]);
                  setShowForm(false);
                }}
              />
            )}
          </div>
          <div className="mt-3">
            <AddRulesSettingsButton onClick={() => setShowForm(true)} />
          </div>
        </div>
      )}
    </div>
  );
}
