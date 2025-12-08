/*
  Warnings:

  - The primary key for the `ChapterProgress` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ChapterProgress` table. All the data in the column will be lost.
  - The primary key for the `LessonProgress` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `LessonProgress` table. All the data in the column will be lost.
  - You are about to drop the column `is_completed` on the `chapters` table. All the data in the column will be lost.
  - You are about to drop the column `isCompleted` on the `lessons` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ChapterProgress" DROP CONSTRAINT "ChapterProgress_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "ChapterProgress_pkey" PRIMARY KEY ("user_id", "chapter_id");

-- AlterTable
ALTER TABLE "LessonProgress" DROP CONSTRAINT "LessonProgress_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "LessonProgress_pkey" PRIMARY KEY ("user_id", "lesson_id");

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "chapters" DROP COLUMN "is_completed";

-- AlterTable
ALTER TABLE "lessons" DROP COLUMN "isCompleted";
