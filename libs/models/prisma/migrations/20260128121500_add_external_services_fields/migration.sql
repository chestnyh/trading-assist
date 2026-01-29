-- Add new columns to ExternalServices
ALTER TABLE "public"."ExternalServices" ADD COLUMN "logoUrl" TEXT;
ALTER TABLE "public"."ExternalServices" ADD COLUMN "fieldsSchema" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "public"."ExternalServices" ADD COLUMN "code" TEXT;

-- Backfill codes for existing rows to satisfy NOT NULL constraint.
-- Using 'name' ensures uniqueness since 'name' is unique.
-- This serves as a temporary value for existing data; seeds will update known services to correct codes.
UPDATE "public"."ExternalServices" SET "code" = "name" WHERE "code" IS NULL;

-- Ensure 'code' is not nullable now that values are populated
ALTER TABLE "public"."ExternalServices" ALTER COLUMN "code" SET NOT NULL;

-- Add unique constraint on 'code'
CREATE UNIQUE INDEX "ExternalServices_code_key" ON "public"."ExternalServices"("code");
