/*
  Warnings:

  - You are about to drop the column `lecturerId` on the `courses` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_lecturerId_fkey";

-- AlterTable
ALTER TABLE "courses" DROP COLUMN "lecturerId";
