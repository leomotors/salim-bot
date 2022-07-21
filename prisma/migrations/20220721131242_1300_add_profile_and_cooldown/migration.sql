-- ChangeTableName
ALTER TABLE "User" RENAME TO "user";
ALTER TABLE "user" DROP COLUMN "username";

-- CreateTable
CREATE TABLE "profile" (
    "user_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "registered_guild" TEXT NOT NULL,
    "last_interact_guild" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "cooldown" (
    "userId" TEXT NOT NULL,
    "essay_to_dad" TIMESTAMP(3)
);

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "profile_user_id_key" ON "profile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "cooldown_userId_key" ON "cooldown"("userId");

-- AddForeignKey
ALTER TABLE "profile" ADD CONSTRAINT "profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cooldown" ADD CONSTRAINT "cooldown_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
