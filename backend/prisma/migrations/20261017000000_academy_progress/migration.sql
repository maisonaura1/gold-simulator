-- Progreso de la academia (tabla nueva; no modifica datos existentes)
CREATE TABLE IF NOT EXISTS "lesson_progress" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "lesson_id" TEXT NOT NULL,
    "quiz_score" DOUBLE PRECISION,
    "practice_done" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lesson_progress_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "lesson_progress_user_id_lesson_id_key" ON "lesson_progress"("user_id", "lesson_id");
CREATE INDEX IF NOT EXISTS "lesson_progress_user_id_idx" ON "lesson_progress"("user_id");

DO $$ BEGIN
  ALTER TABLE "lesson_progress"
    ADD CONSTRAINT "lesson_progress_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
