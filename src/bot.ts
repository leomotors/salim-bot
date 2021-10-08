import dotenv from "dotenv";
dotenv.config();

import chalk from "chalk";
console.log(
    chalk.cyan("Starting Salim Bot ") +
        chalk.magenta(process.env.npm_package_version) +
        "✨✨"
);

import {
    AboutFramework,
    Console,
    ComputedLoader,
    DataLoader,
    MultiLoader,
    OnlineLoader,
    SBotClient,
    Response,
    sLogger,
} from "s-bot-framework";

const client = new SBotClient({ token: process.env.DISCORD_TOKEN });

const keywords = new DataLoader("data/keywords.json", "ชังชาติ");
const localquotes = new DataLoader("data/morequotes.json", "วาทกรรมสลิ่ม");
const awesome_salim_quotes = new OnlineLoader(
    "https://watasalim.vercel.app/api/quotes",
    "quotes",
    (t: any) => t.body
);

const combinedQuotes = new MultiLoader([
    { loader: localquotes, label: "Local Quote" },
    {
        loader: awesome_salim_quotes,
        label: "Awesome Salim Quotes",
    },
]);

const facebook = new DataLoader(
    "data/facebook.json",
    "คนรักสถาบัน",
    (t: any) =>
        `ดิฉันแนะนำให้คุณไปติดตาม ${t.name} นะ เพื่อคุณจะได้ตาสว่าง ${t.url}`
);

client.useResponse(
    new Response({
        trigger: { mention: true, keywords: ["แนะนำตัว"] },
        response: {
            loader: new ComputedLoader(
                () =>
                    `ส วั ส ดี ค รั บ ท่านสมาชิกชมรมคนชอบกะสัสทุกท่าน กระผมสลิ่มบอท เวอร์ชั่น ${
                        process.env.npm_package_version
                    }\nรันอยู่บน ${AboutFramework()}`
            ),
            reply: true,
        },
    })
);

client.useResponse(
    new Response({
        trigger: { mention: true, keywords: ["fb", "เฟส", "facebook"] },
        response: {
            loader: facebook,
            reply: true,
        },
    })
);

const ชังชาติ = new Response({
    trigger: { keywords },
    response: {
        loader: combinedQuotes,
        react: "😡",
    },
});

client.useResponse(
    new Response({
        trigger: { mention: true, keywords: ["ผิด"] },
        response: {
            loader: new ComputedLoader(
                () =>
                    `พวกคุณผิดที่พูดคำว่า ${ชังชาติ.triggered} ถือเป็นการคุกคามสถาบันอย่างยิ่ง`
            ),
            reply: true,
        },
    })
);

client.useResponse(ชังชาติ);

client.useActivity({
    type: "PLAYING",
    name: `Salim Bot ${process.env.npm_package_version}`,
});

const ctrlConsole = new Console(client);

client.useConsole(ctrlConsole);

sLogger.log("async setup done!");
