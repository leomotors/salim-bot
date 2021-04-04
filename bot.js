// * Main Program, run this

// * Setup process
const Discord = require("discord.js")
const client = new Discord.Client()
const auth = require("./auth.json")

const salimDict = require("./keywords.json")
const moreWord = require("./morequotes.json")
const songList = require("./ytlink.json")

let RoyalSongArray = songList.เทิดทูนสถาบัน

// * Pull Quote from Github
let plaintxt = ""
let quoteArray = []

// * Add วาทกรรมสลิ่ม from narze's repo
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

// * Log if successfully logged in
client.on("ready", () => {
    console.log(`[READY] Successfully logged in as ${client.user.tag}.`)
})

// * If recieve message, process it
client.on("message", eval)

// * Login
client.login(auth.token);

function eval(msg) {
    if (msg.author.id == client.user.id) {
        // * It's your own message!
        return
    }

    logconsole(`Recieve message from ${msg.author.tag} : ${msg.content}`)

    if (msg.content.startsWith("!debug")) {
        if (msg.author.id == auth.ownerid) {
            debug(msg)
        }
        else{
            msg.channel.send("Only owner can do this!")
        }
    }

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

    if (isChangChard(msg)) {
        let tosentmsg = randomQuote()
        msg.channel.send(`${tosentmsg}`)
        logconsole(`Sent message : ${tosentmsg}`)
    }
}

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
    let istr = `ซาหวาาดีคร้าบ ท่านสมาชิกชมรมคนชอบกะสัส\nผมเป็นสลิ่ม\nสามารถไปแงะสมองของผมได้ที่ https://github.com/Leomotors/Salim-Bot\nอย่าลืมไปกดให้ดาวด้วยน้า เดี๋ยวเจ้าของผมงอน`
    return istr
}

function isChangChard(msg) {
    for (let word of salimDict.ชังชาติ) {
        if (msg.content.includes(word)) {
            return true
        }
    }
    return false
}

// * Debug น้อน
function debug(msg) {
    let msgcomponent = msg.content.split(" ")
    if (msgcomponent[1] == "quote"){
        msg.channel.send(quoteArray[msgcomponent[2]])
        logconsole(`Sent quote #${msgcomponent[2]}`,"DEBUG")
    }
}