-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('Active', 'Locked', 'Freezed');

-- AlterTable
ALTER TABLE "account_securities" ADD COLUMN     "status" "AccountStatus" NOT NULL DEFAULT 'Active';
