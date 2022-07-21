-- DropIndex
DROP INDEX "essay_userId_key";

-- AlterTable
ALTER TABLE "essay" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "essay_pkey" PRIMARY KEY ("id");
