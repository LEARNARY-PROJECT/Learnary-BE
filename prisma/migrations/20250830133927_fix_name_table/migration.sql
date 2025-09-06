/*
  Warnings:

  - You are about to drop the column `courseId` on the `feedbacks` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `feedbacks` table. All the data in the column will be lost.
  - Added the required column `course_id` to the `feedbacks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `feedbacks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "feedbacks" DROP CONSTRAINT "feedbacks_courseId_fkey";

-- DropForeignKey
ALTER TABLE "feedbacks" DROP CONSTRAINT "feedbacks_userId_fkey";

-- AlterTable
ALTER TABLE "feedbacks" DROP COLUMN "courseId",
DROP COLUMN "userId",
ADD COLUMN     "course_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("course_id") ON DELETE RESTRICT ON UPDATE CASCADE;
