/*
  Warnings:

  - A unique constraint covering the columns `[wallet_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `wallet_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "wallet_id" CHAR(50) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_wallet_id_key" ON "users"("wallet_id");
