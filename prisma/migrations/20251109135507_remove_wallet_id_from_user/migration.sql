/*
  Warnings:

  - You are about to drop the column `wallet_id` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_wallet_id_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "wallet_id";
