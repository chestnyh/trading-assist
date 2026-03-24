/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `emailVerificationCode` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emailVerificationToken` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."TradingExperienceLevel" AS ENUM ('Beginner', 'Intermediate', 'Advanced');

-- CreateEnum
CREATE TYPE "public"."PrimaryTradingStrategy" AS ENUM ('Scalping', 'DayTrading', 'SwingTrading', 'PositionTrading', 'Automated');

-- CreateEnum
CREATE TYPE "public"."RiskTolerance" AS ENUM ('Conservative', 'Moderate', 'Aggressive');

-- CreateEnum
CREATE TYPE "public"."TradingPlatform" AS ENUM ('Binance', 'Bybit', 'Kraken', 'Other');

-- AlterTable
-- Drop old name column if it exists
ALTER TABLE "public"."User" DROP COLUMN IF EXISTS "name";

-- Add columns as nullable first (to handle existing data)
ALTER TABLE "public"."User"
ADD COLUMN     "emailVerificationCode" TEXT,
ADD COLUMN     "emailVerificationToken" TEXT,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "isEmailVerified" BOOLEAN DEFAULT false,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "preferredTradingPlatforms" "public"."TradingPlatform"[] DEFAULT ARRAY[]::"public"."TradingPlatform"[],
ADD COLUMN     "primaryTradingStrategy" "public"."PrimaryTradingStrategy",
ADD COLUMN     "riskTolerance" "public"."RiskTolerance",
ADD COLUMN     "tradingExperienceLevel" "public"."TradingExperienceLevel";

-- Fill existing records with default values
UPDATE "public"."User" 
SET 
  "emailVerificationCode" = LPAD(FLOOR(RANDOM() * 1000000)::INTEGER::TEXT, 6, '0'),
  "emailVerificationToken" = gen_random_uuid()::TEXT,
  "firstName" = COALESCE("firstName", ''),
  "lastName" = COALESCE("lastName", ''),
  "isEmailVerified" = COALESCE("isEmailVerified", false)
WHERE 
  "emailVerificationCode" IS NULL 
  OR "emailVerificationToken" IS NULL 
  OR "firstName" IS NULL 
  OR "lastName" IS NULL;

-- Now make columns NOT NULL
ALTER TABLE "public"."User"
ALTER COLUMN "emailVerificationCode" SET NOT NULL,
ALTER COLUMN "emailVerificationToken" SET NOT NULL,
ALTER COLUMN "firstName" SET NOT NULL,
ALTER COLUMN "lastName" SET NOT NULL,
ALTER COLUMN "isEmailVerified" SET NOT NULL,
ALTER COLUMN "isEmailVerified" SET DEFAULT false;
