/*
  Warnings:

  - Added the required column `level` to the `admin_roles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "admin_roles" ADD COLUMN     "level" INTEGER NOT NULL;
