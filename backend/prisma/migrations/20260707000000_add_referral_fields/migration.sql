-- AddReferralFields
ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "referral_code"  TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "referred_by"    TEXT,
  ADD COLUMN IF NOT EXISTS "referral_bonus" INTEGER NOT NULL DEFAULT 0;

-- Backfill unique referral codes for existing users (6-char uppercase alphanumeric)
UPDATE "users"
SET "referral_code" = UPPER(SUBSTRING(MD5(id::text || RANDOM()::text), 1, 6))
WHERE "referral_code" = '';

-- Add unique constraint
ALTER TABLE "users"
  ADD CONSTRAINT "users_referral_code_key" UNIQUE ("referral_code");
