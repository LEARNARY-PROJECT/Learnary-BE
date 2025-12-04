/*
  Warnings:

  - A unique constraint covering the columns `[payment_code]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `payment_code` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_wallet_id_fkey";

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "description" VARCHAR(255),
ADD COLUMN     "payment_code" BIGINT NOT NULL,
ADD COLUMN     "sender_bank" VARCHAR(50),
ADD COLUMN     "sender_name" VARCHAR(100),
ADD COLUMN     "sender_number" VARCHAR(50),
ALTER COLUMN "wallet_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "transactions_payment_code_key" ON "transactions"("payment_code");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("wallet_id") ON DELETE SET NULL ON UPDATE CASCADE;
