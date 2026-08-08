-- CreateEnum
CREATE TYPE "ServiceCode" AS ENUM ('binance', 'bybit', 'kraken', 'telegram', 'email', 'discord-webhooks', 'slack-webhooks', 'sms-twilio', 'push-notifications-onesignal', 'whatsapp-business', 'webhooks');

-- AlterTable
ALTER TABLE "UserRuleSettings" ADD COLUMN     "serviceCode" "ServiceCode";
