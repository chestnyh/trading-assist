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
ALTER TABLE "public"."User" DROP COLUMN "name",
ADD COLUMN     "emailVerificationCode" TEXT NOT NULL,
ADD COLUMN     "emailVerificationToken" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "preferredTradingPlatforms" "public"."TradingPlatform"[] DEFAULT ARRAY[]::"public"."TradingPlatform"[],
ADD COLUMN     "primaryTradingStrategy" "public"."PrimaryTradingStrategy",
ADD COLUMN     "riskTolerance" "public"."RiskTolerance",
ADD COLUMN     "tradingExperienceLevel" "public"."TradingExperienceLevel";
