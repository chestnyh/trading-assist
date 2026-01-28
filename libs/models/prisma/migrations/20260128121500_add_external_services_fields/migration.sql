-- Add new columns to ExternalServices
ALTER TABLE "public"."ExternalServices" ADD COLUMN "logoUrl" TEXT;
ALTER TABLE "public"."ExternalServices" ADD COLUMN "fieldsSchema" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "public"."ExternalServices" ADD COLUMN "code" TEXT;

-- Backfill codes for existing rows based on current names
UPDATE "public"."ExternalServices" SET "code" = 'bybit' WHERE "name" = 'Bybit';
UPDATE "public"."ExternalServices" SET "code" = 'push-notifications-onesignal' WHERE "name" = 'Push Notifications (One Signal)';
UPDATE "public"."ExternalServices" SET "code" = 'binance' WHERE "name" = 'Binance';
UPDATE "public"."ExternalServices" SET "code" = 'telegram' WHERE "name" = 'Telegram';
UPDATE "public"."ExternalServices" SET "code" = 'sms-twilio' WHERE "name" = 'SMS (Twilio)';
UPDATE "public"."ExternalServices" SET "code" = 'webhooks' WHERE "name" = 'Webhooks';
UPDATE "public"."ExternalServices" SET "code" = 'discord-webhooks' WHERE "name" = 'Discord Webhooks';
UPDATE "public"."ExternalServices" SET "code" = 'kraken' WHERE "name" = 'Kraken';
UPDATE "public"."ExternalServices" SET "code" = 'slack-webhooks' WHERE "name" = 'Slack Webhooks';
UPDATE "public"."ExternalServices" SET "code" = 'whatsapp-business' WHERE "name" = 'WhatsApp Business API';
UPDATE "public"."ExternalServices" SET "code" = 'email' WHERE "name" = 'Email';

-- Ensure 'code' is not nullable now that values are populated
ALTER TABLE "public"."ExternalServices" ALTER COLUMN "code" SET NOT NULL;

-- Add unique constraint on 'code'
CREATE UNIQUE INDEX "ExternalServices_code_key" ON "public"."ExternalServices"("code");
