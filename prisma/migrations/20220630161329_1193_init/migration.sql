-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "social_credit" DOUBLE PRECISION NOT NULL DEFAULT 1000
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
