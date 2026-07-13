-- AddEnum: SubscriptionStatus
CREATE TYPE "SubscriptionStatus" AS ENUM ('FREE', 'ACTIVE', 'PAST_DUE', 'CANCELLED', 'EXPIRED');

-- AddColumns: subscription fields to users
ALTER TABLE "users"
  ADD COLUMN "stripe_customer_id"    TEXT,
  ADD COLUMN "subscription_id"       TEXT,
  ADD COLUMN "subscription_status"   "SubscriptionStatus" NOT NULL DEFAULT 'FREE',
  ADD COLUMN "subscription_ends_at"  TIMESTAMP(3),
  ADD COLUMN "superwall_user_id"     TEXT;

-- UniqueIndex: one customer per user
CREATE UNIQUE INDEX "users_stripe_customer_id_key"
  ON "users"("stripe_customer_id");
