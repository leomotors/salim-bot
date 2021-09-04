// * Client.ts : Heart of the Bot

import { Client, Message } from "discord.js";
import * as fs from "fs";

import { Logger } from "../utils/Logger";
import { PackageInfo } from "../constants/PackageInfo";
import { Response } from "../responses/Response";

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

    async attemptLogin(filepath: string): Promise<void> {
        try {
            const authjs: Buffer = fs.readFileSync(filepath);
            const token: string = JSON.parse(authjs.toString()).token;
            this.login(token);
            Logger.log("Successfully grabbed token and have attempt login", "NORMAL", false);
        }
        catch (err) {
            Logger.log(`Error Occured at Login Process: ${err}`, "ERROR", false);
            Logger.log("Have you put your token in ./config/auth.json? Read instructions for more info", "WARNING", false);
            this.destroy();
            process.exit(1);
        }
    }

    implementsResponse(handler: Response): void {
        this.on("message", (msg: Message) => {
            handler.getFunction(this)(msg);
        });
    }
}
