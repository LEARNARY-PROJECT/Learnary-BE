-- CreateEnum
CREATE TYPE "Role" AS ENUM ('LEARNER', 'INSTRUCTOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Active', 'Inactive', 'Suspended');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('Pending', 'Approved', 'Rejected');

-- CreateEnum
CREATE TYPE "QualificationType" AS ENUM ('Degree', 'Certificate');

-- CreateEnum
CREATE TYPE "CourseEnrollmentStatus" AS ENUM ('Enrolled', 'Completed', 'Cancelled', 'Progressing');

-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('Draft', 'Published', 'Pending', 'Archived');

-- CreateEnum
CREATE TYPE "LanguageOptions" AS ENUM ('English', 'Vietnamese');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('Withdraw', 'Deposit', 'Pay');

-- CreateEnum
CREATE TYPE "TransactionMethod" AS ENUM ('Credit_Card', 'Voucher', 'Bank_Transfer', 'PayPal');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('Pending', 'Success', 'Cancel');

-- CreateEnum
CREATE TYPE "WithdrawStatus" AS ENUM ('Success', 'Pending', 'Rejected');

-- CreateEnum
CREATE TYPE "TransactionNote" AS ENUM ('User_Pay', 'Pay_For_Instructor');

-- CreateEnum
CREATE TYPE "GroupType" AS ENUM ('Combo', 'Group');

-- CreateTable
CREATE TABLE "users" (
    "user_id" CHAR(50) NOT NULL,
    "email" CHAR(50) NOT NULL,
    "phone" CHAR(50),
    "avatar" VARCHAR(255),
    "dateOfBirth" TIMESTAMP(3),
    "address" VARCHAR(255),
    "city" VARCHAR(255),
    "country" VARCHAR(255),
    "nation" VARCHAR(255),
    "bio" VARCHAR(255),
    "last_login" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "password" TEXT,
    "fullName" VARCHAR(255) NOT NULL,
    "googleId" TEXT,
    "role" "Role" NOT NULL DEFAULT 'LEARNER',
    "gender" TEXT NOT NULL DEFAULT 'OTHER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "learners" (
    "learner_id" CHAR(50) NOT NULL,
    "user_id" CHAR(50) NOT NULL,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "learners_pkey" PRIMARY KEY ("learner_id")
);

-- CreateTable
CREATE TABLE "instructors" (
    "instructor_id" CHAR(50) NOT NULL,
    "user_id" CHAR(50) NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'Inactive',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "instructors_pkey" PRIMARY KEY ("instructor_id")
);

-- CreateTable
CREATE TABLE "instructor_specializations" (
    "instructor_specialization_id" CHAR(50) NOT NULL,
    "instructor_id" CHAR(50) NOT NULL,
    "specialization_id" CHAR(50) NOT NULL,
    "admin_id" CHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "instructor_specializations_pkey" PRIMARY KEY ("instructor_specialization_id")
);

-- CreateTable
CREATE TABLE "specializations" (
    "specialization_id" CHAR(50) NOT NULL,
    "instructor_id" CHAR(50),
    "user_id" CHAR(50) NOT NULL,
    "specialization_name" VARCHAR(255) NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "specializations_pkey" PRIMARY KEY ("specialization_id")
);

-- CreateTable
CREATE TABLE "citizen_ids_confirms" (
    "citizen_id" CHAR(50) NOT NULL,
    "instructor_id" CHAR(50) NOT NULL,
    "citizen_number" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "place_of_birth" VARCHAR(255) NOT NULL,
    "issued_place" VARCHAR(255) NOT NULL,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'Pending',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "citizen_ids_confirms_pkey" PRIMARY KEY ("citizen_id")
);

-- CreateTable
CREATE TABLE "instructor_qualifications" (
    "instructor_qualification_id" VARCHAR(50) NOT NULL,
    "instructor_id" CHAR(50),
    "specialization_id" CHAR(50) NOT NULL,
    "user_id" CHAR(50) NOT NULL,
    "type" "QualificationType" NOT NULL DEFAULT 'Certificate',
    "title" VARCHAR(255) NOT NULL,
    "issue_date" TIMESTAMP(3) NOT NULL,
    "expire_date" TIMESTAMP(3),
    "issue_place" VARCHAR(255),
    "qualification_images" TEXT[],
    "status" "ApprovalStatus" NOT NULL DEFAULT 'Pending',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "instructor_qualifications_pkey" PRIMARY KEY ("instructor_qualification_id")
);

-- CreateTable
CREATE TABLE "bank_account" (
    "bank_id" CHAR(50) NOT NULL,
    "instructor_id" CHAR(50) NOT NULL,
    "bank_name" VARCHAR(255) NOT NULL,
    "account_number" VARCHAR(255) NOT NULL,
    "account_holder_name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bank_account_pkey" PRIMARY KEY ("bank_id")
);

