// * Console.ts : Debug Console Controller

import readline from "readline";

import BotClient from "../client/Client";
import Logger from "../utils/Logger";

export default class Console {
    static interface: readline.Interface;
    static client: BotClient;

    static construct(client: BotClient): void {
        Console.client = client;
        this.interface = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        Console.interface.on("line", Console.onCommand);
    }

    static onCommand(command: string): void {
        const commands = command.split(" ");

        switch (commands[0]) {
            case "logout":
                Console.client.destroy();
                Logger.log("Successfully logged out", "SUCCESS");
                process.exit(0);
                break;
            default:
                Logger.log(`Unknown Command: ${commands[0]}`, "ERROR");
        }
        return;
    }
}