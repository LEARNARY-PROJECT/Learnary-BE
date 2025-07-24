/*
  Warnings:

  - The values [STUDENT] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `instructorId` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lecturerId` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('LEARNER', 'INSTRUCTOR', 'ADMIN');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'LEARNER';
COMMIT;

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_instructorId_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "instructorId",
ADD COLUMN     "lecturerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "gender" TEXT NOT NULL DEFAULT 'OTHER',
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "last_login" TIMESTAMP(3),
ADD COLUMN     "nation" TEXT,
ADD COLUMN     "phone" TEXT,
ALTER COLUMN "role" SET DEFAULT 'LEARNER';

-- CreateTable
CREATE TABLE "Learner" (
    "learner_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Learner_pkey" PRIMARY KEY ("learner_id")
);

-- CreateTable
CREATE TABLE "Instructor" (
    "instructor_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "bio" TEXT,
    "expertise" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Instructor_pkey" PRIMARY KEY ("instructor_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Learner_user_id_key" ON "Learner"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Instructor_user_id_key" ON "Instructor"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "Learner" ADD CONSTRAINT "Learner_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Instructor" ADD CONSTRAINT "Instructor_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_lecturerId_fkey" FOREIGN KEY ("lecturerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
