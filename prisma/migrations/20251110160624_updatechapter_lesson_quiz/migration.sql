/*
  Warnings:

  - You are about to drop the column `lesson_id` on the `quizzes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[chapter_id]` on the table `quizzes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chapter_id` to the `quizzes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "quizzes" DROP CONSTRAINT "quizzes_lesson_id_fkey";

-- DropIndex
DROP INDEX "quizzes_lesson_id_key";

-- AlterTable
ALTER TABLE "quizzes" DROP COLUMN "lesson_id",
ADD COLUMN     "chapter_id" CHAR(50) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "quizzes_chapter_id_key" ON "quizzes"("chapter_id");

-- AddForeignKey
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("chapter_id") ON DELETE CASCADE ON UPDATE CASCADE;
