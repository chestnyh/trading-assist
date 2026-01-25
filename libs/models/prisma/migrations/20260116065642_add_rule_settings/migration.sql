-- CreateTable
CREATE TABLE "public"."ExternalServices" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ExternalServices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserRuleSettings" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "authorId" INTEGER NOT NULL,
    "externalServiceId" INTEGER NOT NULL,
    "configuration" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "UserRuleSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RuleSettingsTags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "RuleSettingsTags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RuleSettingsToRuleSettingsTags" (
    "ruleSettingId" INTEGER NOT NULL,
    "ruleSettingTagId" INTEGER NOT NULL,

    CONSTRAINT "RuleSettingsToRuleSettingsTags_pkey" PRIMARY KEY ("ruleSettingId","ruleSettingTagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExternalServices_name_key" ON "public"."ExternalServices"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserRuleSettings_authorId_code_key" ON "public"."UserRuleSettings"("authorId", "code");

-- AddForeignKey
ALTER TABLE "public"."UserRuleSettings" ADD CONSTRAINT "UserRuleSettings_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserRuleSettings" ADD CONSTRAINT "UserRuleSettings_externalServiceId_fkey" FOREIGN KEY ("externalServiceId") REFERENCES "public"."ExternalServices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RuleSettingsTags" ADD CONSTRAINT "RuleSettingsTags_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RuleSettingsToRuleSettingsTags" ADD CONSTRAINT "RuleSettingsToRuleSettingsTags_ruleSettingId_fkey" FOREIGN KEY ("ruleSettingId") REFERENCES "public"."UserRuleSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RuleSettingsToRuleSettingsTags" ADD CONSTRAINT "RuleSettingsToRuleSettingsTags_ruleSettingTagId_fkey" FOREIGN KEY ("ruleSettingTagId") REFERENCES "public"."RuleSettingsTags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
