/**
 * * bot.ts
 * * This is Main Program for Bot
 * * Made by @Leomotors
 * * https://github.com/Leomotors/Salim-Bot
 * * You are free to use this but don't forget to read instruction!
 * ! WARNING: Proceed at your own risk!
 */


// * Import Data from all files
import { token } from "../auth.json"

import { activities } from "../assets/json/activity.json"

import { ชังชาติ } from "../assets/json/keywords.json"
import { วาทกรรมสลิ่ม } from "../assets/json/morequotes.json"
import { SalimFacebook } from "../assets/json/salim.json"

import songs from "../assets/music/songs.json"

import bot_settings from "../settings/bot_settings.json"


// * Import Utility
import { logconsole } from "./utils/logconsole"
import { introduceMyself } from "./utils/introduce"


// * Import Required System Modules
import fetch from "node-fetch"
import chalk from "chalk"
import { exec } from "child_process"
import fs from "fs"


// * Init Variable that will be used
let quoteArray: string[] = []
let lastchannel: Channels
let currVC: Discord.VoiceChannel
let VCconnection: Discord.VoiceConnection
let sentmsg: Discord.Message[] = []


// * Check for duplicate keyword
let duplist: string[] = []
for (let word_to_check of ชังชาติ) {
    let appearance = ชังชาติ.filter(word => word == word_to_check).length
    if (appearance > 1 && !duplist.includes(word_to_check))
        duplist.push(word_to_check)
}
if (duplist.length > 0) {
    for (let dupword of duplist)
        console.log(chalk.yellow(`[IMPORT WARNING] Duplicate Keyword : ${dupword}`))
}

// * Add วาทกรรมสลิ่ม from morequotes.json w/ duplicate check
if (bot_settings.local_quote) {
    // * No one can evade Rick Roll
    quoteArray.push("Easter egg คับ https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    for (let word of วาทกรรมสลิ่ม) {
        if (quoteArray.includes(word))
            console.log(chalk.yellow(`[IMPORT WARNING] Duplicate Quote : ${word}`))
        else
            quoteArray.push(word)
    }
}

// * Import วาทกรรมสลิ่ม from narze's repo & add to quoteArray w/ duplicate check
fetch('https://watasalim.vercel.app/api/quotes', {
    method: "GET",
    headers: { "Content-type": "application/json;charset=UTF-8" }
}).then(response => response.json())
    .then(json => {
        for (let quote of json.quotes) {
            let toAdd = quote.body
            if (quoteArray.includes(toAdd))
                console.log(chalk.yellow(`[IMPORT ONLINE WARNING] Duplicate Quote : ${toAdd}`))
            else
                quoteArray.push(toAdd)
        }
        console.log("[QUOTE FETCHED] Successfully pulled quote data from narze's repository")
    })
    .catch(err => console.log(err))


// * Discord Zone: Define on_setup() and Login
import Discord from "discord.js"

type Channels = Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel

const client: Discord.Client = new Discord.Client()
client.on("ready", () => {
    console.log(`[LOGIN SUCCESS] Successfully logged in as ${client.user.tag}.`)
    setStatus(-1, false, true)
})

function setStatus(id: number = -1, isDebug: boolean = false, startup: boolean = false) {
    if (id == -1)
        id = Math.floor(Math.random() * activities.length)
    client.user.setActivity(`${activities[id].name}`, { type: <Discord.ActivityType>activities[id].type })
        .then(presence => {
            if (isDebug)
                logconsole(`Activity changed to ${presence.activities[0].type} ${presence.activities[0].name}`, "DEBUG")
            else
                console.log(`[PRESENCE SETTED] Activity set to ${presence.activities[0].type} ${presence.activities[0].name}`)
            if (startup) {
                // * Since Setstatus is last process, doning this mean bot is started
                console.log(chalk.green("==========> BOT READY TO USE <=========="))
            }
        })
        .catch(console.error)
}

client.login(token)


// * MAIN EVENT: Upon recieving message, process it
client.on("message", evaluateMessage)

