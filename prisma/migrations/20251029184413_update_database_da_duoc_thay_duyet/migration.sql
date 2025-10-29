/*
  Warnings:

  - The primary key for the `account_securities` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `user_id` on the `account_securities` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(50)`.
  - The primary key for the `admin_role_permissions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `permission_id` on the `admin_role_permissions` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(50)`.
  - You are about to alter the column `admin_role_id` on the `admin_role_permissions` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(50)`.
  - The primary key for the `admin_roles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `role_name` on the `admin_roles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - The primary key for the `admins` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `user_id` on the `admins` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(50)`.
  - You are about to alter the column `admin_role_id` on the `admins` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(50)`.
  - The primary key for the `categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `chapters` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `citizen_ids_confirms` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `instructor_id` on the `citizen_ids_confirms` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(50)`.
  - The primary key for the `courses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `feedbacks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `comment` on the `feedbacks` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `course_id` on the `feedbacks` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(50)`.
  - You are about to alter the column `user_id` on the `feedbacks` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(50)`.
  - The primary key for the `instructor_specializations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `instructor_id` on the `instructor_specializations` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(50)`.
  - You are about to alter the column `specialization_id` on the `instructor_specializations` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(50)`.
  - You are about to alter the column `admin_id` on the `instructor_specializations` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(50)`.
  - The primary key for the `instructors` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `user_id` on the `instructors` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(50)`.
  - The primary key for the `learner_courses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `learner_course_id` on the `learner_courses` table. All the data in the column will be lost.
  - You are about to alter the column `learner_id` on the `learner_courses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(50)`.
  - You are about to alter the column `course_id` on the `learner_courses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(50)`.
  - The primary key for the `learners` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `user_id` on the `learners` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(50)`.
  - The primary key for the `lessons` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `lesson_id` on the `lessons` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(50)`.
  - You are about to alter the column `chapter_id` on the `lessons` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(50)`.
  - You are about to alter the column `video_url` on the `lessons` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - The primary key for the `levels` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `course_id` on the `levels` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(50)`.
  - You are about to alter the column `lesson_id` on the `notes` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(50)`.
  - You are about to alter the column `user_id` on the `notes` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(50)`.
  - The primary key for the `permissions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `permission_name` on the `permissions` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `description` on the `permissions` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - The primary key for the `specializations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `instructor_id` on the `specializations` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(50)`.
  - You are about to alter the column `specialization_name` on the `specializations` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(50)`.
  - You are about to alter the column `phone` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(50)`.
  - You are about to alter the column `avatar` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `address` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `city` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `country` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `nation` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `bio` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `fullName` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to drop the column `instructor_id` on the `wallets` table. All the data in the column will be lost.
  - You are about to drop the `instructor_course_transactions` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[admin_role_id]` on the table `admin_role_permissions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[role_name]` on the table `admin_roles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[admin_role_id]` on the table `admins` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[category_name]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[course_id]` on the table `chapters` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[quiz_id]` on the table `chapters` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[category_id]` on the table `courses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[instructor_id]` on the table `courses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[course_id]` on the table `feedbacks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `feedbacks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[instructor_id]` on the table `instructor_qualifications` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[specialization_id]` on the table `instructor_qualifications` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[learner_id,course_id]` on the table `learner_courses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[level_name]` on the table `levels` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `notes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[lesson_id]` on the table `notes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[permission_name]` on the table `permissions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[specialization_name]` on the table `specializations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `wallets` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `quiz_id` to the `chapters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `completedAt` to the `learner_courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `lessons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `wallets` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('Withdraw', 'Deposit', 'Pay');

-- CreateEnum
CREATE TYPE "TransactionMethod" AS ENUM ('Credit_Card', 'Voucher', 'Bank_Transfer', 'PayPal');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('Pending', 'Success', 'Failed', 'Refunded');

-- CreateEnum
CREATE TYPE "TransactionNote" AS ENUM ('User_Pay', 'Pay_For_Instructor');

-- DropForeignKey
ALTER TABLE "account_securities" DROP CONSTRAINT "account_securities_user_id_fkey";

-- DropForeignKey
ALTER TABLE "admin_role_permissions" DROP CONSTRAINT "admin_role_permissions_admin_role_id_fkey";

-- DropForeignKey
ALTER TABLE "admin_role_permissions" DROP CONSTRAINT "admin_role_permissions_permission_id_fkey";

-- DropForeignKey
ALTER TABLE "admins" DROP CONSTRAINT "admins_admin_role_id_fkey";

-- DropForeignKey
ALTER TABLE "admins" DROP CONSTRAINT "admins_user_id_fkey";

-- DropForeignKey
ALTER TABLE "chapters" DROP CONSTRAINT "chapters_course_id_fkey";

-- DropForeignKey
ALTER TABLE "citizen_ids_confirms" DROP CONSTRAINT "citizen_ids_confirms_instructor_id_fkey";

-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_category_id_fkey";

-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_instructor_id_fkey";

-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_level_id_fkey";

-- DropForeignKey
ALTER TABLE "feedbacks" DROP CONSTRAINT "feedbacks_course_id_fkey";

-- DropForeignKey
ALTER TABLE "feedbacks" DROP CONSTRAINT "feedbacks_user_id_fkey";

-- DropForeignKey
ALTER TABLE "instructor_course_transactions" DROP CONSTRAINT "instructor_course_transactions_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "instructor_qualifications" DROP CONSTRAINT "instructor_qualifications_instructor_id_fkey";

-- DropForeignKey
ALTER TABLE "instructor_qualifications" DROP CONSTRAINT "instructor_qualifications_specialization_id_fkey";

-- DropForeignKey
ALTER TABLE "instructor_specializations" DROP CONSTRAINT "instructor_specializations_admin_id_fkey";

-- DropForeignKey
ALTER TABLE "instructor_specializations" DROP CONSTRAINT "instructor_specializations_instructor_id_fkey";

-- DropForeignKey
ALTER TABLE "instructor_specializations" DROP CONSTRAINT "instructor_specializations_specialization_id_fkey";

-- DropForeignKey
ALTER TABLE "instructors" DROP CONSTRAINT "instructors_user_id_fkey";

-- DropForeignKey
ALTER TABLE "learner_courses" DROP CONSTRAINT "learner_courses_course_id_fkey";

-- DropForeignKey
ALTER TABLE "learner_courses" DROP CONSTRAINT "learner_courses_learner_id_fkey";

-- DropForeignKey
ALTER TABLE "learners" DROP CONSTRAINT "learners_user_id_fkey";

-- DropForeignKey
ALTER TABLE "lessons" DROP CONSTRAINT "lessons_chapter_id_fkey";

-- DropForeignKey
ALTER TABLE "notes" DROP CONSTRAINT "notes_lesson_id_fkey";

-- DropForeignKey
ALTER TABLE "wallets" DROP CONSTRAINT "wallets_instructor_id_fkey";

-- DropIndex
DROP INDEX "wallets_instructor_id_key";

-- AlterTable
ALTER TABLE "account_securities" DROP CONSTRAINT "account_securities_pkey",
ALTER COLUMN "account_security_id" SET DATA TYPE CHAR(50),
ALTER COLUMN "user_id" SET DATA TYPE CHAR(50),
ADD CONSTRAINT "account_securities_pkey" PRIMARY KEY ("account_security_id");

-- AlterTable
ALTER TABLE "admin_role_permissions" DROP CONSTRAINT "admin_role_permissions_pkey",
ALTER COLUMN "permission_id" SET DATA TYPE CHAR(50),
ALTER COLUMN "admin_role_id" SET DATA TYPE CHAR(50),
ADD CONSTRAINT "admin_role_permissions_pkey" PRIMARY KEY ("permission_id", "admin_role_id");

-- AlterTable
ALTER TABLE "admin_roles" DROP CONSTRAINT "admin_roles_pkey",
ALTER COLUMN "admin_role_id" SET DATA TYPE CHAR(50),
ALTER COLUMN "role_name" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "admin_roles_pkey" PRIMARY KEY ("admin_role_id");

-- AlterTable
ALTER TABLE "admins" DROP CONSTRAINT "admins_pkey",
ALTER COLUMN "admin_id" SET DATA TYPE CHAR(50),
ALTER COLUMN "user_id" SET DATA TYPE CHAR(50),
ALTER COLUMN "admin_role_id" SET DATA TYPE CHAR(50),
ADD CONSTRAINT "admins_pkey" PRIMARY KEY ("admin_id");

-- AlterTable
ALTER TABLE "categories" DROP CONSTRAINT "categories_pkey",
ALTER COLUMN "category_id" SET DATA TYPE CHAR(50),
ALTER COLUMN "slug" DROP NOT NULL,
ALTER COLUMN "slug" SET DATA TYPE CHAR(255),
ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("category_id");

-- AlterTable
ALTER TABLE "chapters" DROP CONSTRAINT "chapters_pkey",
ADD COLUMN     "order_index" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "quiz_id" CHAR(50) NOT NULL,
ALTER COLUMN "chapter_id" SET DATA TYPE CHAR(50),
ALTER COLUMN "course_id" SET DATA TYPE CHAR(50),
ADD CONSTRAINT "chapters_pkey" PRIMARY KEY ("chapter_id");

-- AlterTable
ALTER TABLE "citizen_ids_confirms" DROP CONSTRAINT "citizen_ids_confirms_pkey",
ALTER COLUMN "citizen_id" SET DATA TYPE CHAR(50),
ALTER COLUMN "instructor_id" SET DATA TYPE CHAR(50),
ADD CONSTRAINT "citizen_ids_confirms_pkey" PRIMARY KEY ("citizen_id");

-- AlterTable
ALTER TABLE "courses" DROP CONSTRAINT "courses_pkey",
ALTER COLUMN "course_id" SET DATA TYPE CHAR(50),
ALTER COLUMN "category_id" SET DATA TYPE CHAR(50),
ALTER COLUMN "level_id" SET DATA TYPE CHAR(50),
ALTER COLUMN "instructor_id" SET DATA TYPE CHAR(50),
ADD CONSTRAINT "courses_pkey" PRIMARY KEY ("course_id");

-- AlterTable
ALTER TABLE "feedbacks" DROP CONSTRAINT "feedbacks_pkey",
ALTER COLUMN "id" SET DATA TYPE CHAR(50),
ALTER COLUMN "comment" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "course_id" SET DATA TYPE CHAR(50),
ALTER COLUMN "user_id" SET DATA TYPE CHAR(50),
ADD CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "instructor_qualifications" ALTER COLUMN "instructor_id" SET DATA TYPE CHAR(50),
ALTER COLUMN "specialization_id" SET DATA TYPE CHAR(50);

-- AlterTable
ALTER TABLE "instructor_specializations" DROP CONSTRAINT "instructor_specializations_pkey",
ALTER COLUMN "instructor_specialization_id" SET DATA TYPE CHAR(50),
ALTER COLUMN "instructor_id" SET DATA TYPE CHAR(50),
ALTER COLUMN "specialization_id" SET DATA TYPE CHAR(50),
ALTER COLUMN "admin_id" SET DATA TYPE CHAR(50),
ADD CONSTRAINT "instructor_specializations_pkey" PRIMARY KEY ("instructor_specialization_id");

-- AlterTable
ALTER TABLE "instructors" DROP CONSTRAINT "instructors_pkey",
ALTER COLUMN "instructor_id" SET DATA TYPE CHAR(50),
ALTER COLUMN "user_id" SET DATA TYPE CHAR(50),
ADD CONSTRAINT "instructors_pkey" PRIMARY KEY ("instructor_id");

-- AlterTable
ALTER TABLE "learner_courses" DROP CONSTRAINT "learner_courses_pkey",
DROP COLUMN "learner_course_id",
ADD COLUMN     "completedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "learner_id" SET DATA TYPE CHAR(50),
ALTER COLUMN "course_id" SET DATA TYPE CHAR(50),
ADD CONSTRAINT "learner_courses_pkey" PRIMARY KEY ("learner_id", "course_id");

-- AlterTable
ALTER TABLE "learners" DROP CONSTRAINT "learners_pkey",
ALTER COLUMN "learner_id" SET DATA TYPE CHAR(50),
ALTER COLUMN "user_id" SET DATA TYPE CHAR(50),
ADD CONSTRAINT "learners_pkey" PRIMARY KEY ("learner_id");

-- AlterTable
ALTER TABLE "lessons" DROP CONSTRAINT "lessons_pkey",
ADD COLUMN     "order_index" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "slug" CHAR(50) NOT NULL,
ALTER COLUMN "lesson_id" SET DATA TYPE CHAR(50),
ALTER COLUMN "chapter_id" SET DATA TYPE CHAR(50),
ALTER COLUMN "video_url" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "lessons_pkey" PRIMARY KEY ("lesson_id");

-- AlterTable
ALTER TABLE "levels" DROP CONSTRAINT "levels_pkey",
ADD COLUMN     "order_index" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "level_id" SET DATA TYPE CHAR(50),
ALTER COLUMN "course_id" SET DATA TYPE CHAR(50),
ADD CONSTRAINT "levels_pkey" PRIMARY KEY ("level_id");

-- AlterTable
ALTER TABLE "notes" ALTER COLUMN "lesson_id" SET DATA TYPE CHAR(50),
ALTER COLUMN "user_id" SET DATA TYPE CHAR(50);

-- AlterTable
ALTER TABLE "permissions" DROP CONSTRAINT "permissions_pkey",
ALTER COLUMN "permission_id" SET DATA TYPE CHAR(50),
ALTER COLUMN "permission_name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "permissions_pkey" PRIMARY KEY ("permission_id");

-- AlterTable
ALTER TABLE "specializations" DROP CONSTRAINT "specializations_pkey",
ALTER COLUMN "specialization_id" SET DATA TYPE CHAR(50),
ALTER COLUMN "instructor_id" SET DATA TYPE CHAR(50),
ALTER COLUMN "specialization_name" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "specializations_pkey" PRIMARY KEY ("specialization_id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ALTER COLUMN "user_id" SET DATA TYPE CHAR(50),
ALTER COLUMN "email" SET DATA TYPE CHAR(50),
ALTER COLUMN "phone" SET DATA TYPE CHAR(50),
ALTER COLUMN "avatar" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "address" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "city" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "country" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "nation" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "bio" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "fullName" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("user_id");

-- AlterTable
ALTER TABLE "wallets" DROP COLUMN "instructor_id",
ADD COLUMN     "user_id" CHAR(50) NOT NULL;

-- DropTable
DROP TABLE "instructor_course_transactions";

-- CreateTable
CREATE TABLE "transactions" (
    "transaction_id" CHAR(50) NOT NULL,
    "course_id" CHAR(50) NOT NULL,
    "user_id" CHAR(50) NOT NULL,
    "wallet_id" CHAR(50) NOT NULL,
    "transaction_type" "TransactionType" NOT NULL,
    "commission_rate" DECIMAL(5,2),
    "payment_method" "TransactionMethod" NOT NULL,
    "amount" DECIMAL(10,2),
    "currency" VARCHAR(10) NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'Pending',
    "note" "TransactionNote" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateTable
CREATE TABLE "quizzes" (
    "quiz_id" CHAR(50) NOT NULL,
    "chapter_id" CHAR(50) NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "slug" CHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quizzes_pkey" PRIMARY KEY ("quiz_id")
);

-- CreateTable
CREATE TABLE "questions" (
    "question_id" CHAR(50) NOT NULL,
    "quiz_id" CHAR(50) NOT NULL,
    "title" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("question_id")
);

-- CreateTable
CREATE TABLE "options" (
    "option_id" CHAR(50) NOT NULL,
    "question_id" CHAR(50) NOT NULL,
    "option_content" VARCHAR(255) NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "options_pkey" PRIMARY KEY ("option_id")
);

-- CreateTable
CREATE TABLE "answers" (
    "answer_id" CHAR(50) NOT NULL,
    "submission_id" CHAR(50) NOT NULL,
    "question_id" CHAR(50) NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "selected_option_id" CHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("answer_id")
);

-- CreateTable
CREATE TABLE "submissions" (
    "submission_id" CHAR(50) NOT NULL,
    "quiz_id" CHAR(50) NOT NULL,
    "user_id" CHAR(50) NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "duration" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("submission_id")
);

-- CreateIndex
CREATE INDEX "idx_trans_user" ON "transactions"("user_id");

-- CreateIndex
CREATE INDEX "idx_trans_wallet" ON "transactions"("wallet_id");

-- CreateIndex
CREATE INDEX "idx_trans_course" ON "transactions"("course_id");

-- CreateIndex
CREATE INDEX "idx_trans_status" ON "transactions"("status");

-- CreateIndex
CREATE INDEX "idx_trans_type" ON "transactions"("transaction_type");

-- CreateIndex
CREATE INDEX "idx_trans_method" ON "transactions"("payment_method");

-- CreateIndex
CREATE INDEX "idx_trans_created" ON "transactions"("createdAt");

-- CreateIndex
CREATE INDEX "idx_trans_user_status" ON "transactions"("user_id", "status");

-- CreateIndex
CREATE INDEX "idx_trans_user_date" ON "transactions"("user_id", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "quizzes_chapter_id_key" ON "quizzes"("chapter_id");

-- CreateIndex
CREATE UNIQUE INDEX "questions_quiz_id_key" ON "questions"("quiz_id");

-- CreateIndex
CREATE INDEX "idx_question_quiz" ON "questions"("quiz_id");

-- CreateIndex
CREATE INDEX "idx_question_order" ON "questions"("quiz_id", "order_index");

-- CreateIndex
CREATE INDEX "idx_question_id" ON "questions"("question_id");

-- CreateIndex
CREATE UNIQUE INDEX "options_question_id_key" ON "options"("question_id");

-- CreateIndex
CREATE INDEX "idx_option_question" ON "options"("question_id");

-- CreateIndex
CREATE INDEX "idx_option_order" ON "options"("question_id", "order_index");

-- CreateIndex
CREATE UNIQUE INDEX "answers_submission_id_key" ON "answers"("submission_id");

-- CreateIndex
CREATE UNIQUE INDEX "answers_question_id_key" ON "answers"("question_id");

-- CreateIndex
CREATE UNIQUE INDEX "submissions_quiz_id_key" ON "submissions"("quiz_id");

-- CreateIndex
CREATE UNIQUE INDEX "submissions_user_id_key" ON "submissions"("user_id");

-- CreateIndex
CREATE INDEX "idx_submission_quiz" ON "submissions"("quiz_id");

-- CreateIndex
CREATE INDEX "idx_submission_user" ON "submissions"("user_id");

-- CreateIndex
CREATE INDEX "idx_submission_unique" ON "submissions"("quiz_id", "user_id");

-- CreateIndex
CREATE INDEX "idx_submission_date" ON "submissions"("submittedAt");

-- CreateIndex
CREATE UNIQUE INDEX "admin_role_permissions_admin_role_id_key" ON "admin_role_permissions"("admin_role_id");

-- CreateIndex
CREATE INDEX "idx_arp_role" ON "admin_role_permissions"("admin_role_id");

-- CreateIndex
CREATE UNIQUE INDEX "admin_roles_role_name_key" ON "admin_roles"("role_name");

-- CreateIndex
CREATE UNIQUE INDEX "admins_admin_role_id_key" ON "admins"("admin_role_id");

-- CreateIndex
CREATE INDEX "idx_admin_role" ON "admins"("admin_role_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_category_name_key" ON "categories"("category_name");

-- CreateIndex
CREATE UNIQUE INDEX "chapters_course_id_key" ON "chapters"("course_id");

-- CreateIndex
CREATE UNIQUE INDEX "chapters_quiz_id_key" ON "chapters"("quiz_id");

-- CreateIndex
CREATE INDEX "idx_section_course" ON "chapters"("course_id");

-- CreateIndex
CREATE INDEX "idx_section_order" ON "chapters"("course_id", "order_index");

-- CreateIndex
CREATE INDEX "idx_citizen_status" ON "citizen_ids_confirms"("status");

-- CreateIndex
CREATE INDEX "idx_citizen_verified" ON "citizen_ids_confirms"("isVerified");

-- CreateIndex
CREATE UNIQUE INDEX "courses_category_id_key" ON "courses"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "courses_instructor_id_key" ON "courses"("instructor_id");

-- CreateIndex
CREATE INDEX "idx_course_category" ON "courses"("category_id");

-- CreateIndex
CREATE INDEX "idx_course_instructor" ON "courses"("instructor_id");

-- CreateIndex
CREATE INDEX "idx_course_status" ON "courses"("status");

-- CreateIndex
CREATE INDEX "idx_course_status_cat" ON "courses"("status", "category_id");

-- CreateIndex
CREATE INDEX "idx_course_price" ON "courses"("price");

-- CreateIndex
CREATE INDEX "idx_course_hot_sale" ON "courses"("hot", "sale_off");

-- CreateIndex
CREATE INDEX "idx_course_created" ON "courses"("createdAt");

-- CreateIndex
CREATE INDEX "idx_course_language" ON "courses"("available_language");

-- CreateIndex
CREATE UNIQUE INDEX "feedbacks_course_id_key" ON "feedbacks"("course_id");

-- CreateIndex
CREATE UNIQUE INDEX "feedbacks_user_id_key" ON "feedbacks"("user_id");

-- CreateIndex
CREATE INDEX "idx_feedback_course" ON "feedbacks"("course_id");

-- CreateIndex
CREATE INDEX "idx_feedback_user" ON "feedbacks"("user_id");

-- CreateIndex
CREATE INDEX "idx_feedback_rating" ON "feedbacks"("rating");

-- CreateIndex
CREATE INDEX "idx_feedback_course_rating" ON "feedbacks"("course_id", "rating");

-- CreateIndex
CREATE INDEX "idx_feedback_created" ON "feedbacks"("createdAt");

-- CreateIndex
CREATE INDEX "idx_feedback_course_date" ON "feedbacks"("course_id", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "instructor_qualifications_instructor_id_key" ON "instructor_qualifications"("instructor_id");

-- CreateIndex
CREATE UNIQUE INDEX "instructor_qualifications_specialization_id_key" ON "instructor_qualifications"("specialization_id");

-- CreateIndex
CREATE INDEX "idx_iq_instructor" ON "instructor_qualifications"("instructor_id");

-- CreateIndex
CREATE INDEX "idx_iq_specialization" ON "instructor_qualifications"("specialization_id");

-- CreateIndex
CREATE INDEX "idx_iq_status" ON "instructor_qualifications"("status");

-- CreateIndex
CREATE INDEX "idx_iq_verified" ON "instructor_qualifications"("isVerified");

-- CreateIndex
CREATE INDEX "idx_iq_expire" ON "instructor_qualifications"("expire_date");

-- CreateIndex
CREATE INDEX "idx_instructor_status" ON "instructors"("status");

-- CreateIndex
CREATE INDEX "idx_instructor_verified" ON "instructors"("isVerified");

-- CreateIndex
CREATE INDEX "idx_instructor_status_verified" ON "instructors"("status", "isVerified");

-- CreateIndex
CREATE INDEX "idx_instructor_created" ON "instructors"("createdAt");

-- CreateIndex
CREATE INDEX "idx_lc_learner" ON "learner_courses"("learner_id");

-- CreateIndex
CREATE INDEX "idx_lc_course" ON "learner_courses"("course_id");

-- CreateIndex
CREATE INDEX "idx_lc_status" ON "learner_courses"("status");

-- CreateIndex
CREATE INDEX "idx_lc_learner_status" ON "learner_courses"("learner_id", "status");

-- CreateIndex
CREATE INDEX "idx_lc_enrolled" ON "learner_courses"("enrolledAt");

-- CreateIndex
CREATE INDEX "idx_lc_completed" ON "learner_courses"("completedAt");

-- CreateIndex
CREATE UNIQUE INDEX "learner_courses_learner_id_course_id_key" ON "learner_courses"("learner_id", "course_id");

-- CreateIndex
CREATE INDEX "idx_lesson_section" ON "lessons"("chapter_id");

-- CreateIndex
CREATE INDEX "idx_lesson_order" ON "lessons"("chapter_id", "order_index");

-- CreateIndex
CREATE UNIQUE INDEX "levels_level_name_key" ON "levels"("level_name");

-- CreateIndex
CREATE INDEX "idx_level_order" ON "levels"("order_index");

-- CreateIndex
CREATE UNIQUE INDEX "notes_user_id_key" ON "notes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "notes_lesson_id_key" ON "notes"("lesson_id");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_permission_name_key" ON "permissions"("permission_name");

-- CreateIndex
CREATE UNIQUE INDEX "specializations_specialization_name_key" ON "specializations"("specialization_name");

-- CreateIndex
CREATE INDEX "idx_spec_name" ON "specializations"("specialization_name");

-- CreateIndex
CREATE INDEX "idx_spec_verified" ON "specializations"("isVerified");

-- CreateIndex
CREATE INDEX "idx_user_role" ON "users"("role");

-- CreateIndex
CREATE INDEX "idx_user_last_login" ON "users"("last_login");

-- CreateIndex
CREATE INDEX "idx_user_role_active" ON "users"("role", "isActive");

-- CreateIndex
CREATE INDEX "idx_user_active" ON "users"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_user_id_key" ON "wallets"("user_id");

-- CreateIndex
CREATE INDEX "idx_wallet_balance" ON "wallets"("balance");

-- AddForeignKey
ALTER TABLE "learners" ADD CONSTRAINT "learners_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instructors" ADD CONSTRAINT "instructors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instructor_specializations" ADD CONSTRAINT "instructor_specializations_specialization_id_fkey" FOREIGN KEY ("specialization_id") REFERENCES "specializations"("specialization_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instructor_specializations" ADD CONSTRAINT "instructor_specializations_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "instructors"("instructor_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instructor_specializations" ADD CONSTRAINT "instructor_specializations_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("admin_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "citizen_ids_confirms" ADD CONSTRAINT "citizen_ids_confirms_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "instructors"("instructor_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instructor_qualifications" ADD CONSTRAINT "instructor_qualifications_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "instructors"("instructor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instructor_qualifications" ADD CONSTRAINT "instructor_qualifications_specialization_id_fkey" FOREIGN KEY ("specialization_id") REFERENCES "specializations"("specialization_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("course_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_admin_role_id_fkey" FOREIGN KEY ("admin_role_id") REFERENCES "admin_roles"("admin_role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_role_permissions" ADD CONSTRAINT "admin_role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("permission_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_role_permissions" ADD CONSTRAINT "admin_role_permissions_admin_role_id_fkey" FOREIGN KEY ("admin_role_id") REFERENCES "admin_roles"("admin_role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_securities" ADD CONSTRAINT "account_securities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "levels"("level_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("category_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "instructors"("instructor_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learner_courses" ADD CONSTRAINT "learner_courses_learner_id_fkey" FOREIGN KEY ("learner_id") REFERENCES "learners"("learner_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learner_courses" ADD CONSTRAINT "learner_courses_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("chapter_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("lesson_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("chapter_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("quiz_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "options" ADD CONSTRAINT "options_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("question_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("question_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "submissions"("submission_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("quiz_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
