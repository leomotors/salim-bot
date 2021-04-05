// * Main Program, run this with nodejs

// * Import data from other file
const auth = require("./auth.json")
const salimDict = require("./keywords.json")
const moreWord = require("./morequotes.json")
const songList = require("./ytlink.json")
const getFormattedTime = require("./time.js")

// * Init Variable
let plaintxt = ""
let quoteArray = []
let lastchannel = undefined
let RoyalSongArray = songList.เทิดทูนสถาบัน

// * Import วาทกรรมสลิ่ม from narze's repo
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
    console.log("[DATA FETCHED] Successfully pulled quote data from narze's repository")
})

// * Add more วาทกรรมสลิ่ม from morequotes.json
for (let word of moreWord.วาทกรรมสลิ่ม) {
    quoteArray.push(word)
}
console.log("[DATA FETCHED] Successfully pulled quote data from morequotes.json")

// * Discord Zone: Define on_setup() and Login
const Discord = require("discord.js")
const client = new Discord.Client()
client.on("ready", () => {
    console.log(`[BOT READY] Successfully logged in as ${client.user.tag}.`)
})

client.login(auth.token);

// * On recieving message, process it
client.on("message", eval)
function eval(msg) {
    lastchannel = msg.channel
    if (msg.author.id == client.user.id) {
        // * It's your own message!
        return
    }

    logconsole(`Recieve message from ${msg.author.tag} : ${msg.content}`)

    if (msg.mentions.has(client.user)) {
        if (msg.content.includes("แนะนำตัว")) {
            logconsole("Introduced myself")
            msg.channel.send(introduceMyself())
            return
        }
        if (msg.content.includes("เพลง")) {
            let musicurl = randomSong()
            msg.channel.send(`${musicurl}`)
            logconsole(`Sent music : ${musicurl}`)
            return
        }
    }

    if (isชังชาติ(msg)) {
        let tosentmsg = randomQuote()
        msg.channel.send(`${tosentmsg}`)
        logconsole(`Sent message : ${tosentmsg}`)
    }
}

// * All other support function
function randomQuote() {
    let randIndex = Math.floor(Math.random() * quoteArray.length)
    return quoteArray[randIndex]
}

function randomSong() {
    let randIndex = Math.floor(Math.random() * RoyalSongArray.length)
    return RoyalSongArray[randIndex]
}

function logconsole(logmsg, status = "Normal") {
    console.log(`[${getFormattedTime()}][${status}] ${logmsg}`)
}

function introduceMyself() {
    let istr = `ซาหวาาดีคร้าบ ท่านสมาชิกชมรมคนชอบกะสัส\nผมเป็นสลิ่ม\nสามารถไปแงะสมองของผมได้ที่ https://github.com/Leomotors/Salim-Bot\nอย่าลืมไปกดให้ดาวด้วยน้า เดี๋ยวเจ้าของผมงอน`
    return istr
}

function isชังชาติ(msg) {
    for (let word of salimDict.ชังชาติ) {
        if (msg.content.includes(word)) {
            logconsole(`isชังชาติ : Detected "${word}"`)
            return true
        }
    }
    return false
}


// * Debug น้อน
const readline = require("readline")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (input) => {
    debug(input)
});

function debug(commandstr) {
    let command = commandstr.split(" ")
    switch (command[0]) {
        case "quote":
            lastchannel.send(quoteArray[command[1]])
            logconsole(`quote : Sent quote #${command[1]}`, "DEBUG")
            return
        case "say":
            let arr = commandstr.slice(4)
            lastchannel.send(arr)
            logconsole(`say : Sent message ${arr}`, "DEBUG")
            return
    }
}

// * End of code -> Setup complete
console.log("[SETUP COMPLETED] All Imports, Events, Functions are set")