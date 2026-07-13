-- Add legacy one-time payment fields to users table
ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "paid_at"          TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "stripe_session_id" TEXT;
