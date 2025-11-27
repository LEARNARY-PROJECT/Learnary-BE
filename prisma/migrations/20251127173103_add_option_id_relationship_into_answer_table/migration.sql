/*
  Warnings:

  - You are about to drop the column `selected_option_id` on the `answers` table. All the data in the column will be lost.
  - Added the required column `option_id` to the `answers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "answers" DROP COLUMN "selected_option_id",
ADD COLUMN     "option_id" CHAR(50) NOT NULL;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "options"("option_id") ON DELETE RESTRICT ON UPDATE CASCADE;