function evaluateMessage(msg: Discord.Message) {
    lastchannel = msg.channel

    // * Action 1: Ignore own's message
    if (msg.author.id == client.user.id) {
        // * It's your own message!
        sentmsg = [msg].concat(sentmsg)
        if (sentmsg.length > bot_settings.message_cache)
            sentmsg.pop()
        return
    }

    logconsole(`Recieve message from ${msg.author.tag} : ${msg.content}`)


    // * Voice Channel Zone

    // * Action 2: Enter Voice Channel & Disconnect
    if (msg.content.startsWith("!salim")) {
        if (!bot_settings.allow_vc) {
            logconsole(`${msg.author.tag} trying to pull this bot to VC`, "DECLINE")
            sendAndSpeak(msg, "เจ้าของฉันไม่อนุญาตให้ฉันเข้าไปคุยกับพวกคนชังชาติ :(")
            return
        }

        let vc = msg.member.voice.channel
        // * Check for possible error
        if (!vc) {
            logconsole(`${msg.author.tag} trying to pull me to the world of undefined!`, "DECLINE")
            sendAndSpeak(msg, "จะให้เข้าไปห้องไหนอ่ะ ผมจะไม่รู้มั้ยเนี่ย")
            return
        }
        else if (currVC == vc) {
            logconsole(`Trying to enter the VC that already in. Aborted. Commanded by ${msg.author.tag}`, "DECLINE")
            sendAndSpeak(msg, "นี่ไง ฉันก็อยู่ในห้องนี้แล้ว ยังจะเอาอะไรอีก!!!")
            return
        }

        vc.join().then(connection => {
            logconsole(`Successfully joined voice channel ${vc.name} by desire of ${msg.author.tag}`)
            VCconnection = connection
            currVC = vc
            speak("บอทสลิ่ม มาแล้วนะจ๊ะ!!!")
        }).catch(err => {
            logconsole(`${err}`, "ERROR")
        })
        return
    }

    if (msg.content.startsWith("!dc") || msg.content.startsWith("!leave")) {
        if (currVC) {
            currVC.leave()
            currVC = undefined
            logconsole(`Left Voice Chat by desire of ${msg.author.tag}`)
        }
        else {
            logconsole(`${msg.author.tag} want me to leave, but I'm not in VC`, "DECLINE")
            sendAndSpeak(msg, "จะออกได้ไงวะ ไม่ได้อยู่ในนั้นแต่แรก หัดคิดบ้างนะ")
        }

    }

    // * Action 3: Introduce & DJ
    if (msg.mentions.has(client.user)) {
        if (msg.content.includes("แนะนำตัว") || msg.content.includes("github")) {
            logconsole("Introduced myself")
            sendAndSpeak(msg, introduceMyself())
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
                msg.channel.send(`where ${msg.author.tag}`)
            }
        }
    }

    // * Action 4: Train
    if (msg.content.startsWith("!train")) {
        if (bot_settings.limited_training &&
            !bot_settings.salim_insiders.includes(msg.author.username)) {
            logconsole(`${msg.author.tag} tried to train me without permission!`, "DECLINE")
            sendAndSpeak(msg, "ฉันไม่ได้รับการอนุญาตให้ถูก train โดยพวกชังชาติอย่างคุณ")
        }
        else {
            let trainstr = msg.content.slice(0).replace("\n", " ")
            fs.appendFile(`../python/train.txt`, trainstr.slice(7) + "\n", (err) => {
                if (err)
                    console.log(chalk.red(`[TRAIN ERROR] Error on writing log file: ${err}`))
            })
            sendAndSpeak(msg, "กระผม นศท. น้อนสลิ่ม จะจดจำแล้วนำไปใช้ ครับ!")
            logconsole(`Trained by ${msg.author.tag}`, "TRAINED")
            return
        }

    }

    // * Action 5: Questioning
    if (msg.mentions.has(client.user)) {
        if (msg.content.includes("คำพูด")) {
            if (!bot_settings.limited_questioning || bot_settings.salim_insiders.includes(msg.author.tag)) {
                sendAndSpeak(msg, `ตอนนี้ผมมีวาทกรรมที่พร้อมจะด่าพวกสามกีบอย่างคุณ ${quoteArray.length} ประโยค`)
                logconsole(`Answer ${msg.author.tag} Question about Quote Count`, "QUESTION ANSWERED")
            }
            else {
                sendAndSpeak(msg, `สามกีบอย่างคุณมีสิทธิ์ถามคำถามกับผมด้วยหรอ?`)
                logconsole(`Reject ${msg.author.tag}'s Question`, "QUESTION REJECTED")
            }
            return
        }
        if (msg.content.includes("ไม่ชอบ")) {
            if (!bot_settings.limited_questioning || bot_settings.salim_insiders.includes(msg.author.tag)) {
                sendAndSpeak(msg, `ก็มีอยู่ประมาณ ${ชังชาติ.length} คำที่พวกสามกีบชอบพูดแล้วทำให้ผมไม่สบายใจ`)
                logconsole(`Answer ${msg.author.tag} Question about Keywords Count`, "QUESTION ANSWERED")
            }
            else {
                sendAndSpeak(msg, `สามกีบอย่างคุณมีสิทธิ์ถามคำถามกับผมด้วยหรอ?`)
                logconsole(`Reject ${msg.author.tag}'s Question`, "QUESTION REJECTED")
            }
            return
        }
        if (msg.content.includes("เฟส") || msg.content.includes("เฟซ") || msg.content.toLowerCase().includes("fb") || msg.content.toLowerCase().includes("facebook")) {
            if (SalimFacebook.length <= 0) {
                sendAndSpeak(msg, `ไม่รู้ ไม่รู้ ไม่รู้ ผมจะไปรู้มั้ยล่ะ`)
                logconsole(`${msg.author.tag} wants to be ตาสว่าง but I have no facebook data`, "FACEBOOK-WARNING")
                return
            }
            let selFb = SalimFacebook[Math.floor(Math.random() * SalimFacebook.length)]
            sendAndSpeak(msg, `ดิฉันแนะนำให้คุณไปติดตาม ${selFb.name} เผื่อคุณจะได้ตาสว่างซะบ้าง ${selFb.url}`)
            logconsole(`Recommended ${selFb.name} to ${msg.author.tag}`, "FACEBOOK")
            return
        }
    }

    // * Base Action: Regular Detection
    if (isชังชาติ(msg)) {
        let tosendmsg = sendRandomQuote(msg.channel)
        // * If in VC and the ชังชาติ person is in the same one, SPEAK!
        try {
            if (currVC && msg.member.voice.channel == currVC) {
                speak(tosendmsg)
            }
        }
        catch (err) {
            logconsole(`Exception Catched : ${err}`, "EXCEPTION HANDLED")
        }
        return
    }
}

