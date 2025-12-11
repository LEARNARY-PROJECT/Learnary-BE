-- CreateTable
CREATE TABLE "favorites" (
    "favorite_id" CHAR(50) NOT NULL,
    "learner_id" CHAR(50) NOT NULL,
    "course_id" CHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("favorite_id")
);

-- CreateIndex
CREATE INDEX "idx_favorite_learner" ON "favorites"("learner_id");

-- CreateIndex
CREATE INDEX "idx_favorite_course" ON "favorites"("course_id");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_learner_id_course_id_key" ON "favorites"("learner_id", "course_id");

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_learner_id_fkey" FOREIGN KEY ("learner_id") REFERENCES "learners"("learner_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;
