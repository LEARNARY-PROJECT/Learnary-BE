/*
  Warnings:

  - You are about to alter the column `sale_off` on the `courses` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - Made the column `sale_off` on table `courses` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "courses" ALTER COLUMN "sale_off" SET NOT NULL,
ALTER COLUMN "sale_off" DROP DEFAULT,
ALTER COLUMN "sale_off" SET DATA TYPE DECIMAL(10,2);
