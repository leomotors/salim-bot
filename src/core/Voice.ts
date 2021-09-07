// * Voice.ts : Voice Control

import { GuildMember, Message, VoiceConnection } from "discord.js";
import { exec } from "child_process";

import DJSalima from "./DJSalima";
import Logger from "../utils/Logger";

const JoiningMessage = "บอทสลิ่มมาแล้ว นะจ๊ะ";
const RejoiningMessage = "ขออภัยเนื่องจากบ้านฉันอยู่อย่างพอเพียง เลยเน็ตหลุดบ้าง แต่กลับมาแล้ว นะจ๊ะ";
const alreadyHereMessage = "ฉันอยู่นี่แล้วไง ยังจะเอาอะไรอีก";

export default class Voice {
    static connection?: VoiceConnection;

    static async joinTo(member: GuildMember, msg: Message): Promise<boolean> {
        const voiceChannel = member.voice.channel;

        let rejoin = false;

        if (voiceChannel != null) {
            if (Voice.connection != null && Voice.connection.channel.id == voiceChannel.id) {
                // * Same channel, do nothing unless disconnected
                if (Voice.resolveConnection()) {
                    Logger.log(`Already in ${voiceChannel.name}: Joining Aborted`);
                    msg.reply(alreadyHereMessage);
                    Voice.tts(alreadyHereMessage);
                    return true;
                }
                else {
                    rejoin = true;
                }
            }

            try {
                const oldChannelName = Voice.connection?.channel.name;

                Voice.connection = await voiceChannel.join();
                if (oldChannelName)
                    Logger.log(`Successfully moved from ${oldChannelName} to ${Voice.connection.channel.name}`, "SUCCESS");
                else
                    Logger.log(`Successfully join ${Voice.connection.channel.name}`, "SUCCESS");
                Voice.tts(rejoin ? RejoiningMessage : JoiningMessage);
                return Voice.resolveConnection();
            }
            catch (error) {
                Logger.log(`Cannot pursue ${member.user.tag} because ${voiceChannel.name} is not joinable : ${error}`, "ERROR");
                return false;
            }
        }
        else {
            Logger.log(`Cannot pursue ${member.user.tag} because user is not in Voice Channel of ${member.guild.name}`, "ERROR");
            return false;
        }
    }

    static async leaveChannel(msg: Message): Promise<void> {
        if (!Voice.resolveConnection()) {
            msg.reply("จะให้ฉันออกจากอะไร");
            Logger.log(`${msg.author.tag} try to make me leave from 'undefined'???`);
            return;
        }

        const userChannel = msg.member?.voice.channel;
        if (userChannel != null && userChannel == Voice.connection?.channel) {
            const channelName = Voice.connection.channel.name;
            Voice.connection.disconnect();
            Voice.connection = undefined;
            Logger.log(`Successfully leave ${channelName} by desire of ${msg.author.tag}`);
        }
        else {
            msg.channel.send("ผมไม่ออก (คุณต้องอยู่ในช่องเดียวกับผมถึงจะไล่ผมออกได้)");
            Logger.log(`Rejected ${msg.author.tag} to leave because not in the same voice channel`);
        }
    }

    // * Run Text to Speech and play it in current voice channel if it exists
    static sayTo(member: GuildMember | null, message: string, refmsg?: Message): void {
        const targetChannel = member?.voice?.channel;

        if (targetChannel == null) {
            return;
        }

        if (targetChannel == Voice.connection?.channel) {
            if (DJSalima.isPlaying) {
                refmsg?.reply("ฉันอยากจะด่าคุณมาก แต่ติดที่ว่าฉันกำลังเปิดเพลงอยู่ ฝากไว้ก่อนเถอะ");
                Logger.log("tts canceled because some music is being played");
            }
            else {
                Voice.tts(message);
            }

        }
    }

    static tts(message: string): void {
        if (!Voice.resolveConnection()) return;

        const sh = `echo "${message}" | python3 ./scripts/tts.py`;
        Logger.log(`[SHELL] Executing ${sh}`);
        exec(sh, (error, stdout, stderr) => {
            if (error || stderr) {
                Logger.log(`Error Executing Python Script (tts): ${error?.message}`, "ERROR");
                return;
            }

            Voice.connection?.play("./temp/tts.mp3", { volume: 1.5 });
            Logger.log(`tts: Speaking "${message}" on ${Voice.connection?.channel.name}`);
        });
    }

    // * Return true if connection is fine, false otherwise or no connection
    static resolveConnection(): boolean {
        if (Voice.connection == null) return false;
        // * 4 = DISCONNECTED
        if (Voice.connection.status == 4) {
            Logger.log(`High Congress detected that connection to ${Voice.connection.channel.name} have been destroyed!`, "WARNING");
            Voice.connection.disconnect();
            Voice.connection = undefined;
            DJSalima.isPlaying = false;
            return false;
        }
        return true;
    }
}
