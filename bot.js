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
    console.log("SalimQuote.js/ getQuote(): Successfully pulled quote data from narze's repository")
})

// * Add more วาทกรรมสลิ่ม from morewords.json
for (let word of moreWord.วาทกรรมสลิ่ม) {
    quoteArray.push(word)
}

// * Log if successfully logged in
client.on("ready", () => {
    console.log(`Successfully logged in as ${client.user.tag}.`)
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

    logconsole(`Recieve message from ${msg.author.username} : ${msg.content}`)

    if (msg.mentions.has(client.user)) {
        if (msg.content.includes("แนะนำตัว")) {
            logconsole("Introduced myself")
            msg.channel.send(introduceMyself())
            return
        }
        if (msg.content.includes("เปิดเพลง")) {
            let tosentmsg = randomSong()
            msg.channel.send(`${tosentmsg}`)
            logconsole(`Sent music : ${tosentmsg}`)
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