-- CreateTable
CREATE TABLE "wallets" (
    "wallet_id" VARCHAR(50) NOT NULL,
    "user_id" CHAR(50) NOT NULL,
    "balance" DECIMAL(10,2) NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("wallet_id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "transaction_id" CHAR(50) NOT NULL,
    "course_id" CHAR(50),
    "user_id" CHAR(50) NOT NULL,
    "wallet_id" CHAR(50),
    "payment_code" BIGINT NOT NULL,
    "transaction_type" "TransactionType" NOT NULL,
    "commission_rate" DECIMAL(5,2),
    "payment_method" "TransactionMethod" NOT NULL,
    "amount" DECIMAL(10,2),
    "currency" VARCHAR(10) NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'Pending',
    "note" "TransactionNote" NOT NULL,
    "description" VARCHAR(255),
    "sender_bank" VARCHAR(50),
    "sender_name" VARCHAR(100),
    "sender_number" VARCHAR(50),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateTable
CREATE TABLE "admins" (
    "admin_id" CHAR(50) NOT NULL,
    "user_id" CHAR(50) NOT NULL,
    "admin_role_id" CHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("admin_id")
);

-- CreateTable
CREATE TABLE "admin_roles" (
    "admin_role_id" CHAR(50) NOT NULL,
    "level" INTEGER NOT NULL,
    "role_name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_roles_pkey" PRIMARY KEY ("admin_role_id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "permission_id" CHAR(50) NOT NULL,
    "permission_name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("permission_id")
);

-- CreateTable
CREATE TABLE "admin_role_permissions" (
    "permission_id" CHAR(50) NOT NULL,
    "admin_role_id" CHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_role_permissions_pkey" PRIMARY KEY ("permission_id","admin_role_id")
);

-- CreateTable
CREATE TABLE "account_securities" (
    "account_security_id" CHAR(50) NOT NULL,
    "user_id" CHAR(50) NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "failed_login_attempts" INTEGER NOT NULL,
    "verification_token" VARCHAR(255),
    "token_expires_at" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_securities_pkey" PRIMARY KEY ("account_security_id")
);

-- CreateTable
CREATE TABLE "groups" (
    "group_id" CHAR(50) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "GroupType" NOT NULL DEFAULT 'Group',
    "discount" DECIMAL(5,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("group_id")
);

-- CreateTable
CREATE TABLE "course_groups" (
    "group_id" CHAR(50) NOT NULL,
    "course_id" CHAR(50) NOT NULL,
    "order_index" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_groups_pkey" PRIMARY KEY ("course_id","group_id")
);

-- CreateTable
CREATE TABLE "courses" (
    "course_id" CHAR(50) NOT NULL,
    "category_id" CHAR(50) NOT NULL,
    "level_id" CHAR(50) NOT NULL,
    "instructor_id" CHAR(50) NOT NULL,
    "status" "CourseStatus" NOT NULL DEFAULT 'Draft',
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255),
    "requirement" VARCHAR(255),
    "description" VARCHAR(255) NOT NULL,
    "thumbnail" VARCHAR(255) NOT NULL,
    "admin_note" VARCHAR(255),
    "price" DECIMAL(10,2) NOT NULL,
    "sale_off" BOOLEAN NOT NULL DEFAULT false,
    "hot" BOOLEAN NOT NULL DEFAULT false,
    "tag" BOOLEAN NOT NULL DEFAULT false,
    "available_language" "LanguageOptions" NOT NULL DEFAULT 'Vietnamese',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("course_id")
);

-- CreateTable
CREATE TABLE "categories" (
    "category_id" CHAR(50) NOT NULL,
    "category_name" VARCHAR(255) NOT NULL,
    "slug" CHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "levels" (
    "level_id" CHAR(50) NOT NULL,
    "level_name" VARCHAR(255) NOT NULL,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "levels_pkey" PRIMARY KEY ("level_id")
);

-- CreateTable
CREATE TABLE "learner_courses" (
    "learner_id" CHAR(50) NOT NULL,
    "course_id" CHAR(50) NOT NULL,
    "status" "CourseEnrollmentStatus" NOT NULL DEFAULT 'Enrolled',
    "progress" DECIMAL(5,2) NOT NULL,
    "rating" INTEGER NOT NULL,
    "feedback" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learner_courses_pkey" PRIMARY KEY ("learner_id","course_id")
);

-- CreateTable
CREATE TABLE "chapters" (
    "chapter_id" CHAR(50) NOT NULL,
    "course_id" CHAR(50) NOT NULL,
    "chapter_title" VARCHAR(255) NOT NULL,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chapters_pkey" PRIMARY KEY ("chapter_id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "lesson_id" CHAR(50) NOT NULL,
    "chapter_id" CHAR(50) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "video_url" VARCHAR(255),
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "duration" VARCHAR(100) NOT NULL,
    "slug" CHAR(50) NOT NULL,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("lesson_id")
);

-- CreateTable
CREATE TABLE "notes" (
    "note_id" VARCHAR(50) NOT NULL,
    "user_id" CHAR(50) NOT NULL,
    "lesson_id" CHAR(50) NOT NULL,
    "content" VARCHAR(255) NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("note_id")
);

-- CreateTable
CREATE TABLE "withdraw_requests" (
    "withdraw_request_id" CHAR(50) NOT NULL,
    "user_id" TEXT NOT NULL,
    "admin_id" TEXT NOT NULL,
    "status" "WithdrawStatus" NOT NULL DEFAULT 'Pending',
    "note" VARCHAR(255) NOT NULL,
    "balance" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "withdraw_requests_pkey" PRIMARY KEY ("withdraw_request_id")
);

-- CreateTable
CREATE TABLE "feedbacks" (
    "id" CHAR(50) NOT NULL,
    "course_id" CHAR(50) NOT NULL,
    "user_id" CHAR(50) NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id")
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
    "option_id" CHAR(50) NOT NULL,
    "is_correct" BOOLEAN NOT NULL DEFAULT false,
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
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("submission_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");

-- CreateIndex
CREATE INDEX "idx_user_email" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_user_role" ON "users"("role");

-- CreateIndex
CREATE INDEX "idx_user_last_login" ON "users"("last_login");

-- CreateIndex
CREATE INDEX "idx_user_role_active" ON "users"("role", "isActive");

-- CreateIndex
CREATE INDEX "idx_user_active" ON "users"("isActive");

-- CreateIndex
CREATE INDEX "idx_user_googleid" ON "users"("googleId");

-- CreateIndex
CREATE INDEX "idx_user_fullname" ON "users"("fullName");

-- CreateIndex
CREATE INDEX "idx_user_phone" ON "users"("phone");

-- CreateIndex
CREATE INDEX "idx_user_createdat" ON "users"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "learners_user_id_key" ON "learners"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "instructors_user_id_key" ON "instructors"("user_id");

-- CreateIndex
CREATE INDEX "idx_instructor_status" ON "instructors"("status");

-- CreateIndex
CREATE INDEX "idx_instructor_verified" ON "instructors"("isVerified");

-- CreateIndex
CREATE INDEX "idx_instructor_status_verified" ON "instructors"("status", "isVerified");

-- CreateIndex
CREATE INDEX "idx_instructor_created" ON "instructors"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "instructor_specializations_instructor_id_key" ON "instructor_specializations"("instructor_id");

-- CreateIndex
CREATE UNIQUE INDEX "specializations_instructor_id_key" ON "specializations"("instructor_id");

-- CreateIndex
CREATE UNIQUE INDEX "specializations_specialization_name_key" ON "specializations"("specialization_name");

-- CreateIndex
CREATE INDEX "idx_spec_name" ON "specializations"("specialization_name");

-- CreateIndex
CREATE INDEX "idx_spec_verified" ON "specializations"("isVerified");

-- CreateIndex
CREATE UNIQUE INDEX "citizen_ids_confirms_instructor_id_key" ON "citizen_ids_confirms"("instructor_id");

-- CreateIndex
CREATE UNIQUE INDEX "citizen_ids_confirms_citizen_number_key" ON "citizen_ids_confirms"("citizen_number");

-- CreateIndex
CREATE INDEX "idx_citizen_status" ON "citizen_ids_confirms"("status");

-- CreateIndex
CREATE INDEX "idx_citizen_verified" ON "citizen_ids_confirms"("isVerified");

-- CreateIndex
CREATE INDEX "idx_iq_instructor" ON "instructor_qualifications"("instructor_id");

-- CreateIndex
CREATE INDEX "idx_iq_user" ON "instructor_qualifications"("user_id");

-- CreateIndex
CREATE INDEX "idx_iq_specialization" ON "instructor_qualifications"("specialization_id");

-- CreateIndex
CREATE INDEX "idx_iq_status" ON "instructor_qualifications"("status");

-- CreateIndex
CREATE INDEX "idx_iq_verified" ON "instructor_qualifications"("isVerified");

-- CreateIndex
CREATE INDEX "idx_iq_expire" ON "instructor_qualifications"("expire_date");

-- CreateIndex
CREATE UNIQUE INDEX "instructor_qualifications_user_id_specialization_id_key" ON "instructor_qualifications"("user_id", "specialization_id");

-- CreateIndex
CREATE UNIQUE INDEX "bank_account_instructor_id_key" ON "bank_account"("instructor_id");

-- CreateIndex
CREATE INDEX "idx_instructor_bank" ON "bank_account"("instructor_id");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_user_id_key" ON "wallets"("user_id");

-- CreateIndex
CREATE INDEX "idx_wallet_balance" ON "wallets"("balance");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_payment_code_key" ON "transactions"("payment_code");

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
CREATE UNIQUE INDEX "admins_user_id_key" ON "admins"("user_id");

-- CreateIndex
CREATE INDEX "idx_admin_role" ON "admins"("admin_role_id");

-- CreateIndex
CREATE UNIQUE INDEX "admin_roles_role_name_key" ON "admin_roles"("role_name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_permission_name_key" ON "permissions"("permission_name");

-- CreateIndex
CREATE UNIQUE INDEX "admin_role_permissions_admin_role_id_key" ON "admin_role_permissions"("admin_role_id");

-- CreateIndex
CREATE INDEX "idx_arp_role" ON "admin_role_permissions"("admin_role_id");

-- CreateIndex
CREATE UNIQUE INDEX "account_securities_user_id_key" ON "account_securities"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "courses_slug_key" ON "courses"("slug");

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
CREATE INDEX "idx_course_slug" ON "courses"("slug");

-- CreateIndex
CREATE INDEX "idx_course_hot_sale" ON "courses"("hot", "sale_off");

-- CreateIndex
CREATE INDEX "idx_course_created" ON "courses"("createdAt");

-- CreateIndex
CREATE INDEX "idx_course_language" ON "courses"("available_language");

-- CreateIndex
CREATE UNIQUE INDEX "categories_category_name_key" ON "categories"("category_name");

-- CreateIndex
CREATE UNIQUE INDEX "levels_level_name_key" ON "levels"("level_name");

-- CreateIndex
CREATE INDEX "idx_level_order" ON "levels"("order_index");

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
CREATE INDEX "idx_section_course" ON "chapters"("course_id");

-- CreateIndex
CREATE INDEX "idx_section_order" ON "chapters"("course_id", "order_index");

-- CreateIndex
CREATE INDEX "idx_lesson_section" ON "lessons"("chapter_id");

-- CreateIndex
CREATE INDEX "idx_lesson_order" ON "lessons"("chapter_id", "order_index");

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
CREATE UNIQUE INDEX "feedbacks_course_id_user_id_key" ON "feedbacks"("course_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "quizzes_chapter_id_key" ON "quizzes"("chapter_id");

-- CreateIndex
CREATE INDEX "idx_question_quiz" ON "questions"("quiz_id");

-- CreateIndex
CREATE INDEX "idx_question_order" ON "questions"("quiz_id", "order_index");

-- CreateIndex
CREATE INDEX "idx_option_question" ON "options"("question_id");

-- CreateIndex
CREATE INDEX "idx_option_order" ON "options"("question_id", "order_index");

-- CreateIndex
CREATE UNIQUE INDEX "answers_submission_id_question_id_key" ON "answers"("submission_id", "question_id");

-- CreateIndex
CREATE INDEX "idx_submission_quiz" ON "submissions"("quiz_id");

-- CreateIndex
CREATE INDEX "idx_submission_user" ON "submissions"("user_id");

-- CreateIndex
CREATE INDEX "idx_submission_unique" ON "submissions"("quiz_id", "user_id");

-- CreateIndex
CREATE INDEX "idx_submission_date" ON "submissions"("submittedAt");

-- CreateIndex
CREATE UNIQUE INDEX "submissions_quiz_id_user_id_key" ON "submissions"("quiz_id", "user_id");

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
ALTER TABLE "specializations" ADD CONSTRAINT "specializations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "citizen_ids_confirms" ADD CONSTRAINT "citizen_ids_confirms_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "instructors"("instructor_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instructor_qualifications" ADD CONSTRAINT "instructor_qualifications_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "instructors"("instructor_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instructor_qualifications" ADD CONSTRAINT "instructor_qualifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instructor_qualifications" ADD CONSTRAINT "instructor_qualifications_specialization_id_fkey" FOREIGN KEY ("specialization_id") REFERENCES "specializations"("specialization_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_account" ADD CONSTRAINT "bank_account_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "instructors"("instructor_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("course_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("wallet_id") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "course_groups" ADD CONSTRAINT "course_groups_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("group_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_groups" ADD CONSTRAINT "course_groups_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "withdraw_requests" ADD CONSTRAINT "withdraw_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdraw_requests" ADD CONSTRAINT "withdraw_requests_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("admin_id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "answers" ADD CONSTRAINT "answers_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "options"("option_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("quiz_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
