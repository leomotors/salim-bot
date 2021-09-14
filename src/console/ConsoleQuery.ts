// * ConsoleQuery.ts : Query in Console

import Activity from "../client/Activity";
import DJSalima from "../core/DJSalima";
import Logger from "../utils/Logger";

export default class ConsoleQuery {
    static Query(query: string[]): string | null | undefined {
        if (!query[0]) {
            Logger.log("[CONSOLE QUERY WARNING] Where query?", "WARNING");
            return;
        }
        switch ((query[0]).toLowerCase()) {
            case "activity":
                {
                    let outstr = `There is ${Activity.activities.length} Activities\n`;
                    let id = 1;
                    for (const activity of Activity.activities) {
                        outstr += `#${id} => ${activity.type} ${activity.name}\n`;
                        id++;
                    }
                    Logger.log("[CONSOLE QUERY] Query for Activity completed");
                    return outstr;
                }
            case "music":
                {
                    let outstr = `There is ${DJSalima.Musics.length} Musics\n`;
                    let id = 1;
                    for (const music of DJSalima.Musics) {
                        outstr += `#${id} [${music.category}] => ${music.name}\n`;
                        id++;
                    }
                    Logger.log("[CONSOLE QUERY] Query for Music completed");
                    return outstr;
                }
            default:
                Logger.log(`[CONSOLE QUERY WARNING] No such query "${query[0].toLowerCase()}"`, "WARNING");
        }
    }
}
