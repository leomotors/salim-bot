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
const bot_settings = require("./bot_settings.json")
const songs = require("./assets/music/songs.json")
const activity_list = require("./assets/json/activity.json").activities

// * Import required module & function
const request = require("request")
const { exec } = require("child_process")
const logconsole = require("./utils/logconsole")
const introduceMyself = require("./utils/introduce.js")
const fs = require("fs")

// * Init Variable
let plaintxt = ""
let quoteArray = []
let lastchannel = undefined
let currVC = undefined
let VCconnection = undefined
let sentmsg = []

// * Check for duplicate keyword
let duplist = []
for (let word_to_check of salimDict.ชังชาติ) {
    let appearance = salimDict.ชังชาติ.filter(word => word == word_to_check).length
    if (appearance > 1 && !duplist.includes(word_to_check))
        duplist.push(word_to_check)
}
if (duplist.length > 0) {
    for (let dupword of duplist)
        console.log(`[IMPORT WARNING] Duplicate Keyword : ${dupword}`)
}

// * Add วาทกรรมสลิ่ม from morequotes.json w/ duplicate check
for (let word of moreWord.วาทกรรมสลิ่ม) {
    if (quoteArray.includes(word))
        console.log(`[IMPORT WARNING] Duplicate Quote : ${word}`)
    else
        quoteArray.push(word)
}

// * Import วาทกรรมสลิ่ม from narze's repo & add to quoteArray w/ duplicate check
if (bot_settings.remote_quote)
    request({
        url: "https://raw.githubusercontent.com/narze/awesome-salim-quotes/main/README.md",
        json: false
    }, (err, response, body) => {
        plaintxt = body
        let txtarray = plaintxt.split(/\r?\n/)
        for (const index in txtarray) {
            line = txtarray[index]
            if (line.startsWith("-")) {
                let oword = line.slice(2)
                if (quoteArray.includes(oword))
                    console.log(`[IMPORT ONLINE WARNING] Duplicate Quote : ${oword}`)
                else
                    quoteArray.push(oword)
            }
        }
        console.log("[QUOTE FETCHED] Successfully pulled quote data from narze's repository")
    })


// * Discord Zone: Define on_setup() and Login
const Discord = require("discord.js")
const client = new Discord.Client()
client.on("ready", () => {
    console.log(`[LOGIN SUCCESS] Successfully logged in as ${client.user.tag}.`)
    setStatus(-1, false, true)
})

function setStatus(id = -1, isDebug = false, startup = false) {
    if (id == -1)
        id = Math.floor(Math.random() * activity_list.length)
    client.user.setActivity(`${activity_list[id].name}`, { type: activity_list[id].type })
        .then(presence => {
            if (isDebug)
                logconsole(`Activity changed to ${presence.activities[0].type} ${presence.activities[0].name}`, "DEBUG")
            else
                console.log(`[PRESENCE SETTED] Activity set to ${presence.activities[0].type} ${presence.activities[0].name}`)
            if (startup) {
                // * Since Setstatus is last process, doning this mean bot is started
                console.log("==========> BOT READY TO USE <==========")
            }
        })
        .catch(console.error)
}

client.login(auth.token)


