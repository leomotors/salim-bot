-- RenameForeignKey
ALTER TABLE "cooldown" RENAME CONSTRAINT "cooldown_userId_fkey" TO "cooldown_user_id_fkey";

-- RenameForeignKey
ALTER TABLE "essay" RENAME CONSTRAINT "essay_userId_fkey" TO "essay_user_id_fkey";
