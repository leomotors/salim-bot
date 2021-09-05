// * ConsoleQuery.ts : Query in Console

import DJSalima from "../core/DJSalima";
import Logger from "../utils/Logger";

export default class ConsoleQuery {
    static Query(query: string[]): void {
        if (!query[0]) {
            Logger.log("[CONSOLE QUERY WARNING] Where query?", "WARNING");
            return;
        }
        switch ((query[0]).toLowerCase()) {
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
