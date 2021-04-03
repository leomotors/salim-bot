// * Main Program, run this

// * Setup process
const Discord = require("discord.js")
const client = new Discord.Client()
const auth = require("./auth.json")

// * Log if successfully logged in
client.on("ready", () => {
    console.log(`Successfully loggged in as ${client.user.tag}.`)
})

// * If recieve message, process it
client.on("message", eval)

client.login(auth.token);

function eval(msg) {
    if (msg.content === "สลิ่ม") {
        msg.channel.send("Hello!")
        logconsole("Sent message")
    }
}

function logconsole(logmsg, status = "normal") {

    console.log(`[${getFormattedTime()}][Normal] ${logmsg}`)
}

function getFormattedTime() {
    function addZero(num) {
        if (num < 10) {
            return `0${num}`
        }
        else {
            return `${num}`
        }
    }
    let d = new Date()
    let year = d.getFullYear()
    let month = d.getMonth() + 1
    let day = d.getDate()
    let hour = d.getHours()
    let min = d.getMinutes()
    let sec = d.getSeconds()
    let formattedDate = `${year}-${addZero(month)}-${addZero(day)} ${addZero(hour)}:${addZero(min)}:${addZero(sec)}`
    return formattedDate
}