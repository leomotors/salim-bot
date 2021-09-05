// * Client.ts : Heart of the Bot

import { Client, Message } from "discord.js";
import * as fs from "fs";

import Activity from "./Activity";
import Logger from "../utils/Logger";
import Response from "../responses/Response";

export default class BotClient extends Client {
    constructor() {
        super();
        this.on("ready", () => {
            Logger.log(`=====> Successfully logged in as ${this.user?.tag} <=====`, "SUCCESS", false);
            this.setBotActivity(1);
        });
        this.on("error", console.warn);
    }

    async setBotActivity(activityID?: number): Promise<void> {
        if (Activity.activities.length <= 0)
            await Activity.construct();

        if (!activityID || activityID < 1 || activityID > Activity.activities.length) {
            Logger.log("ID not valid or specified, randoming new one");
            activityID = Math.floor(Math.random() * Activity.activities.length);
        }
        else {
            activityID--;
        }

        const activity = Activity.activities[activityID];
        this.user?.setActivity(activity);
        Logger.log(`Set Activity to ${activity.type} ${activity.name} (#${activityID + 1})`);
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
