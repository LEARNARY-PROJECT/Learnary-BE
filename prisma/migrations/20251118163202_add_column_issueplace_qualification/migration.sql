/*
  Warnings:

  - A unique constraint covering the columns `[user_id,specialization_id]` on the table `instructor_qualifications` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "instructor_qualifications" DROP CONSTRAINT "instructor_qualifications_instructor_id_fkey";

-- DropIndex
DROP INDEX "instructor_qualifications_instructor_id_key";

-- DropIndex
DROP INDEX "instructor_qualifications_instructor_id_specialization_id_key";

-- DropIndex
DROP INDEX "instructor_qualifications_specialization_id_key";

-- AlterTable
ALTER TABLE "instructor_qualifications" ADD COLUMN     "issue_place" VARCHAR(255),
ALTER COLUMN "instructor_id" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "idx_iq_user" ON "instructor_qualifications"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "instructor_qualifications_user_id_specialization_id_key" ON "instructor_qualifications"("user_id", "specialization_id");

-- AddForeignKey
ALTER TABLE "instructor_qualifications" ADD CONSTRAINT "instructor_qualifications_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "instructors"("instructor_id") ON DELETE SET NULL ON UPDATE CASCADE;
