import { PrismaClient } from "@prisma/client";

import { Message, Interaction, User as DiscordUser } from "discord.js";

export const prisma = new PrismaClient();

export type Context = Message | Interaction;

export function getAuthor(ctx: Context) {
    return (ctx as Message).author ?? (ctx as Interaction).user;
}

export async function getUser3rdParty(user: DiscordUser, ctx: Context) {
    const u = await prisma.user.upsert({
        where: {
            id: user.id,
        },
        create: {
            id: user.id,
        },
        update: {},
    });

    await prisma.profile.upsert({
        where: {
            userId: user.id,
        },
        create: {
            username: user.username,
            registeredGuild: ctx.guild?.name ?? "<undefined>",
            lastInteractGuild: ctx.guild?.name ?? "<undefined>",
            user: {
                connect: {
                    id: user.id,
                },
            },
        },
        update: {
            username: user.username,
        },
    });

    return u;
}

export async function getUser(ctx: Context) {
    const user = getAuthor(ctx);

    const u = await prisma.user.upsert({
        where: {
            id: user.id,
        },
        create: {
            id: user.id,
        },
        update: {},
    });

    await prisma.profile.upsert({
        where: {
            userId: u.id,
        },
        create: {
            username: user.username,
            registeredGuild: ctx.guild?.name ?? "<undefined>",
            lastInteractGuild: ctx.guild?.name ?? "<undefined>",
            user: {
                connect: {
                    id: user.id,
                },
            },
        },
        update: {
            username: user.username,
            lastInteractGuild: ctx.guild?.name ?? "<undefined>",
        },
    });

    return u;
}

export async function updateUserCredit(user: Context, diff: number) {
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