// * MAIN EVENT: Upon recieving message, process it
client.on("message", eval)
function eval(msg) {
    lastchannel = msg.channel
    if (msg.author.id == client.user.id) {
        // * It's your own message!
        sentmsg = [msg].concat(sentmsg)
        if (sentmsg.length > bot_settings.message_cache)
            sentmsg.pop()
        return
    }

    logconsole(`Recieve message from ${msg.author.tag} : ${msg.content}`)

    // * Voice Channel Zone
    if (msg.content.startsWith("!salim")) {
        if (!bot_settings.allow_vc) {
            logconsole(`${msg.author.tag} trying to pull this bot to VC`, "DECLINE")
            msg.channel.send("My Owner don't allow me to join VC :(")
            return
        }

        let vc = msg.member.voice.channel
        // * Check for possible error
        if (!vc) {
            logconsole(`${msg.author.tag} trying to pull me to the world of undefined!`, "DECLINE")
            msg.channel.send("Can't enter \"undefined\" channel. You must be in the vc first!")
            return
        }
        else if (currVC == vc) {
            logconsole(`Trying to enter the VC that already in. Aborted. Commanded by ${msg.author.tag}`, "DECLINE")
            msg.channel.send("I'm already in that voice channel!")
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
        if (msg.content.includes("แนะนำตัว") || msg.content.includes("github")) {
            logconsole("Introduced myself")
            msg.channel.send(introduceMyself())
            return
        }
        if (msg.content.includes("เพลง")) {
            if (msg.member.voice.channel == currVC) {
                logconsole(`Requested for Song by ${msg.author.tag}`, "REQUESTED")
                randomSong(msg.channel)
                return
            }
            else {
                logconsole(`${msg.author.tag} requested song but not in the same voice chat`, "DECLINE")
                msg.channel.send("I must be in the same channel to play song")
            }
        }
    }

    if (msg.content.startsWith("!train")) {
        if (bot_settings.limited_training &&
            !bot_settings.trainer.includes(msg.author.username)) {
            logconsole(`${msg.author.tag} tried to train me without permission!`, "DECLINE")
            msg.channel.send("I'm not allowed to be trained by strangers like you!")
        }
        else {
            let trainstr = msg.content.slice(0).replace("\n", " ")
            fs.appendFile(`./utils/train.txt`, trainstr.slice(7) + "\n", (err) => {
                if (err)
                    console.log(`[TRAIN ERROR] Error on writing log file: ${err}`)
            })
            msg.channel.send("กระผม นศท. น้อนสลิ่ม จะจดจำแล้วนำไปใช้ ครับ!")
            logconsole(`Trained by ${msg.author.tag}`, "TRAINED")
            return
        }

    }
    // * Regular Detection
    if (isชังชาติ(msg)) {
        let tosentmsg = randomQuote()
        msg.channel.send(`${tosentmsg}`)
        logconsole(`Sent message : ${tosentmsg}`)
        // * If in VC and the ชังชาติ person is in the same one, SPEAK!
        if (msg.member.voice.channel == currVC && currVC) {
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
    exec(`echo "${phrase}" | ${bot_settings.python_prefix} "./python/tts.py"`, (error, stdout, stderr) => {
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
    exec(`echo "${url}" | ${bot_settings.python_prefix} "./python/ytdownload.py"`, (error, stdout, stderr) => {
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
            break
        case "say":
            let sayarr = commandstr.slice(4)
            lastchannel.send(sayarr)
            logconsole(`say : Sent message ${sayarr}`, "DEBUG")
            break
        case "speak":
            let speakarr = commandstr.slice(6)
            speak(speakarr, true)
            break
        case "speakquote":
            speak(quoteArray[command[1]])
            logconsole(`speakquote : Spoke quote #${command[1]}`, "DEBUG")
            break
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
                case "quotes":
                    let startIndex = parseInt(command[2])
                    let queryCount = parseInt(command[3])
                    console.log(`QUERY: Quotes #${startIndex}-${startIndex + queryCount - 1}`)
                    for (let i = startIndex; i < startIndex + queryCount; i++) {
                        console.log(`Quote #${i} : ${quoteArray[i]}`)
                    }
                    logconsole("Query for Quotes Completed", "DEBUG")
                    break
                case "quotecount":
                    console.log(`There are ${quoteArray.length} quotes`)
                    logconsole("Query for Quotes Count Completed", "DEBUG")
                    break
                case "sentmsg":
                    console.log(`Showing last ${sentmsg.length} sent messages`)
                    for (let i = 0; i < sentmsg.length; i++) {
                        let currmsg = sentmsg[i]
                        console.log(`#${i} -> ${currmsg.channel.name} : ${currmsg.content}`)
                    }
                    logconsole("Query for sent messages completed", "DEBUG")
                    break
                case "status":
                    console.log("Showing all activities available")
                    let a_index = 0
                    for (let activity of activity_list) {
                        console.log(`#${a_index} ${activity.type} ${activity.name}`)
                        a_index++
                    }
                    logconsole("Query for status completed", "DEBUG")
                    break
                default:
                    logconsole(`Unknown Query "${command[1]}"`, "DEBUG-ERROR")
            }
            break
        case "dc":
            currVC.leave()
            currVC = undefined
            logconsole("Left Current Voice Channel", "DEBUG")
            break
        case "cls":
            console.log("To clear screen, do Ctrl + L")
            break
        case "rmtemp":
            exec(`./rmtemp temp`, (error, stdout, stderr) => {
                if (error) {
                    logconsole(`Error on calling rmtemp : ${error.message}`, "ERROR")
                    return
                }
                if (stderr) {
                    logconsole(`stderr on calling rmtemp : ${stderr}`, "ERROR")
                    return
                }
                console.log(stdout.replace(/\n$/, ""));
            })
            break
        case "unsend":
            let unsendloc = 0
            if (command.length >= 2)
                unsendloc = parseInt(command[1])
            sentmsg[unsendloc].delete()
            sentmsg[unsendloc].content = "[DELETED]"
            logconsole(`Deleted Quote ID #${unsendloc}`, "DEBUG")
            break
        case "setstatus":
            let tstatus = -1
            if (commandstr.length > 10) {
                tstatus = parseInt(command[1])
            }
            setStatus(tstatus, true)
            break
        case "logout":
            client.destroy()
            logconsole("Successfully safely logged out", "LOGOUT")
            process.exit(0)
        default:
            logconsole(`Unknown Command "${command[0]}"`, "DEBUG-ERROR")
    }
}

// * End of code -> Setup complete
console.log("[SETUP COMPLETED] All Imports, Events, Functions are set")