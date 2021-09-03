// * Voice.ts : Voice Control

import { GuildMember, VoiceState, VoiceChannel } from "discord.js";
import { Logger } from "../utils/Logger";
import { joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import { createDiscordJSAdapter } from "../lib/Adapter";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";

export class Voice {
    static connection: VoiceConnection;
    static ttsClient: TextToSpeechClient;

    static construct(): void {
        const ttsClient = new TextToSpeechClient();
        Voice.ttsClient = ttsClient;
    }

    static joinTo(member: GuildMember): boolean {
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

            Voice.connection = connection;
            return true;
        }
        else {
            return false;
        }
    }

    static async tts(message: string): Promise<void> {
        const request = {
            input: { text: message },
            voice: { languageCode: "th-TH", ssmlGender: "NEUTRAL" },
            audioConfig: { audioEncoding: "MP3" }
        };
    }
}