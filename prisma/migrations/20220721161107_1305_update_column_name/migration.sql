/*
  Warnings:

  - You are about to drop the column `userId` on the `cooldown` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `essay` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `cooldown` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `cooldown` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `essay` table without a default value. This is not possible if the table is not empty.

*/

-- ** MANUAL MIGRATION ** HOPE THIS WORK PLEASE

-- DropForeignKey
-- ALTER TABLE "cooldown" DROP CONSTRAINT "cooldown_userId_fkey";

-- DropForeignKey
-- ALTER TABLE "essay" DROP CONSTRAINT "essay_userId_fkey";

-- DropIndex
DROP INDEX "cooldown_userId_key";

-- AlterTable
ALTER TABLE "cooldown" RENAME COLUMN "userId" to "user_id";

-- AlterTable
ALTER TABLE "essay" RENAME COLUMN "userId" to "user_id";

-- CreateIndex
CREATE UNIQUE INDEX "cooldown_user_id_key" ON "cooldown"("user_id");

-- AddForeignKey
-- ALTER TABLE "cooldown" ADD CONSTRAINT "cooldown_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "essay" ADD CONSTRAINT "essay_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
