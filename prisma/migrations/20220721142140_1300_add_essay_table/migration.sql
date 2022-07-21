-- CreateTable
CREATE TABLE "essay" (
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "essay_userId_key" ON "essay"("userId");

-- AddForeignKey
ALTER TABLE "essay" ADD CONSTRAINT "essay_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
