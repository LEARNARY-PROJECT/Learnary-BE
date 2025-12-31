-- DropForeignKey
ALTER TABLE "instructor_qualifications" DROP CONSTRAINT "instructor_qualifications_specialization_id_fkey";

-- DropIndex
DROP INDEX "instructor_qualifications_user_id_specialization_id_key";

-- AlterTable
ALTER TABLE "instructor_qualifications" ALTER COLUMN "specialization_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "instructor_qualifications" ADD CONSTRAINT "instructor_qualifications_specialization_id_fkey" FOREIGN KEY ("specialization_id") REFERENCES "specializations"("specialization_id") ON DELETE SET NULL ON UPDATE CASCADE;
