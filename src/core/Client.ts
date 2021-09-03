// * Client.ts : Heart of the Bot

import { Client, ClientOptions } from "discord.js";

import { Logger } from "../utils/Logger";
import { PackageInfo } from "../constants/PackageInfo";

export class BotClient extends Client {
    constructor(options: ClientOptions) {
        super(options);
        this.on("ready", () => {
            Logger.log(`=====> Successfully logged in as ${this.user?.tag} <=====`, "SUCCESS", false);
            this.user?.setActivity({
                "name": `Salim Bot ${PackageInfo.pkg_version}`,
                "type": "PLAYING"
            });
        });
    }
}
