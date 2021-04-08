// * Function for logging console neatly

let getFormattedTime = require("./time.js")
const fs = require("fs")
const bot_settings_log = require("../bot_settings.json").do_log

let initstr = `Created at ${getFormattedTime()}\n\n`
let initfname = `${getFormattedTime(true)}.txt`

if (bot_settings_log) {
    fs.writeFile(`./log/${initfname}`, initstr, (err) => {
        if (err)
            console.log(`[LOG ERROR] Error on initing file: ${err}`)
        console.log("[FILE SUCCESS] Log File Inited")
    })
}

function logconsole(logmsg, status = "Normal") {
    let logstr = `[${getFormattedTime()}][${status}] ${logmsg}`
    console.log(logstr)
    if (bot_settings_log)
        fs.appendFile(`./log/${initfname}`, logstr + "\n", (err) => {
            if (err)
                console.log(`[LOG ERROR] Error on writing log file: ${err}`)
        })
}

module.exports = logconsole