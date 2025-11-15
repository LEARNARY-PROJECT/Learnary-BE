-- AlterEnum
ALTER TYPE "CourseStatus" ADD VALUE 'Pending';

-- CreateIndex
CREATE INDEX "idx_user_googleid" ON "users"("googleId");

-- CreateIndex
CREATE INDEX "idx_user_fullname" ON "users"("fullName");

-- CreateIndex
CREATE INDEX "idx_user_phone" ON "users"("phone");

-- CreateIndex
CREATE INDEX "idx_user_createdat" ON "users"("createdAt");
