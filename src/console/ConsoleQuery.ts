// * ConsoleQuery.ts : Query in Console

import Activity from "../client/Activity";
import DJSalima from "../core/DJSalima";
import Logger from "../utils/Logger";

export default class ConsoleQuery {
    static Query(query: string[]): void {
        if (!query[0]) {
            Logger.log("[CONSOLE QUERY WARNING] Where query?", "WARNING");
            return;
        }
        switch ((query[0]).toLowerCase()) {
            case "activity":
                {
                    console.log(`There is ${Activity.activities.length} Activities`);
                    let id = 1;
                    for (const activity of Activity.activities) {
                        console.log(`#${id} => ${activity.type} ${activity.name}`);
                        id++;
                    }
                    Logger.log("[CONSOLE QUERY] Query for Activity completed");
                    break;
                }
            case "music":
                {
                    console.log(`There is ${DJSalima.Musics.length} Musics`);
                    let id = 1;
                    for (const music of DJSalima.Musics) {
                        console.log(`#${id} [${music.category}] => ${music.name}`);
                        id++;
                    }
                    Logger.log("[CONSOLE QUERY] Query for Music completed");
                    break;
                }
            default:
                Logger.log(`[CONSOLE QUERY WARNING] No such query "${query[0].toLowerCase()}"`, "WARNING");
        }
    }
}
