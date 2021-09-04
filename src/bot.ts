/**
 * * bot.ts -> Main of Bot (Run this with npm start)
 */

import { BotClient } from "./client/Client";
import { Console } from "./console/Console";
import { Detector } from "./core/Detector";
import { Quotes } from "./core/Quotes";
import { Logger } from "./utils/Logger";
import { PackageInfo } from "./constants/PackageInfo";
import { MessageHandler } from "./responses/MessageHandler";

// * Initialize Begin
Detector.construct();
Quotes.construct();

Logger.construct();
PackageInfo.construct();

const client: BotClient = new BotClient();
const msgHandler = new MessageHandler();

Console.construct(client);
// * Initialize End

client.attemptLogin("./config/auth.json");
client.implementsMessageHandler(msgHandler);

Logger.log("[SETUP COMPLETE] bot.ts control flow ended.", "SUCCESS", false);
