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

-- CreateIndex
CREATE UNIQUE INDEX "bank_account_instructor_id_key" ON "bank_account"("instructor_id");

-- CreateIndex
CREATE INDEX "idx_instructor_bank" ON "bank_account"("instructor_id");

-- AddForeignKey
ALTER TABLE "bank_account" ADD CONSTRAINT "bank_account_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "instructors"("instructor_id") ON DELETE CASCADE ON UPDATE CASCADE;
