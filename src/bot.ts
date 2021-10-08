import dotenv from "dotenv";
dotenv.config();

import {
    Console,
    ComputedLoader,
    DataLoader,
    MultiLoader,
    OnlineLoader,
    SBotClient,
    StaticLoader,
    Response,
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

client.useResponse(
    new Response({
        trigger: { mention: true, keywords: ["แนะนำตัว"] },
        response: {
            loader: new StaticLoader(["I'm gay"]),
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

const console = new Console(client);

client.useConsole(console);

client.log("async setup done!");
