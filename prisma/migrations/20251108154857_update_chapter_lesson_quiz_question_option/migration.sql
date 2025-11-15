/*
  Warnings:

  - You are about to drop the column `chapter_id` on the `quizzes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[lesson_id]` on the table `quizzes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lesson_id` to the `quizzes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "quizzes" DROP CONSTRAINT "quizzes_chapter_id_fkey";

-- DropIndex
DROP INDEX "idx_question_id";

-- DropIndex
DROP INDEX "quizzes_chapter_id_key";

-- AlterTable
ALTER TABLE "quizzes" DROP COLUMN "chapter_id",
ADD COLUMN     "lesson_id" CHAR(50) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "quizzes_lesson_id_key" ON "quizzes"("lesson_id");

-- AddForeignKey
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("lesson_id") ON DELETE CASCADE ON UPDATE CASCADE;
