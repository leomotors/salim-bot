/**
 * * bot.ts -> Main of Bot (Run this with npm start)
 */

import BotClient from "./client/Client";
import Console from "./console/Console";
import Import from "./import/Import";
import Logger from "./utils/Logger";
import Response from "./responses/Response";

import dotenv from "dotenv";
dotenv.config();

// * Initialize Begin
Import();

Logger.construct();

const client: BotClient = new BotClient();
const msgHandler = new Response();

Console.construct(client);
// * Initialize End

client.attemptLogin();
client.implementsResponse(msgHandler);

Logger.log("[SYNC SETUP COMPLETE] bot.ts control reach the end of file", "SUCCESS", false);
