// * Voice.ts : Voice Control

import { GuildMember, VoiceState, VoiceChannel } from "discord.js";
import { Logger } from "../utils/Logger";
import {
    AudioPlayer,
    AudioResource,
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    //StreamType,
    VoiceConnection
} from "@discordjs/voice";
import { createDiscordJSAdapter } from "../lib/Adapter";
import { exec } from "child_process";

export class Voice {
    static connection: VoiceConnection;
    static player: AudioPlayer = createAudioPlayer();

    // static construct(): void {

    // }

    static async joinTo(member: GuildMember): Promise<boolean> {
        const voicestate: VoiceState = member.voice;
        const channel = voicestate.channel;

        if (channel != null) {
            if (!channel.joinable) {
                Logger.log(`Trying to pursue ${member.user.tag} but failed because ${channel.name} isn't joinable`);
                return false;
            }

            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: createDiscordJSAdapter(<VoiceChannel>channel)
            });

            Logger.log(`Entered Voice Channel ${channel.name}`, "SUCCESS");
            Voice.connection = connection;
            Voice.connection.subscribe(Voice.player);
            return true;
        }
        else {
            return false;
        }
    }

    static tts(message: string): void {
        exec(`echo ${message} | python3 ./scripts/tts.py`, (error, stdout, stderr) => {
            if (error || stderr) {
                Logger.log(`Error Executing Python Script (tts): ${error?.message}${stderr ?? ""}`, "ERROR");
                return;
            }

            const resource = createAudioResource("./temp/tts.mp3");
            Voice.playAudio(resource);
        });
    }

    static playAudio(data: AudioResource<null>): boolean {
        try {
            Voice.player.play(data);
            return true;
        }
        catch (error) {
            Logger.log(`Error playing Audio: ${error}`, "ERROR");
            return false;
        }
    }
}