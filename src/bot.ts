/**
 * * bot.ts -> Main of Bot (Run this with npm start)
 */

import { Message } from "discord.js";
import * as fs from "fs";

import { BotClient } from "./client/Client";
import { Console } from "./console/Console";
import { Detector } from "./core/Detector";
import { Quotes } from "./core/Quotes";
import { Logger } from "./utils/Logger";
import { PackageInfo } from "./constants/PackageInfo";
import { Voice } from "./core/Voice";

// * Construct Begin
const detector = new Detector();
const quotes = new Quotes({});

Logger.construct();
PackageInfo.construct();
//Voice.construct();
// * Construct End

const client: BotClient = new BotClient();

Console.construct(client);

// * Login Begin
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
// * Login End

client.on("message", onMessage);

function onMessage(msg: Message) {
    if (msg.author == client.user) {
        // * Own Message
        return;
    }

    Logger.log(`Incoming Message from ${msg.author.tag} : ${msg.content}`);

    if (msg.content.startsWith("!salim")) {
        if (msg.member) {
            // * This is always true but in case some error did happen
            Voice.joinTo(msg.member);
        }
        else {
            Logger.log("message.member is null or undefined", "WARNING");
        }
        return;
    }

    if (detector.isชังชาติ(msg.content)) {
        Logger.log(`ชังชาติ detector detected ${detector.last_detected}`);
        const quote = quotes.getQuote();
        msg.channel.send(`${quote.quote} (${quote.id.type} #${quote.id.id})`);
        Voice.tts(quote.quote);
        return;
    }
}

Logger.log("[SETUP COMPLETE] bot.ts control flow ended.", "SUCCESS", false);
