// * Logger.ts : Take care of Logging on both console and file

import { getFormattedTime } from "./Time";

import chalk from "chalk";
import * as fs from "fs";

type LogStatus = "NORMAL" | "WARNING" | "ERROR" | "SUCCESS";

export class Logger {
    static file_path: string;
    static file_status = false;

    static construct(): void {
        Logger.file_path = `./log/${getFormattedTime(true)}.txt`;
        try {
            fs.writeFileSync(Logger.file_path, `Created at ${getFormattedTime()}\n\n`);
            Logger.file_status = true;
        }
        catch (err) {
            Logger.log(`Logger @ constructor: ${err}`);
        }
    }

    static log(message: string, status: LogStatus = "NORMAL", showTime = true): void {
        const logmsg = `${showTime ? `[${getFormattedTime()}] ` : ""}${message}`;

        if (Logger.file_status) {
            fs.appendFileSync(Logger.file_path, logmsg + "\n");
        }

        if (status == "NORMAL")
            console.log(logmsg);
        else if (status == "WARNING")
            console.log(chalk.yellow(logmsg));
        else if (status == "ERROR")
            console.log(chalk.red(logmsg));
        else if (status == "SUCCESS")
            console.log(chalk.green(logmsg));
        else
            console.log(chalk.red(`Logger @ log ERROR: Unknown status of ${status}! Blame TypeScript!`));
    }
}
