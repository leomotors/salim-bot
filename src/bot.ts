/**
 * * bot.ts -> Main of Bot (Run this with npm start)
 */

import { Client, Message } from "discord.js";
import { BotClient } from "./core/Client";

import { Detector } from "./core/Detector";
import { Quotes } from "./core/Quotes";
import { Logger } from "./utils/Logger";
import { PackageInfo } from "./constants/PackageInfo";

import * as fs from "fs";

const detector = new Detector();
const quotes = new Quotes({});

Logger.construct();
PackageInfo.construct();

const client: Client = new BotClient({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"] });

try {
    const authjs: Buffer = fs.readFileSync("./config/auth.json");
    const token: string = JSON.parse(authjs.toString()).token;
    client.login(token);
    Logger.log("Successfully grabbed token and have attempt login", "NORMAL", false);
}
catch (err) {
    Logger.log(`Error Occured at Login Process: ${err}`, "ERROR", false);
    Logger.log("Have you put your token in ./config/auth.json? Read instructions for more info", "WARNING", false);
    client.destroy();
    process.exit(1);
}

client.on("messageCreate", onMessage);

function onMessage(msg: Message) {
    if (msg.author == client.user) {
        // * Own Message
        return;
    }

    Logger.log(`Incoming Message from ${msg.author.tag} : ${msg.content}`);

    if (detector.isชังชาติ(msg.content)) {
        Logger.log(`ชังชาติ detector detected ${detector.last_detected}`);
        const quote = quotes.getQuote();
        msg.channel.send(`${quote.quote} (${quote.id.type} #${quote.id.id})`);
        return;
    }
}

Logger.log("[SETUP COMPLETE] bot.ts control flow ended.", "SUCCESS", false);
