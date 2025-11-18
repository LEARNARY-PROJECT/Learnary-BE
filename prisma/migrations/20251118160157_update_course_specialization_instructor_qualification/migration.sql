/*
  Warnings:

  - A unique constraint covering the columns `[course_id]` on the table `feedbacks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `feedbacks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[instructor_id]` on the table `specializations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `instructor_qualifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `specializations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "instructor_qualifications" ADD COLUMN     "user_id" CHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "specializations" ADD COLUMN     "instructor_id" CHAR(50),
ADD COLUMN     "user_id" CHAR(50) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "feedbacks_course_id_key" ON "feedbacks"("course_id");

-- CreateIndex
CREATE UNIQUE INDEX "feedbacks_user_id_key" ON "feedbacks"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "specializations_instructor_id_key" ON "specializations"("instructor_id");

-- AddForeignKey
ALTER TABLE "specializations" ADD CONSTRAINT "specializations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instructor_qualifications" ADD CONSTRAINT "instructor_qualifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
