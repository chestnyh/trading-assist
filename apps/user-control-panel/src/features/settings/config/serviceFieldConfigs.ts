export type FieldSpec = {
  key: string;
  label: string;
  required: boolean;
  type: "string" | "array";
  minLength?: number;
  maxLength?: number;
  format?: "email" | "url" | "phone";
};

export const SERVICE_FIELDS: Record<string, FieldSpec[]> = {
  binance: [
    { key: "apiKey", label: "Api Key", required: true, type: "string", minLength: 32, maxLength: 32 },
    { key: "apiSecret", label: "Api Secret", required: true, type: "string", minLength: 64, maxLength: 64 },
    { key: "baseUrl", label: "Base Url", required: true, type: "string", minLength: 20, maxLength: 100, format: "url" },
  ],
  bybit: [
    { key: "apiKey", label: "Api Key", required: true, type: "string", minLength: 32, maxLength: 32 },
    { key: "apiSecret", label: "Api Secret", required: true, type: "string", minLength: 64, maxLength: 64 },
    { key: "baseUrl", label: "Base Url", required: true, type: "string", minLength: 20, maxLength: 100, format: "url" },
  ],
  kraken: [
    { key: "apiKey", label: "Api Key", required: true, type: "string", minLength: 56, maxLength: 56 },
    { key: "apiSecret", label: "Api Secret", required: true, type: "string", minLength: 88, maxLength: 88 },
    { key: "baseUrl", label: "Base Url", required: true, type: "string", minLength: 20, maxLength: 100, format: "url" },
  ],
  telegram: [
    { key: "botToken", label: "Bot Token", required: true, type: "string", minLength: 45, maxLength: 50 },
    { key: "baseUrl", label: "Base Url", required: false, type: "string", minLength: 20, maxLength: 100, format: "url" },
  ],
  email: [
    { key: "emailAddress", label: "Email Address", required: true, type: "string", format: "email", minLength: 5, maxLength: 254 },
  ],
  "discord-webhooks": [
    { key: "webhookUrl", label: "Webhook Url", required: true, type: "string", minLength: 80, maxLength: 120, format: "url" },
    { key: "userName", label: "User Name", required: false, type: "string", minLength: 1, maxLength: 100 },
    { key: "avatarUrl", label: "Avatar Url", required: false, type: "string", minLength: 10, maxLength: 300, format: "url" },
  ],
  "slack-webhooks": [
    { key: "webhookUrl", label: "Webhook Url", required: true, type: "string", minLength: 80, maxLength: 120, format: "url" },
    { key: "channel", label: "Channel", required: false, type: "string", minLength: 1, maxLength: 100 },
    { key: "userName", label: "User Name", required: false, type: "string", minLength: 1, maxLength: 100 },
    { key: "iconUrl", label: "Icon Url", required: false, type: "string", minLength: 10, maxLength: 300, format: "url" },
  ],
  "sms-twilio": [
    { key: "accountSID", label: "Account SID", required: true, type: "string", minLength: 34, maxLength: 34 },
    { key: "authToken", label: "Auth Token", required: true, type: "string", minLength: 32, maxLength: 32 },
    { key: "fromNumber", label: "From Number", required: true, type: "string", format: "phone", minLength: 10, maxLength: 20 },
    { key: "toNumber", label: "To Number", required: true, type: "string", format: "phone", minLength: 10, maxLength: 20 },
    { key: "message", label: "Message", required: true, type: "string", minLength: 1, maxLength: 500 },
  ],
  "push-notifications-onesignal": [
    { key: "appId", label: "App Id", required: true, type: "string", minLength: 36, maxLength: 36 },
    { key: "apiKey", label: "Api Key", required: true, type: "string", minLength: 32, maxLength: 50 },
    { key: "playerIds", label: "Player Ids", required: true, type: "array" },
  ],
  "whatsapp-business-api": [
    { key: "phoneNumberId", label: "Phone Number Id", required: true, type: "string", format: "phone", minLength: 10, maxLength: 30 },
    { key: "accessToken", label: "Access Token", required: true, type: "string", minLength: 200, maxLength: 300 },
    { key: "recipientNumber", label: "Recipient Number", required: true, type: "string", format: "phone", minLength: 10, maxLength: 30 },
  ],
  webhooks: [
    { key: "webhookUrl", label: "Webhook Url", required: true, type: "string", minLength: 80, maxLength: 120, format: "url" },
  ],
};

