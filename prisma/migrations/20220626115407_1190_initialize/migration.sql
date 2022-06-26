-- CreateTable
CREATE TABLE "User" (
    "userid" TEXT NOT NULL,
    "social_credit" REAL NOT NULL DEFAULT 1000
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userid_key" ON "User"("userid");
