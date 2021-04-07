// * Function for logging console neatly

let getFormattedTime = required("./time.js")

function logconsole(logmsg, status = "Normal") {
    console.log(`[${getFormattedTime()}][${status}] ${logmsg}`)
}

module.exports = logconsole