/*
  Warnings:

  - A unique constraint covering the columns `[level_id]` on the table `courses` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "courses" ALTER COLUMN "slug" DROP NOT NULL;

-- CreateTable
CREATE TABLE "levels" (
    "level_id" VARCHAR(50) NOT NULL,
    "level_name" VARCHAR(255) NOT NULL,
    "course_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "levels_pkey" PRIMARY KEY ("level_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "levels_course_id_key" ON "levels"("course_id");

-- CreateIndex
CREATE UNIQUE INDEX "courses_level_id_key" ON "courses"("level_id");

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "levels"("level_id") ON DELETE RESTRICT ON UPDATE CASCADE;
