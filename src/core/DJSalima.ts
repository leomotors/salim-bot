// * DJSalima.ts : It's น้อน DJ Salima!

import { Message } from "discord.js";

import { exec } from "child_process";
import * as fs from "fs";

import Logger from "../utils/Logger";
import Voice from "./Voice";

const dataLocation = "./data/songs.json";

interface Music {
    name: string,
    url: string,
    category: string
}

export default class DJSalima {
    static Musics: Music[];

    static construct(): void {
        DJSalima.importData();
    }

    static async importData(): Promise<void> {
        DJSalima.Musics = [];

        try {
            const buffer = fs.readFileSync(dataLocation);
            const tObject = JSON.parse(buffer.toString());

            for (const category in tObject) {
                for (const music of tObject[category]) {
                    DJSalima.Musics.push({
                        name: music.name,
                        url: music.url,
                        category: category
                    });
                }
            }

            Logger.log(`[FETCH COMPLETE] Retrieved ${DJSalima.Musics.length} Musics from File`, "SUCCESS", false);
        }
        catch (err) {
            Logger.log(`Error Importing Music: ${err}`, "ERROR");
        }
    }

    // * This function should only be call when confirmed connection
    static async play(music: Music, musicIndex: number, msg?: Message): Promise<void> {
        const sh = `rm -f ./temp/music.mp3 && youtube-dl --output ./temp/music.mp3 --extract-audio --audio-format mp3 ${music.url}`;
        Logger.log(`[SHELL] Executing ${sh}`);
        exec(sh, (err, stdout, stderr) => {
            if (err || stderr) {
                Logger.log(`Error downloading music (${music.name}): ${err ?? ""}`);
                msg?.reply("ขออภัย เกิดข้อผิดพลาดไม่ทราบสาเหตุขึ้น");
                return;
            }

            Logger.log(`Playing ${music.name} (#${musicIndex + 1}) to ${Voice.connection?.channel.name}`);
            Voice.connection?.play("./temp/music.mp3", { volume: 1 });
        });
    }

    static playRandomSong(msg: Message): void {
        if (!Voice.resolveConnection()) {
            msg.reply("นี่คุณจะให้ฉันเล่นเพลงให้ผีฟังหรอ");
            return;
        }

        if (msg.member?.voice.channel != Voice.connection?.channel) {
            msg.reply("คุณต้องอยู่กับฉัน มาฟังเพลงรักชาติด้วยกัน");
            return;
        }

        const randIndex: number = Math.floor(Math.random() * DJSalima.Musics.length);

        const toPlay: Music = DJSalima.Musics[randIndex];

        if (toPlay.category == "easter_egg")
            msg.reply(`ขอให้มีความสุขกับ Easter Egg 🥳 ${toPlay.name} !!!`);
        else
            msg.reply(`ขอเสริมความรักชาติให้กับคุณด้วย ${toPlay.name}`);

        DJSalima.play(toPlay, randIndex + 1, msg);
    }
}
