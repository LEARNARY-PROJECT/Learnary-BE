-- AlterTable
ALTER TABLE "lesson_progress" ADD COLUMN     "last_watch_time" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "max_watch_time" DOUBLE PRECISION NOT NULL DEFAULT 0;
