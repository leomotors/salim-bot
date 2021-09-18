// * Activity.ts : Take care of Bot Presence

import * as fs from "fs";

import { ActivityOptions } from "discord.js";

import Logger from "../utils/Logger";
import PackageInfo from "../constants/PackageInfo";

const ActivityLoc = "./data/activity.json";

const defaultActivity: ActivityOptions = {
    "name": `Salim Bot ${PackageInfo.pkg_version}`,
    "type": "PLAYING",
    "url": PackageInfo.github
};

export default class Activity {
    static activities: ActivityOptions[] = [];

    static async construct(isReload = false): Promise<void> {
        Activity.activities = [];

        try {
            const buffer = fs.readFileSync(ActivityLoc);
            const activities = JSON.parse(buffer.toString()).activities;
            Activity.activities.push(defaultActivity);

            for (const activity of activities) {
                Activity.activities.push({
                    name: activity.name,
                    type: activity.type,
                    url: activity.url
                });
            }

            Logger.log(`[FETCH COMPLETE] Retrieved ${Activity.activities.length - 1} activites from file`, "SUCCESS", isReload);
        }
        catch (err) {
            Logger.log(`Error Occured while importing activities : ${err}`, "ERROR", isReload);
        }
    }
}
