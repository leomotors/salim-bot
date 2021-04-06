// * Main Program, run this with nodejs

// * Import data from other file
const auth = require("./auth.json")
const salimDict = require("./assets/json/keywords.json")
const moreWord = require("./assets/json/morequotes.json")
const getFormattedTime = require("./utils/time.js")
const settings = require("./botsettings.json")
const musicList = require("./assets/music/music.json")

// * Import required module
const { exec } = require("child_process")

// * Init Variable
let plaintxt = ""
let quoteArray = []
let lastchannel = undefined
let currVC = undefined
let VCconnection = undefined
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

client.login(auth.token)

// * On recieving message, process it
client.on("message", eval)
function eval(msg) {
    lastchannel = msg.channel
    if (msg.author.id == client.user.id) {
        // * It's your own message!
        return
    }

    logconsole(`Recieve message from ${msg.author.tag} : ${msg.content}`)

    // * Voice Channel Zone
    if (msg.content.startsWith("!salim")) {
        if (!settings.allow_vc) {
            logconsole(`${msg.author.tag} trying to pull this bot to VC`, "DECLINE")
            msg.channel.send("My Owner don't allow me to join VC :(")
            return
        }

        let vc = msg.member.voice.channel
        // * Check for possible error
        if (currVC == vc) {
            logconsole(`Trying to enter the VC that already in. Aborted. Commanded by ${msg.author.tag}`, "DECLINE")
            return
        }

        vc.join().then(connection => {
            logconsole(`Successfully joined voice channel ${vc.name}`)
            VCconnection = connection
            currVC = vc
        }).catch(err => {
            logconsole(`${err}`, "ERROR")
        })
    }

    if (msg.content.startsWith("!dc") || msg.content.startsWith("!leave")) {
        if (currVC) {
            currVC.leave()
            currVC = undefined
            logconsole(`Left Voice Chat by desire of ${msg.author.tag}`)
        }
        else {
            logconsole(`${msg.author.tag} want me to leave, but I'm not in VC`, "DECLINE")
            msg.channel.send("Can't leave, I'm not in any Voice Chat")
        }

    }

    // * Mentioning Bot
    if (msg.mentions.has(client.user)) {
        if (msg.content.includes("แนะนำตัว")) {
            logconsole("Introduced myself")
            msg.channel.send(introduceMyself())
            return
        }
        if (msg.content.includes("เพลง")) {
            if (msg.member.voice.channel == currVC) {
                let keyarr = []
                for (let key in musicList) {
                    keyarr.push(key)
                }
                let SongIndex = Math.floor(Math.random() * keyarr.length)
                let musicname = musicList[keyarr[SongIndex]]["song_name"]
                let musicfilename = musicList[keyarr[SongIndex]]["file_name"]
                VCconnection.play(`./assets/music/${musicfilename}`)
                logconsole(`Offered ${musicname} to ${msg.author.tag} and others in vc`)
                msg.channel.send(`Playing ${musicname}`)
            }
            else {
                logconsole(`${msg.author.tag} requested song but not in the same voice chat`, "DECLINE")
                msg.channel.send("I must be in the same channel to play song")
            }
        }
    }

    // * Regular Detection
    if (isชังชาติ(msg)) {
        let tosentmsg = randomQuote()
        msg.channel.send(`${tosentmsg}`)
        logconsole(`Sent message : ${tosentmsg}`)
        // * If in VC and the ชังชาติ person is in the same one, SPEAK!
        if (msg.member.voice.channel == currVC) {
            speak(tosentmsg)
        }
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

function speak(phrase, isDebug = false) {
    let debugstr
    if (isDebug)
        debugstr = "DEBUG"
    else
        debugstr = "Normal"
    exec(`echo "${phrase}" | ${settings.python_prefix} "tts.py"`, (error, stdout, stderr) => {
        if (error) {
            logconsole(`Error on calling python : ${error.message}`, "ERROR")
            return
        }
        if (stderr) {
            logconsole(`stderr on calling python : ${stderr}`, "ERROR")
            return
        }
        let dispatcher = VCconnection.play('./temp/bot_temp.mp3')
        logconsole(`Start playing "${phrase}" on ${currVC.name}`, debugstr)
        dispatcher.on("end", end => { logconsole(`Successfully play sound (Dispatcher end) : ${phrase}`, debugstr) })
    })

}


// * Debug น้อน
// ! Error Check not present here

const readline = require("readline")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.on('line', (input) => {
    debug(input)
})

function debug(commandstr) {
    let command = commandstr.split(" ")
    switch (command[0]) {
        case "quote":
            lastchannel.send(quoteArray[command[1]])
            logconsole(`quote : Sent quote #${command[1]}`, "DEBUG")
            return
        case "say":
            let sayarr = commandstr.slice(4)
            lastchannel.send(sayarr)
            logconsole(`say : Sent message ${sayarr}`, "DEBUG")
            return
        case "speak":
            let speakarr = commandstr.slice(6)
            speak(speakarr, true)
            return
        case "speakquote":
            speak(quoteArray[command[1]])
            logconsole(`speakquote : Spoke quote #${command[1]}`, "DEBUG")
            return
        // * To Clear Screen, do Ctrl + L
        default:
            logconsole(`Unknown Command "${command[0]}"`, "DEBUG-ERROR")
    }
}

// * End of code -> Setup complete
console.log("[SETUP COMPLETED] All Imports, Events, Functions are set")