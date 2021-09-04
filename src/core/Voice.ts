// * Voice.ts : Voice Control

import { GuildMember, VoiceConnection } from "discord.js";

import { Logger } from "../utils/Logger";

import { exec } from "child_process";
//import path from "path";

const JoiningMessage = "บอทสลิ่มมาแล้ว นะจ๊ะ";

export class Voice {
    static connection?: VoiceConnection;

    static async joinTo(member: GuildMember): Promise<boolean> {
        const voiceChannel = member.voice.channel;

        if (voiceChannel != null) {
            if (Voice.connection != null && Voice.connection.channel.id == voiceChannel.id) {
                // * Same channel, do nothing unless disconnected
                if (Voice.resolveConnection()) {
                    Logger.log(`Already in ${voiceChannel.name}: Joining Aborted`);
                    return true;
                }
            }

            try {
                Voice.connection = await voiceChannel.join();
                Logger.log(`Successfully join ${Voice.connection.channel.name}`, "SUCCESS");
                Voice.tts(JoiningMessage);
                return true;
            }
            catch (error) {
                Logger.log(`Cannot pursue ${member.user.tag} because ${voiceChannel.name} is not joinable : ${error}`, "ERROR");
                return false;
            }
        }
        else {
            Logger.log(`Cannot pursue ${member.user.tag} because user is not in voice channel`, "ERROR");
            return false;
        }
    }

    // * Run Text to Speech and play it in current voice channel
    static tts(message: string): void {
        if (!Voice.resolveConnection()) return;

        exec(`echo ${message} | python3 ./scripts/tts.py`, (error, stdout, stderr) => {
            if (error || stderr) {
                Logger.log(`Error Executing Python Script (tts): ${error?.message}${stderr ?? ""}`, "ERROR");
                return;
            }

            Voice.connection?.play("./temp/tts.mp3", { volume: 1 });
            Logger.log(`tts: Speaking "${message}" on ${Voice.connection?.channel.name}`);
        });
    }

    // * Return true if connection is fine, false otherwise or no connection
    private static resolveConnection(): boolean {
        if (Voice.connection == null) return false;
        // * 4 = DISCONNECTED
        if (Voice.connection.status == 4) {
            Logger.log(`High Congress detected that connection to ${Voice.connection.channel.name} have been destroyed!`, "WARNING");
            Voice.connection.disconnect();
            Voice.connection = undefined;
            return false;
        }
        return true;
    }
}
