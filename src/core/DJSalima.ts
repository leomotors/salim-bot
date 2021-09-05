// * DJSalima.ts : It's น้อน DJ Salima!

import { Message } from "discord.js";

import ytdl from "ytdl-core";
import * as fs from "fs";

import Logger from "../utils/Logger";
import Voice from "./Voice";
import { trim } from "../utils/String";

const dataLocation = "./data/songs.json";

const すみませんnotรักชาติ = "ขออภัย แต่เพลงดังกล่าวไม่ได้อยู่ในฐานข้อมูลที่รวบรวมเพลงรักชาติ ดิฉันคงเปิดให้คุณฟังไม่ได้";

interface Music {
    name: string,
    url: string,
    category: string
}

export default class DJSalima {
    static Musics: Music[];

    static async construct(isReload = false): Promise<void> {
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

            Logger.log(`[FETCH COMPLETE] Retrieved ${DJSalima.Musics.length} Musics from File`, "SUCCESS", isReload);
        }
        catch (err) {
            Logger.log(`Error Importing Music: ${err}`, "ERROR");
        }
    }

    // * This function should only be call when confirmed connection
    static async play(music: Music, musicIndex: number, msg?: Message): Promise<void> {
        try {
            const musicdata = ytdl(music.url, { quality: "highestaudio" });
            Voice.connection?.play(musicdata, { volume: 1 });
            Logger.log(`Playing ${music.name} (#${musicIndex + 1}) to ${Voice.connection?.channel.name}`);

        }
        catch (err) {
            msg?.reply("ขออภัย เกิดข้อผิดพลาดไม่ทราบสาเหตุขึ้น");
            Logger.log(`Error while playing music from YouTube ${err}`);
        }
    }

    static playSearch(msg: Message): void {
        if (!DJSalima.checkuser(msg))
            return;

        const toSearch = msg.content.toLowerCase().split(" ")[1];

        let index = 0;
        const match: number[] = [];

        for (const music of DJSalima.Musics) {
            if (music.category != "easter_egg" && trim(music.name).includes(toSearch)) {
                match.push(index);
            }
            index++;
        }

        if (match.length == 1) {
            const toPlay = DJSalima.Musics[match[0]];
            DJSalima.play(toPlay, match[0], msg);
            msg.channel.send(`ได้เลย คนรักสถาบัน กำลังเล่น ${toPlay.name}`);
            return;
        }

        if (match.length > 1) {
            let toSend = "มีหลายเพลงที่ตรงกัน กรุณาโปรดเลือกให้ชัดเจนกว่านี้";
            for (const index of match) {
                toSend += `\n#${index + 1} => ${DJSalima.Musics[index].name}`;
            }

            msg.channel.send(toSend);
            return;
        }

        msg.reply(すみませんnotรักชาติ);
        Voice.sayTo(msg.member, すみませんnotรักชาติ);
    }

    static playRandomSong(msg: Message): void {
        if (!DJSalima.checkuser(msg))
            return;

        const randIndex: number = Math.floor(Math.random() * DJSalima.Musics.length);

        const toPlay: Music = DJSalima.Musics[randIndex];

        if (toPlay.category == "easter_egg")
            msg.reply(`ขอให้มีความสุขกับ Easter Egg 🥳 ${toPlay.name} !!!`);
        else
            msg.reply(`ขอเสริมความรักชาติให้กับคุณด้วย ${toPlay.name}`);

        DJSalima.play(toPlay, randIndex, msg);
    }

    private static checkuser(msg: Message): boolean {
        if (!Voice.resolveConnection()) {
            msg.reply("นี่คุณจะให้ฉันเล่นเพลงให้ผีฟังหรอ");
            return false;
        }

        if (msg.member?.voice.channel != Voice.connection?.channel) {
            msg.reply("คุณต้องอยู่กับฉัน มาฟังเพลงรักชาติด้วยกัน");
            return false;
        }

        return true;
    }
}
