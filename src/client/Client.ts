// * Client.ts : Heart of the Bot

import { Client, Message } from "discord.js";

import Activity from "./Activity";
import Logger from "../utils/Logger";
import Response from "../responses/Response";

export default class BotClient extends Client {
    last_message?: Message;
    private _current_activity = 1;

    get current_activity(): number {
        return this._current_activity;
    }

    constructor() {
        super();
        this.on("ready", () => {
            Logger.log(`=====> Successfully logged in as ${this.user?.tag} <=====`, "SUCCESS", false);
            this.setBotActivity(1);
        });
        this.on("error", console.warn);

        this.setInterval(() => {
            this.setBotActivity(this.current_activity, false);
        }, 30 * 1000);
    }

    async setBotActivity(activityID?: number, dolog = true): Promise<void> {
        if (Activity.activities.length <= 1)
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
        dolog && Logger.log(`Set Activity to ${activity.type} ${activity.name} (#${activityID + 1})`);

        this._current_activity = activityID + 1;
    }

    async attemptLogin(): Promise<void> {
        if (process.env.DISCORD_TOKEN) {
            this.login(process.env.DISCORD_TOKEN);
            Logger.log("Attempting Login...", "NORMAL", false);
        }
        else {
            Logger.log("No DISCORD_TOKEN Found! Please put it in .env", "ERROR", false);
            this.destroy();
            process.exit(1);
        }
    }

    implementsResponse(handler: Response): void {
        this.on("message", (msg: Message) => {
            this.last_message = msg;
            try {
                handler.getFunction(this)(msg);
            }
            catch (err) {
                Logger.log(`ERROR On Processing Message: ${err}`, "ERROR");
            }
        });
    }
}
