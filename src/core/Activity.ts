// * Activity.ts : Take care of Bot Presence

import * as fs from "fs";

export default class Activity {
    static activities = {};

    static async construct(): Promise<void> {
        const buffer = fs.readFileSync("./activity.json");
        this.activities = JSON.parse(buffer.toString());
    }
}