function sendAndSpeak(refmsg: Discord.Message, msg: string) {
    refmsg.channel.send(msg)
    try {
        if (currVC && refmsg.member.voice.channel == currVC) {
            speak(msg)
        }
    }
    catch (err) {
        logconsole(`Exception Catched : ${err}`, "EXCEPTION HANDLED")
    }
    return
}

function sendRandomQuote(channel: Channels): string {
    let tosentmsg = randomQuote()
    channel.send(`${tosentmsg}`)
    logconsole(`Sent message : ${tosentmsg}`)
    return tosentmsg
}

// * All other support function
function isชังชาติ(msg: Discord.Message): boolean {
    for (let word of ชังชาติ) {
        if (msg.content.replace(/\s/g, '').toLowerCase().includes(word)) {
            logconsole(`isชังชาติ : Detected "${word}"`)
            return true
        }
    }
    return false
}

function randomQuote(): string {
    let randIndex = Math.floor(Math.random() * quoteArray.length)
    return quoteArray[randIndex]
}

function randomSong(channel: Channels, index = -1) {
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
}


// * Support Function: Audio playing
function speak(phrase: string, isDebug = false) {
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

function playYoutube(url: string, isDebug = false) {
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

import readline from "readline" // * Module for debug only

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.on('line', (input) => {
    debug(input)
})

function debug(commandstr: string) {
    let command: string[] = commandstr.split(" ")
    try {
        switch (command[0]) {
            case "quote":
                lastchannel.send(quoteArray[parseInt(command[1])])
                logconsole(`quote : Sent quote #${parseInt(command[1])}`, "DEBUG")
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
                speak(quoteArray[parseInt(command[1])])
                logconsole(`speakquote : Spoke quote #${parseInt(command[1])}`, "DEBUG")
                break
            case "salim":
                let tosendmsg = sendRandomQuote(lastchannel)
                if (currVC)
                    speak(tosendmsg)
                logconsole(`salim : Burst its emotion`, "DEBUG")
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

                            if (typeof currmsg.channel != typeof Discord.DMChannel) {
                                let currchannel: Discord.TextChannel | Discord.NewsChannel = <Discord.TextChannel | Discord.NewsChannel>currmsg.channel
                                console.log(`#${i} -> ${currchannel.name} : ${currmsg.content}`)
                            }
                            else {
                                console.log(`#${i} -> DM Channel : ${currmsg.content}`)
                            }

                        }
                        logconsole("Query for sent messages completed", "DEBUG")
                        break
                    case "status":
                        console.log("Showing all activities available")
                        let a_index = 0
                        for (let activity of activities) {
                            console.log(`#${a_index} ${activity.type} ${activity.name}`)
                            a_index++
                        }
                        logconsole("Query for status completed", "DEBUG")
                        break
                    default:
                        logconsole(`Unknown Query "${command[1]}"`, "DEBUG-ERROR")
                }
                break
            case "findquote":
                let toFind = command[1]
                console.log(`Showing quote containing ${toFind}`)
                for (let i = 0; i < quoteArray.length; i++) {
                    if (quoteArray[i].includes(toFind))
                        console.log(`Quote #${i} : ${quoteArray[i]}`)
                }
                logconsole(`Query for quote containing ${toFind} completed`, "DEBUG")
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
            case "help":
                console.log(`This might help: https://github.com/Leomotors/Salim-Bot/blob/main/docs/debug.md`)
                break
            default:
                logconsole(`Unknown Command "${command[0]}"`, "DEBUG-ERROR")
        }
    }
    catch (error) {
        logconsole(`Catched error: ${error}`, "DEBUG EXCEPTION RAISED")
    }
}

// * End of code -> Setup complete
console.log("[SETUP COMPLETED] All Imports, Events, Functions are set")
