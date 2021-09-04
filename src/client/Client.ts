// * Client.ts : Heart of the Bot

import { Client } from "discord.js";

import { Logger } from "../utils/Logger";
import { PackageInfo } from "../constants/PackageInfo";

export class BotClient extends Client {
    constructor() {
        super();
        this.on("ready", () => {
            Logger.log(`=====> Successfully logged in as ${this.user?.tag} <=====`, "SUCCESS", false);
            this.user?.setActivity({
                "name": `Salim Bot ${PackageInfo.pkg_version}`,
                "type": "PLAYING",
                "url": "https://github.com/Leomotors/Salim-Bot"
            });
        });
        this.on("error", console.warn);
    }
}
