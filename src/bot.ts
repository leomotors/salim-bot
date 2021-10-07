import dotenv from "dotenv";
dotenv.config();

import { Console, DataLoader, SBotClient, Response } from "s-bot-framework";

const client = new SBotClient({ token: process.env.DISCORD_TOKEN });

const keywords = new DataLoader("data/keywords.json", "ชังชาติ");

client.useResponse(
    new Response({
        trigger: { mention: true, keywords: ["แนะนำตัว"] },
        response: () => "สวัสดีครับท่านสมาชิกชมรม",
    })
);

const ชังชาติ = new Response({
    trigger: { keywords },
    response: () => "ชังชาติ",
});

client.useResponse(
    new Response({
        trigger: { mention: true, keywords: ["ผิด"] },
        response: () =>
            `คุณผิดที่พูดคำว่า ${ชังชาติ.triggered} ถือเป็นการคุกคามสถาบันอย่างยิ่ง`,
    })
);

client.useResponse(ชังชาติ);

client.useActivity({
    type: "PLAYING",
    name: `Salim Bot ${process.env.npm_package_version}`,
});

const console = new Console(client);

client.useConsole(console);
