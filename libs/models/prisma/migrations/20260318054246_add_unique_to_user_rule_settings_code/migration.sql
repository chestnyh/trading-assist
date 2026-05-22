/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `UserRuleSettings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserRuleSettings_code_key" ON "public"."UserRuleSettings"("code");
