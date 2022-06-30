import { PrismaClient } from "@prisma/client";

import { User as DiscordUser } from "discord.js";

export const prisma = new PrismaClient();

type User = Pick<DiscordUser, "id" | "username">;

export async function getUser({ id, username }: User) {
    return await prisma.user.upsert({
        where: {
            id,
        },
        create: {
            id,
            username,
        },
        update: {
            username,
        },
    });
}

export async function updateUserCredit(user: User, diff: number) {
    const { id, socialCredit } = await getUser(user);

    await prisma.user.update({
        where: {
            id,
        },
        data: {
            socialCredit: socialCredit + diff,
        },
    });
}
