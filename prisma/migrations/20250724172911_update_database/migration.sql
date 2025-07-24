/*
  Warnings:

  - You are about to drop the `Course` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Enrollment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Feedback` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Instructor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Learner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lesson` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Active', 'Inactive', 'Suspended');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('Pending', 'Approved', 'Rejected');

-- CreateEnum
CREATE TYPE "QualificationType" AS ENUM ('Degree', 'Certificate');

-- CreateEnum
CREATE TYPE "CourseEnrollmentStatus" AS ENUM ('Enrolled', 'Completed', 'Cancelled');

-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('Draft', 'Pubished', 'Archived');

-- CreateEnum
CREATE TYPE "LanguageOptions" AS ENUM ('English', 'Vietnamese');

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_lecturerId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_userId_fkey";

-- DropForeignKey
ALTER TABLE "Instructor" DROP CONSTRAINT "Instructor_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Learner" DROP CONSTRAINT "Learner_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_courseId_fkey";

-- DropTable
DROP TABLE "Course";

-- DropTable
DROP TABLE "Enrollment";

-- DropTable
DROP TABLE "Feedback";

-- DropTable
DROP TABLE "Instructor";

-- DropTable
DROP TABLE "Learner";

-- DropTable
DROP TABLE "Lesson";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "user_id" VARCHAR(50) NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "avatar" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "address" TEXT,
    "city" TEXT,
    "country" TEXT,
    "nation" TEXT,
    "bio" TEXT,
    "last_login" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "password" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'LEARNER',
    "gender" TEXT NOT NULL DEFAULT 'OTHER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "learners" (
    "learner_id" VARCHAR(50) NOT NULL,
    "user_id" TEXT NOT NULL,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "learners_pkey" PRIMARY KEY ("learner_id")
);

-- CreateTable
CREATE TABLE "instructors" (
    "instructor_id" VARCHAR(50) NOT NULL,
    "user_id" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'Inactive',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "instructors_pkey" PRIMARY KEY ("instructor_id")
);

-- CreateTable
CREATE TABLE "instructor_specializations" (
    "instructor_specialization_id" VARCHAR(50) NOT NULL,
    "instructor_id" TEXT NOT NULL,
    "specialization_id" TEXT NOT NULL,
    "admin_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "instructor_specializations_pkey" PRIMARY KEY ("instructor_specialization_id")
);

-- CreateTable
CREATE TABLE "specializations" (
    "specialization_id" VARCHAR(50) NOT NULL,
    "instructor_id" TEXT NOT NULL,
    "specialization_name" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "specializations_pkey" PRIMARY KEY ("specialization_id")
);

-- CreateTable
CREATE TABLE "citizen_ids_confirms" (
    "citizen_id" VARCHAR(50) NOT NULL,
    "instructor_id" TEXT NOT NULL,
    "citizen_number" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "place_of_birth" TIMESTAMP(3) NOT NULL,
    "issued_place" TIMESTAMP(3) NOT NULL,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'Pending',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "citizen_ids_confirms_pkey" PRIMARY KEY ("citizen_id")
);

-- CreateTable
CREATE TABLE "instructor_qualifications" (
    "instructor_qualification_id" VARCHAR(50) NOT NULL,
    "instructor_id" VARCHAR(50) NOT NULL,
    "specialization_id" VARCHAR(50) NOT NULL,
    "type" "QualificationType" NOT NULL DEFAULT 'Certificate',
    "title" VARCHAR(255) NOT NULL,
    "issue_date" TIMESTAMP(3) NOT NULL,
    "expire_date" TIMESTAMP(3) NOT NULL,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'Pending',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "instructor_qualifications_pkey" PRIMARY KEY ("instructor_qualification_id")
);

-- CreateTable
CREATE TABLE "wallets" (
    "wallet_id" VARCHAR(50) NOT NULL,
    "instructor_id" TEXT NOT NULL,
    "balance" DECIMAL(10,2) NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("wallet_id")
);

-- CreateTable
CREATE TABLE "instructor_course_transactions" (
    "instructor_course_transaction_id" VARCHAR(50) NOT NULL,
    "course_id" VARCHAR(50) NOT NULL,
    "wallet_id" VARCHAR(50) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "commision_rate" DECIMAL(5,2) NOT NULL,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'Pending',
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "instructor_course_transactions_pkey" PRIMARY KEY ("instructor_course_transaction_id")
);

-- CreateTable
CREATE TABLE "admins" (
    "admin_id" VARCHAR(50) NOT NULL,
    "user_id" TEXT NOT NULL,
    "admin_role_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("admin_id")
);

-- CreateTable
CREATE TABLE "admin_roles" (
    "admin_role_id" VARCHAR(50) NOT NULL,
    "role_name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_roles_pkey" PRIMARY KEY ("admin_role_id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "permission_id" VARCHAR(50) NOT NULL,
    "permission_name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("permission_id")
);

-- CreateTable
CREATE TABLE "admin_role_permissions" (
    "permission_id" TEXT NOT NULL,
    "admin_role_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_role_permissions_pkey" PRIMARY KEY ("permission_id","admin_role_id")
);

-- CreateTable
CREATE TABLE "account_securities" (
    "account_security_id" VARCHAR(50) NOT NULL,
    "user_id" TEXT NOT NULL,
    "failed_login_attempts" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_securities_pkey" PRIMARY KEY ("account_security_id")
);

-- CreateTable
CREATE TABLE "courses" (
    "course_id" VARCHAR(50) NOT NULL,
    "category_id" VARCHAR(50) NOT NULL,
    "level_id" VARCHAR(50) NOT NULL,
    "instructor_id" VARCHAR(50) NOT NULL,
    "status" "CourseStatus" NOT NULL DEFAULT 'Draft',
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "thumbnail" VARCHAR(255) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "sale_off" BOOLEAN NOT NULL DEFAULT false,
    "hot" BOOLEAN NOT NULL DEFAULT false,
    "tag" BOOLEAN NOT NULL DEFAULT false,
    "available_language" "LanguageOptions" NOT NULL DEFAULT 'Vietnamese',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lecturerId" TEXT NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("course_id")
);

-- CreateTable
CREATE TABLE "categories" (
    "category_id" VARCHAR(50) NOT NULL,
    "category_name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "learner_courses" (
    "learner_course_id" VARCHAR(50) NOT NULL,
    "learner_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "status" "CourseEnrollmentStatus" NOT NULL DEFAULT 'Enrolled',
    "progress" DECIMAL(5,2) NOT NULL,
    "rating" INTEGER NOT NULL,
    "feedback" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learner_courses_pkey" PRIMARY KEY ("learner_course_id")
);

-- CreateTable
CREATE TABLE "chapters" (
    "chapter_id" VARCHAR(50) NOT NULL,
    "course_id" VARCHAR(50) NOT NULL,
    "chapter_title" VARCHAR(255) NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chapters_pkey" PRIMARY KEY ("chapter_id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "lesson_id" TEXT NOT NULL,
    "chapter_id" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "duration" VARCHAR(100) NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("lesson_id")
);

-- CreateTable
CREATE TABLE "notes" (
    "note_id" VARCHAR(50) NOT NULL,
    "lesson_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "time" INTEGER NOT NULL,
    "content" VARCHAR(255) NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("note_id")
);

-- CreateTable
CREATE TABLE "feedbacks" (
    "id" VARCHAR(50) NOT NULL,
    "courseId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "idx_user_email" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "learners_user_id_key" ON "learners"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "instructors_user_id_key" ON "instructors"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "instructor_specializations_instructor_id_key" ON "instructor_specializations"("instructor_id");

-- CreateIndex
CREATE UNIQUE INDEX "instructor_specializations_specialization_id_key" ON "instructor_specializations"("specialization_id");

-- CreateIndex
CREATE UNIQUE INDEX "instructor_specializations_admin_id_key" ON "instructor_specializations"("admin_id");

-- CreateIndex
CREATE UNIQUE INDEX "specializations_instructor_id_key" ON "specializations"("instructor_id");

-- CreateIndex
CREATE UNIQUE INDEX "citizen_ids_confirms_instructor_id_key" ON "citizen_ids_confirms"("instructor_id");

-- CreateIndex
CREATE UNIQUE INDEX "citizen_ids_confirms_citizen_number_key" ON "citizen_ids_confirms"("citizen_number");

-- CreateIndex
CREATE UNIQUE INDEX "instructor_qualifications_instructor_id_specialization_id_key" ON "instructor_qualifications"("instructor_id", "specialization_id");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_instructor_id_key" ON "wallets"("instructor_id");

-- CreateIndex
CREATE UNIQUE INDEX "admins_user_id_key" ON "admins"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "account_securities_user_id_key" ON "account_securities"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "learner_courses_learner_id_key" ON "learner_courses"("learner_id");

-- CreateIndex
CREATE UNIQUE INDEX "learner_courses_course_id_key" ON "learner_courses"("course_id");

-- CreateIndex
CREATE UNIQUE INDEX "lessons_chapter_id_key" ON "lessons"("chapter_id");

-- AddForeignKey
ALTER TABLE "learners" ADD CONSTRAINT "learners_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instructors" ADD CONSTRAINT "instructors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instructor_specializations" ADD CONSTRAINT "instructor_specializations_specialization_id_fkey" FOREIGN KEY ("specialization_id") REFERENCES "specializations"("specialization_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instructor_specializations" ADD CONSTRAINT "instructor_specializations_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "instructors"("instructor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instructor_specializations" ADD CONSTRAINT "instructor_specializations_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("admin_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "citizen_ids_confirms" ADD CONSTRAINT "citizen_ids_confirms_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "instructors"("instructor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instructor_qualifications" ADD CONSTRAINT "instructor_qualifications_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "instructors"("instructor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instructor_qualifications" ADD CONSTRAINT "instructor_qualifications_specialization_id_fkey" FOREIGN KEY ("specialization_id") REFERENCES "specializations"("specialization_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "instructors"("instructor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instructor_course_transactions" ADD CONSTRAINT "instructor_course_transactions_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_admin_role_id_fkey" FOREIGN KEY ("admin_role_id") REFERENCES "admin_roles"("admin_role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_role_permissions" ADD CONSTRAINT "admin_role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("permission_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_role_permissions" ADD CONSTRAINT "admin_role_permissions_admin_role_id_fkey" FOREIGN KEY ("admin_role_id") REFERENCES "admin_roles"("admin_role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_securities" ADD CONSTRAINT "account_securities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_lecturerId_fkey" FOREIGN KEY ("lecturerId") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "instructors"("instructor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learner_courses" ADD CONSTRAINT "learner_courses_learner_id_fkey" FOREIGN KEY ("learner_id") REFERENCES "learners"("learner_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learner_courses" ADD CONSTRAINT "learner_courses_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("course_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("course_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("chapter_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("lesson_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("course_id") ON DELETE RESTRICT ON UPDATE CASCADE;
