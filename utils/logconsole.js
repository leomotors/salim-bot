// * Function for logging console neatly

let getFormattedTime = require("./time.js")
const fs = require("fs")

let initstr = `Created at ${getFormattedTime()}\n\n`

fs.writeFile("./temp/log.txt", initstr, (err) => {
    if (err)
        console.log(`[LOG ERROR] Error on initing file: ${err}`)
    console.log("[FILE SUCCESS] Log File Inited")
})

function logconsole(logmsg, status = "Normal") {
    let logstr = `[${getFormattedTime()}][${status}] ${logmsg}`
    console.log(logstr)
    fs.appendFile("./temp/log.txt", logstr+"\n", (err) => {
        if (err)
            console.log(`[LOG ERROR] Error on writing log file: ${err}`)
    })
}

module.exports = logconsole