// * Function for logging console neatly

import { getFormattedTime } from "./time"
import fs from "fs"
import chalk from "chalk"
import { do_log } from "../../bot_settings.json"

let initstr = `Created at ${getFormattedTime()}\n\n`
let initfname = `${getFormattedTime(true)}.txt`

if (do_log) {
    fs.writeFile(`./log/${initfname}`, initstr, (err: Error) => {
        if (err)
            console.log(chalk.red(`[LOG ERROR] Error on initing file: ${err}`))
        console.log("[FILE SUCCESS] Log File Inited")
    })
}

export function logconsole(logmsg: string, status = "Normal") {
    let logstr = `[${getFormattedTime()}][${status}] ${logmsg}`

    // * Color Source: https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
    if (status.includes("ERROR") || status.includes("EXCEPTION"))
        console.log(chalk.red(logstr))
    else if (status.includes("WARNING"))
        console.log(chalk.yellow(logstr))
    else
        console.log(logstr)

    if (do_log)
        fs.appendFile(`./log/${initfname}`, logstr + "\n", (err: Error) => {
            if (err)
                console.log(chalk.red(`[LOG ERROR] Error on writing log file: ${err}`))
        })
}
