/*
  Warnings:

  - You are about to drop the column `is_verified` on the `categories` table. All the data in the column will be lost.
  - You are about to alter the column `requirement` on the `courses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `description` on the `courses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to drop the column `is_completed` on the `quizzes` table. All the data in the column will be lost.
  - You are about to drop the `chapter_progress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lesson_progress` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[course_id]` on the table `feedbacks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `feedbacks` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "chapter_progress" DROP CONSTRAINT "chapter_progress_chapter_id_fkey";

-- DropForeignKey
ALTER TABLE "chapter_progress" DROP CONSTRAINT "chapter_progress_user_id_fkey";

-- DropForeignKey
ALTER TABLE "lesson_progress" DROP CONSTRAINT "lesson_progress_lesson_id_fkey";

-- DropForeignKey
ALTER TABLE "lesson_progress" DROP CONSTRAINT "lesson_progress_user_id_fkey";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "is_verified";

-- AlterTable
ALTER TABLE "courses" ALTER COLUMN "requirement" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "lessons" ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "quizzes" DROP COLUMN "is_completed";

-- DropTable
DROP TABLE "chapter_progress";

-- DropTable
DROP TABLE "lesson_progress";

-- CreateIndex
CREATE UNIQUE INDEX "feedbacks_course_id_key" ON "feedbacks"("course_id");

-- CreateIndex
CREATE UNIQUE INDEX "feedbacks_user_id_key" ON "feedbacks"("user_id");
