/*
  Warnings:

  - The values [Published] on the enum `CourseStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `quiz_id` on the `chapters` table. All the data in the column will be lost.
  - You are about to drop the column `course_id` on the `levels` table. All the data in the column will be lost.
  - You are about to drop the column `instructor_id` on the `specializations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[submission_id,question_id]` on the table `answers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[course_id,user_id]` on the table `feedbacks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[quiz_id,user_id]` on the table `submissions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CourseStatus_new" AS ENUM ('Draft', 'Published', 'Pending', 'Archived');
ALTER TABLE "courses" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "courses" ALTER COLUMN "status" TYPE "CourseStatus_new" USING ("status"::text::"CourseStatus_new");
ALTER TYPE "CourseStatus" RENAME TO "CourseStatus_old";
ALTER TYPE "CourseStatus_new" RENAME TO "CourseStatus";
DROP TYPE "CourseStatus_old";
ALTER TABLE "courses" ALTER COLUMN "status" SET DEFAULT 'Draft';
COMMIT;

-- DropIndex
DROP INDEX "answers_question_id_key";

-- DropIndex
DROP INDEX "answers_submission_id_key";

-- DropIndex
DROP INDEX "chapters_course_id_key";

-- DropIndex
DROP INDEX "chapters_quiz_id_key";

-- DropIndex
DROP INDEX "courses_category_id_key";

-- DropIndex
DROP INDEX "courses_instructor_id_key";

-- DropIndex
DROP INDEX "courses_level_id_key";

-- DropIndex
DROP INDEX "feedbacks_course_id_key";

-- DropIndex
DROP INDEX "feedbacks_user_id_key";

-- DropIndex
DROP INDEX "instructor_specializations_admin_id_key";

-- DropIndex
DROP INDEX "instructor_specializations_specialization_id_key";

-- DropIndex
DROP INDEX "lessons_chapter_id_key";

-- DropIndex
DROP INDEX "lessons_video_url_key";

-- DropIndex
DROP INDEX "levels_course_id_key";

-- DropIndex
DROP INDEX "notes_lesson_id_key";

-- DropIndex
DROP INDEX "notes_user_id_key";

-- DropIndex
DROP INDEX "options_question_id_key";

-- DropIndex
DROP INDEX "questions_quiz_id_key";

-- DropIndex
DROP INDEX "specializations_instructor_id_key";

-- DropIndex
DROP INDEX "submissions_quiz_id_key";

-- DropIndex
DROP INDEX "submissions_user_id_key";

-- AlterTable
ALTER TABLE "chapters" DROP COLUMN "quiz_id";

-- AlterTable
ALTER TABLE "levels" DROP COLUMN "course_id";

-- AlterTable
ALTER TABLE "specializations" DROP COLUMN "instructor_id";

-- CreateIndex
CREATE UNIQUE INDEX "answers_submission_id_question_id_key" ON "answers"("submission_id", "question_id");

-- CreateIndex
CREATE UNIQUE INDEX "feedbacks_course_id_user_id_key" ON "feedbacks"("course_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "submissions_quiz_id_user_id_key" ON "submissions"("quiz_id", "user_id");
