/**
 * * bot.js
 * * This is Main Program for bot, run this with nodejs
 * * Made by @Leomotors
 * * https://github.com/Leomotors/Salim-Bot
 * * You are free to use this but don't forget to read instruction!
 * ! WARNING: Proceed at your own risk!
 */

// * Import data from other file
const auth = require("./auth.json")
const salimDict = require("./assets/json/keywords.json")
const moreWord = require("./assets/json/morequotes.json")
const settings = require("./botsettings.json")
const songs = require("./assets/music/songs.json")

// * Import required module & function
const request = require("request")
const { exec } = require("child_process")
const logconsole = require("./utils/logconsole")
const introduceMyself = require("./utils/introduce.js")

// * Init Variable
let plaintxt = ""
let quoteArray = []
let lastchannel = undefined
let currVC = undefined
let VCconnection = undefined

// * Add วาทกรรมสลิ่ม from morequotes.json
for (let word of moreWord.วาทกรรมสลิ่ม) {
    quoteArray.push(word)
}
console.log("[DATA FETCHED] Successfully pulled quote data from morequotes.json")

// * Import วาทกรรมสลิ่ม from narze's repo & add to quoteArray
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


// * Discord Zone: Define on_setup() and Login
const Discord = require("discord.js")
const client = new Discord.Client()
client.on("ready", () => {
    console.log(`[BOT READY] Successfully logged in as ${client.user.tag}.`)
})

client.login(auth.token)


// * MAIN EVENT: Upon recieving message, process it
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
            logconsole(`Successfully joined voice channel ${vc.name} by desire of ${msg.author.tag}`)
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
                randomSong(msg.channel)
                return
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
function isชังชาติ(msg) {
    for (let word of salimDict.ชังชาติ) {
        if (msg.content.includes(word)) {
            logconsole(`isชังชาติ : Detected "${word}"`)
            return true
        }
    }
    return false
}

function randomQuote() {
    let randIndex = Math.floor(Math.random() * quoteArray.length)
    return quoteArray[randIndex]
}

function randomSong(channel, index = -1) {
    // * Only two categories: easter_egg and รักชาติ
    let easterlength = songs.easter_egg.length
    let รักชาติlength = songs.รักชาติ.length

    // * Random Index
    let randIndex, isDebug = false
    if (index != -1) {
        randIndex = index
        isDebug = true
    }
    else {
        randIndex = Math.floor(Math.random() * (easterlength + รักชาติlength))
    }

    // * Play Song
    if (randIndex >= easterlength) { // * Normal
        let targetsong = songs.รักชาติ[randIndex - easterlength]
        playYoutube(targetsong["url"], isDebug)
        if (channel)
            channel.send(`Playing ${targetsong["name"]} 🎵`)
    }
    else {
        let targetsong = songs.easter_egg[randIndex]
        playYoutube(targetsong["url"], isDebug)
        if (channel)
            channel.send(`Easter Egg จ้า! Have fun with ${targetsong["name"]} 😁`)
    }
    // ? Logconsole inside playYoutube function
}


// * Support Function: Audio playing
function speak(phrase, isDebug = false) {
    let debugstr = isDebug ? "DEBUG" : "Normal"
    exec(`echo "${phrase}" | ${settings.python_prefix} "./python/tts.py"`, (error, stdout, stderr) => {
        if (error) {
            logconsole(`Error on calling python : ${error.message}`, "ERROR")
            return
        }
        if (stderr) {
            logconsole(`stderr on calling python : ${stderr}`, "ERROR")
            return
        }
        VCconnection.play('./temp/temp_tts.mp3')
        logconsole(`Start playing "${phrase}" on ${currVC.name}`, debugstr)
    })
}

function playYoutube(url, isDebug = false) {
    let debugstr = isDebug ? "DEBUG" : "Normal"
    exec(`echo "${url}" | ${settings.python_prefix} "./python/ytdownload.py"`, (error, stdout, stderr) => {
        if (error) {
            logconsole(`Error on calling python : ${error.message}`, "ERROR")
            return
        }
        if (stderr) {
            logconsole(`stderr on calling python : ${stderr}`, "ERROR")
            return
        }
        let ytname = stdout
        VCconnection.play('./temp/tempmusic.mp4')
        logconsole(`Start playing ${ytname} (YouTube) on current channel`, debugstr)
    })
}


// * Debug น้อน Zone
// ! Error Check not present here, proceed with caution

const readline = require("readline") // * Module for debug only

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
        case "song":
            let playsongid = parseInt(commandstr.slice(5))
            randomSong(undefined, playsongid)
            logconsole(`Going to play song #${playsongid}`, "DEBUG")
            break
        case "youtube":
            playYoutube(commandstr.slice(8), true)
            break
        case "query":
            switch (command[1]) {
                case "songs":
                    let index = 0
                    console.log("QUERY: Songs")
                    console.log("Category: Easter Egg")
                    for (let song of songs.easter_egg) {
                        console.log(`#${index} : ${song["name"]}`)
                        index += 1
                    }
                    console.log("Category: รักชาติ")
                    for (let song of songs.รักชาติ) {
                        console.log(`#${index} : ${song["name"]}`)
                        index += 1
                    }
                    logconsole("Query for Songs Completed", "DEBUG")
                    break
                default:
                    logconsole(`Unknown Query "${command[1]}"`, "DEBUG-ERROR")
            }
            break
        // * To Clear Screen, do Ctrl + L
        default:
            logconsole(`Unknown Command "${command[0]}"`, "DEBUG-ERROR")
    }
}

// * End of code -> Setup complete
console.log("[SETUP COMPLETED] All Imports, Events, Functions are set")