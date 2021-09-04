// * Voice.ts : Voice Control

import { GuildMember, VoiceConnection } from "discord.js";
import { exec } from "child_process";

import Logger from "../utils/Logger";

const JoiningMessage = "บอทสลิ่มมาแล้ว นะจ๊ะ";

export default class Voice {
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
                const oldChannelName = Voice.connection?.channel.name;

                Voice.connection = await voiceChannel.join();
                if (oldChannelName)
                    Logger.log(`Successfully moved from ${oldChannelName} to ${Voice.connection.channel.name}`, "SUCCESS");
                else
                    Logger.log(`Successfully join ${Voice.connection.channel.name}`, "SUCCESS");
                Voice.tts(JoiningMessage);
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

    // * Run Text to Speech and play it in current voice channel if it exists
    static sayTo(member: GuildMember | null, message: string): void {
        const targetChannel = member?.voice?.channel;
        if (targetChannel == null) {
            return;
        }

        if (targetChannel == Voice.connection?.channel) {
            Voice.tts(message);
        }
    }

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
