/*
  Warnings:

  - A unique constraint covering the columns `[video_url]` on the table `lessons` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `video_url` to the `lessons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "lessons" ADD COLUMN     "video_url" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "lessons_video_url_key" ON "lessons"("video_url");
