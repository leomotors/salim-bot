// * Console.ts : Debug Console Controller

import readline from "readline";

import BotClient from "../client/Client";
import ConsoleQuery from "./ConsoleQuery";
import DJSalima from "../core/DJSalima";
import Import from "../import/Import";
import Voice from "../core/Voice";
import Logger from "../utils/Logger";

export default class Console {
    static interface: readline.Interface;
    static client: BotClient;

    static construct(client: BotClient): void {
        Console.client = client;
        Console.interface = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        Console.interface.on("line", Console.onCommand);
    }

    static onCommand(command: string): void {
        const commands = command.split(" ");

        switch (commands[0].toLowerCase()) {
            case "activity":
                {
                    const index = parseInt(commands[1]);
                    Console.client.setBotActivity(index);
                    break;
                }
            case "music":
                {
                    if (!Voice.resolveConnection()) {
                        Logger.log("[CONSOLE WARNING] No Voice Connection to play music!", "WARNING");
                        return;
                    }

                    const index = parseInt(commands[1]) - 1;
                    if (isNaN(index) || index < 0 || index >= DJSalima.Musics.length) {
                        Logger.log(`[CONSOLE WARNING] Music Index of ${commands[1]} is invalid`, "WARNING");
                        return;
                    }

                    DJSalima.play(DJSalima.Musics[index], index);
                    Logger.log(`[CONSOLE] Attempt to play music #${index + 1}`);
                    break;
                }
            case "reload":
                Import(true);
                Logger.log("[CONSOLE] Reload completed");
                break;
            case "query":
                ConsoleQuery.Query(commands.slice(1));
                break;
            case "logout":
                Console.client.destroy();
                Logger.log("Successfully logged out", "SUCCESS");
                process.exit(0);
                break; // * Break because eslint complain me even it is unreachable
            default:
                Logger.log(`[CONSOLE WARNING] No such command "${commands[0]}"`, "WARNING");
        }
        return;
    }
}
