-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "social_credit" DOUBLE PRECISION NOT NULL DEFAULT 1000
);

-- CreateTable
CREATE TABLE "profile" (
    "user_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "registered_guild" TEXT NOT NULL,
    "last_interact_guild" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "cooldown" (
    "user_id" TEXT NOT NULL,
    "essay_to_dad" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "essay" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "essay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "profile_user_id_key" ON "profile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "cooldown_user_id_key" ON "cooldown"("user_id");

-- AddForeignKey
ALTER TABLE "profile" ADD CONSTRAINT "profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cooldown" ADD CONSTRAINT "cooldown_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "essay" ADD CONSTRAINT "essay_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
