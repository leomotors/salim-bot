// * Function for logging console neatly

let getFormattedTime = require("./time.js")

function logconsole(logmsg, status = "Normal") {
    console.log(`[${getFormattedTime()}][${status}] ${logmsg}`)
}

module.exports = logconsole