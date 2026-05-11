/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `RuleSettingsTags` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RuleSettingsTags_name_userId_key" ON "public"."RuleSettingsTags"("name", "userId");
