/*
  Warnings:

  - Made the column `xp_reward` on table `missions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_daily` on table `missions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `initial_balance` on table `sim_accounts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `current_balance` on table `sim_accounts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `equity` on table `sim_accounts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `level` on table `sim_accounts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `xp` on table `sim_accounts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `sim_accounts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `sim_accounts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `date` on table `stats_snapshots` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `trades` required. This step will fail if there are existing NULL values in that column.
  - Made the column `entry_at` on table `trades` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `user_missions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `current_progress` on table `user_missions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `assigned_at` on table `user_missions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "sim_accounts" DROP CONSTRAINT "sim_accounts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "stats_snapshots" DROP CONSTRAINT "stats_snapshots_user_id_fkey";

-- DropForeignKey
ALTER TABLE "trades" DROP CONSTRAINT "trades_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_missions" DROP CONSTRAINT "user_missions_mission_id_fkey";

-- DropForeignKey
ALTER TABLE "user_missions" DROP CONSTRAINT "user_missions_user_id_fkey";

-- AlterTable
ALTER TABLE "missions" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "xp_reward" SET NOT NULL,
ALTER COLUMN "is_daily" SET NOT NULL;

-- AlterTable
ALTER TABLE "sim_accounts" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "initial_balance" SET NOT NULL,
ALTER COLUMN "current_balance" SET NOT NULL,
ALTER COLUMN "equity" SET NOT NULL,
ALTER COLUMN "level" SET NOT NULL,
ALTER COLUMN "xp" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "stats_snapshots" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "date" SET NOT NULL,
ALTER COLUMN "date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "trades" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "entry_at" SET NOT NULL,
ALTER COLUMN "entry_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "exit_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "user_missions" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "current_progress" SET NOT NULL,
ALTER COLUMN "assigned_at" SET NOT NULL,
ALTER COLUMN "assigned_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "completed_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "sim_accounts" ADD CONSTRAINT "sim_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trades" ADD CONSTRAINT "trades_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_missions" ADD CONSTRAINT "user_missions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_missions" ADD CONSTRAINT "user_missions_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "missions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stats_snapshots" ADD CONSTRAINT "stats_snapshots_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
