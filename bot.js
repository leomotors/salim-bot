// * Main Program, run this

// * Setup process
const Discord = require("discord.js")
const client = new Discord.Client()
const auth = require("./auth.json")

// * Pull Quote from Github
let plaintxt = ""
let quoteArray = []
const request = require("request")

request({
    url: "https://raw.githubusercontent.com/narze/awesome-salim-quotes/main/README.md",
    json: false
}, (err, response, body) => {
    plaintxt = body
    let txtarray = plaintxt.split(/\r?\n/)
    for (const index in txtarray) {
        line = txtarray[index]
        if (line.startsWith("-")) {
            quoteArray.push(line.slice(2))
        }
    }
    console.log("SalimQuote.js/ getQuote(): Successfully pulled quote data")
})

// * Log if successfully logged in
client.on("ready", () => {
    console.log(`Successfully loggged in as ${client.user.tag}.`)
})

// * If recieve message, process it
client.on("message", eval)

// * Login
client.login(auth.token);

function eval(msg) {
    if (msg.author.id == 827812132242325504) {
        // * It's your own message!
        return
    }

    if (msg.mentions.has(client.user)) {
        if (msg.content.includes("แนะนำตัว")) {
            logconsole("Introduced myself")
            msg.channel.send(introduceMyself())
            return
        }
    }

    logconsole(`Recieve message from ${msg.author.username} : ${msg.content}`)
    if (msg.content.includes("สลิ่ม")) {
        let tosentmsg = randomQuote()
        msg.channel.send(`${tosentmsg}`)
        logconsole(`Sent message : ${tosentmsg}`)
    }
}

function randomQuote() {
    let randIndex = Math.floor(Math.random() * quoteArray.length)
    return quoteArray[randIndex]
}

function logconsole(logmsg, status = "Normal") {
    console.log(`[${getFormattedTime()}][${status}] ${logmsg}`)
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

function introduceMyself() {
    let istr = `ซาหวาาดีคร้าบ ท่านสมาชิกชมรมคนชอบกะสัส\nผมเป็นสลิ่ม\nสามารถไปแงะสมองของผมได้ที่https://github.com/Leomotors/Salim-Bot`
    return istr
}