// * Salim Bot: Bot that is running in my group's server 24/7
// * Great Example for S-Bot Framework

// * Some Nice Welcome Text
import chalk from "chalk";
console.log(
    chalk.cyan("Starting Salim Bot ") +
        chalk.magenta(process.env.npm_package_version) +
        "✨✨"
);

// * Import used Stuff
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
import { ActivityLoader } from "s-bot-framework/dist/data/activityLoader";

// * Create Client, token is automatically grabbed from process.env.DISCORD_TOKEN
// * Make sure you added your token in .env
const client = new SBotClient();

// * Load Stuff from Files & Online Source
const keywords = new DataLoader("data/keywords.json", "ชังชาติ");
const localquotes = new DataLoader("data/morequotes.json", "วาทกรรมสลิ่ม");
const awesome_salim_quotes = new OnlineLoader(
    "https://watasalim.vercel.app/api/quotes",
    "quotes",
    (t) => t.body
);
const facebook = new DataLoader(
    "data/facebook.json",
    "คนรักสถาบัน",
    (t) => `ดิฉันแนะนำให้คุณไปติดตาม ${t.name} นะ เพื่อคุณจะได้ตาสว่าง ${t.url}`
);

// * Combined multiple data into One Category
const combinedQuotes = new MultiLoader([
    {
        loader: localquotes,
        label: "Local Quotes",
    },
    {
        loader: awesome_salim_quotes,
        label: "Awesome Salim Quotes",
    },
]);

// * Response on Keywords
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
            audio: true,
        },
    })
);

client.useResponse(
    new Response({
        trigger: { mention: true, keywords: ["fb", "เฟส", "facebook"] },
        response: {
            loader: facebook,
            reply: true,
            audio: true,
        },
    })
);

// * Create Response Variable to get data of triggered words
const ชังชาติ = new Response({
    trigger: { keywords },
    response: {
        loader: combinedQuotes,
        react: "😡",
        audio: true,
    },
});

client.useResponse(ชังชาติ);

client.useResponse(
    new Response({
        trigger: { mention: true, keywords: ["ผิด"] },
        response: {
            loader: new ComputedLoader(
                () =>
                    `พวกคุณผิดที่พูดคำว่า ${ชังชาติ.triggered} ถือเป็นการคุกคามสถาบันอย่างยิ่ง`
            ),
            reply: true,
            audio: true,
        },
    })
);

// * Bot Activity
client.useComputedActivity({
    type: "PLAYING",
    name: `Salim Bot ${process.env.npm_package_version}`,
});
client.useActivities(new ActivityLoader("data/activity.json", "activities"));

// * Console, used to logout properly
const ctrlConsole = new Console(client);

// * Add Loaders to Console to be able to reload while bot is runnin
ctrlConsole.addLoader(keywords, localquotes, awesome_salim_quotes, facebook);
client.useConsole(ctrlConsole);

// * Use Voice in Corgi Swift Jutsu Mode
client.useVoice({
    jutsu: "CorgiSwift",
});

// * Done! That's it required for this bot!
sLogger.log("✨✨ Async Setup Done!", "SUCCESS");
