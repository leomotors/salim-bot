/**
 * * bot.ts -> Main of Bot (Run this with npm start)
 */

import BotClient from "./client/Client";
import Console from "./console/Console";
import Import from "./import/Import";
import Logger from "./utils/Logger";
import Response from "./responses/Response";

// * Initialize Begin
Import();

Logger.construct();

const client: BotClient = new BotClient();
const msgHandler = new Response();

Console.construct(client);
// * Initialize End

client.attemptLogin("./config/auth.json");
client.implementsResponse(msgHandler);

Logger.log("[SETUP COMPLETE] bot.ts control reach the end of file", "SUCCESS", false);
