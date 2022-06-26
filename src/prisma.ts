import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function getUser(userid: string) {
    const user = await prisma.user.findUnique({
        where: {
            userid,
        },
    });

    if (user) return user;
    else
        return await prisma.user.create({
            data: {
                userid,
            },
        });
}

export async function updateUserCredit(userid: string, diff: number) {
    const user = await getUser(userid);

    await prisma.user.update({
        where: {
            userid,
        },
        data: {
            socialCredit: user.socialCredit + diff,
        },
    });
}
