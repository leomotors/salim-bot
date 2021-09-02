/**
 * * bot.ts -> Main of Bot (Run this with npm start)
 */

import { Client, Message } from "discord.js";

import { Detector } from "./core/Detector";
import { Quotes } from "./core/Quotes";

import * as fs from "fs";

const detector = new Detector();
const quotes = new Quotes({});

const client: Client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"] });

client.on("ready", () => {
    console.log(`Successfully logged in as ${client.user?.tag}`);
});

try {
    const authjs: Buffer = fs.readFileSync("./auth.json");
    const token: string = JSON.parse(authjs.toString()).token;
    client.login(token);
    console.log("Successfully grabbed token and have attempt login");
}
catch (err) {
    console.log(`Error Occured: ${err}`);
}

client.on("messageCreate", onMessage);

function onMessage(msg: Message) {
    if (msg.author == client.user) {
        // * Own Message
        return;
    }

    console.log(`Incoming Message from ${msg.author.tag} : ${msg.content}`);

    if (detector.isชังชาติ(msg.content)) {
        console.log(`ชังชาติ detector detected ${detector.last_detected}`);
        const quote = quotes.getQuote();
        msg.channel.send(`${quote.quote} (${quote.id.type} #${quote.id.id})`);
        return;
    }
}

console.log("[SETUP COMPLETE] bot.ts control flow ended.");
