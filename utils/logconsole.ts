// * Function for logging console neatly

import { getFormattedTime } from "./time.js"
import { writeFile, appendFile } from "fs"
import { yellow, red } from "chalk"
import { do_log } from "../bot_settings.json"

let initstr = `Created at ${getFormattedTime()}\n\n`
let initfname = `${getFormattedTime(true)}.txt`

if (do_log) {
    writeFile(`./log/${initfname}`, initstr, (err: Error) => {
        if (err)
            console.log(red(`[LOG ERROR] Error on initing file: ${err}`))
        console.log("[FILE SUCCESS] Log File Inited")
    })
}

export function logconsole(logmsg: string, status = "Normal") {
    let logstr = `[${getFormattedTime()}][${status}] ${logmsg}`

    // * Color Source: https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
    if (status.includes("ERROR") || status.includes("EXCEPTION"))
        console.log(red(logstr))
    else if (status.includes("WARNING"))
        console.log(yellow(logstr))
    else
        console.log(logstr)

    if (do_log)
        appendFile(`./log/${initfname}`, logstr + "\n", (err: Error) => {
            if (err)
                console.log(`[LOG ERROR] Error on writing log file: ${err}`)
        })
}
