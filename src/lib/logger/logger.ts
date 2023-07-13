import chalk from "chalk";
import fs from "fs/promises";
import stripAnsi from "strip-ansi";

import { getFormattedTime } from "./time.js";

export type LogStatus = "NORMAL" | "WARNING" | "ERROR" | "SUCCESS" | "SPECIAL";

export abstract class sLogger {
  private static file_path: string;
  private static file_status = false;

  static async startFile(file_path: string | undefined) {
    if (!file_path) {
      sLogger.file_status = false;
      return;
    }

    const actual_path = `${file_path}/${getFormattedTime(true)}.txt`;
    sLogger.file_path = actual_path;

    try {
      await fs.writeFile(
        actual_path,
        `Created at ${getFormattedTime()}\n` +
          `Bot Version: ${process.env.npm_package_version}\n\n`,
      );
      sLogger.file_status = true;
    } catch (err) {
      sLogger.log(
        `Error initializing Log File: ${err}
            Please make sure you have directory ${file_path} created`,
        "ERROR",
      );
    }
  }

  static async log(
    message: string,
    status: LogStatus = "NORMAL",
    showTime = true,
  ) {
    const logmsg = `${showTime ? `[${getFormattedTime()}] ` : ""}${message}`;

    if (sLogger.file_status)
      fs.appendFile(sLogger.file_path, stripAnsi(logmsg) + "\n");

    if (status == "NORMAL") console.log(logmsg);
    else if (status == "WARNING") console.log(chalk.yellow(logmsg));
    else if (status == "ERROR") console.log(chalk.red(logmsg));
    else if (status == "SUCCESS") console.log(chalk.green(logmsg));
    else if (status == "SPECIAL") console.log(chalk.cyan(logmsg));
    else
      console.log(chalk.red(`LOGGER ERROR: Unknown log status of ${status}!`));
  }
}
