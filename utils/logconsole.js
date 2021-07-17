// * Function for logging console neatly

let getFormattedTime = require("./time.js")
const fs = require("fs")
const chalk = require("chalk")
const bot_settings_log = require("../bot_settings.json").do_log

let initstr = `Created at ${getFormattedTime()}\n\n`
let initfname = `${getFormattedTime(true)}.txt`

if (bot_settings_log) {
    fs.writeFile(`./log/${initfname}`, initstr, (err) => {
        if (err)
            console.log(chalk.red(`[LOG ERROR] Error on initing file: ${err}`))
        console.log("[FILE SUCCESS] Log File Inited")
    })
}

function logconsole(logmsg, status = "Normal") {
    let logstr = `[${getFormattedTime()}][${status}] ${logmsg}`

    // * Color Source: https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
    if (status.includes("ERROR"))
        console.log(chalk.red(logstr))
    else if (status.includes("WARNING"))
        console.log(chalk.yellow(logstr))
    else
        console.log(logstr)

    if (bot_settings_log)
        fs.appendFile(`./log/${initfname}`, logstr + "\n", (err) => {
            if (err)
                console.log(`[LOG ERROR] Error on writing log file: ${err}`)
        })
}

module.exports = logconsole