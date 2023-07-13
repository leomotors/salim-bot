import {
  CommandInteraction,
  Message,
  GuildMember,
  StageChannel,
  VoiceChannel,
} from "discord.js";

import {
  AudioPlayer,
  AudioPlayerError,
  AudioPlayerStatus,
  AudioResource,
  createAudioPlayer,
  createAudioResource,
  DiscordGatewayAdapterCreator,
  entersState,
  getVoiceConnection,
  joinVoiceChannel,
  VoiceConnectionStatus,
} from "@discordjs/voice";

import chalk from "chalk";
import { getAllAudioUrls } from "google-tts-api";
import { IncomingMessage } from "http";
import https from "https";
import ytdl from "ytdl-core";

import { Context, getVoiceChannel } from "../client/index.js";
import { sLogger } from "../logger/index.js";
import { shorten } from "../utils/string.js";

export enum VoiceValidateResult {
  OK = 0,
  NO_CHANNEL = 1,
  STAGE_CHANNEL = 2,
  NOT_JOINABLE = 3,
}

export class VoiceControl {
  private handleDisconnect: () => void;
  private player: AudioPlayer;
  private guildID: string;
  private channelName: string;
  private voiceChannelID: string;

  isSameChannel(channel?: VoiceChannel | StageChannel | null) {
    return channel?.id == this.voiceChannelID;
  }

  static validateUser(msg: Message | CommandInteraction): VoiceValidateResult {
    const channel = (msg.member as GuildMember | undefined)?.voice.channel;

    // * This Bot and every others cannot enter *undefined* channel
    if (!channel) return VoiceValidateResult.NO_CHANNEL;

    // * This Bot doesn't support Stage Channel
    if (channel instanceof StageChannel)
      return VoiceValidateResult.STAGE_CHANNEL;

    if (!channel.joinable) return VoiceValidateResult.NOT_JOINABLE;

    return VoiceValidateResult.OK;
  }

  constructor(
    msg: Context,
    ignorePrivacy: boolean,
    handleDisconnect: () => void,
  ) {
    this.handleDisconnect = handleDisconnect;
    const validateResult = VoiceControl.validateUser(msg);
    if (validateResult) throw validateResult;

    this.player = createAudioPlayer();
    const voiceChannel = getVoiceChannel(msg)!;
    this.guildID = voiceChannel.guild.id;
    this.channelName = voiceChannel.name;
    this.voiceChannelID = voiceChannel.id;

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild
        .voiceAdapterCreator as DiscordGatewayAdapterCreator,
      selfDeaf: !ignorePrivacy,
    });

    connection.subscribe(this.player);

    // * https://discordjs.guide/voice/voice-connections.html#handling-disconnects
    connection.on(VoiceConnectionStatus.Disconnected, async (_, __) => {
      try {
        await Promise.race([
          entersState(connection, VoiceConnectionStatus.Signalling, 5000),
          entersState(connection, VoiceConnectionStatus.Connecting, 5000),
        ]);
        // Seems to be reconnecting to a new channel - ignore disconnect
      } catch (error) {
        // Seems to be a real disconnect which SHOULDN'T be recovered from
        sLogger.log(`Disconnected from ${this.channelName}`, "WARNING");
        this.destruct();
      }
    });
  }

  destruct() {
    const connection = getVoiceConnection(this.guildID);
    connection?.destroy();
    this.handleDisconnect();
  }

  async waitTillReady(mode: string): Promise<boolean> {
    const connection = getVoiceConnection(this.guildID);

    if (!connection) return false;
    try {
      await entersState(connection, VoiceConnectionStatus.Ready, 5000);
      sLogger.log(
        `Successfully joined ${this.channelName} as ${chalk.magenta(
          mode,
        )} 🤩🤩`,
        "SUCCESS",
      );
      return true;
    } catch (err) {
      sLogger.log(`Error joining ${this.channelName} : ${err}`, "ERROR");
      return false;
    }
  }

  private speakQueue: AudioResource<unknown>[] = [];

  async speak(content: string): Promise<boolean> {
    sLogger.log(
      `[TTS] Started Speaking ${shorten(content, 30)} to ${this.channelName}`,
    );

    const results = getAllAudioUrls(content, {
      lang: "th",
      slow: false,
    });

    const initiated = !!this.speakQueue.length;

    this.speakQueue = this.speakQueue.concat(
      await Promise.all(
        results.map(async (url) =>
          createAudioResource(
            await new Promise<IncomingMessage>((res, _) => {
              https.get(url.url, (stream) => {
                res(stream);
              });
            }),
          ),
        ),
      ),
    );

    if (!initiated) this.player.play(this.speakQueue.shift()!);

    return new Promise<boolean>((resolve, _) => {
      this.player.on(AudioPlayerStatus.Idle, () => {
        if (this.speakQueue.length) {
          this.player.play(this.speakQueue.shift()!);
        } else {
          resolve(true);
        }
      });
      // * By GitHub Copilot
      this.player.on("error", (err) => {
        sLogger.log(
          `[TTS] Error Speaking ${shorten(content, 30)} to ${
            this.channelName
          } : ${err}`,
          "ERROR",
        );
        resolve(false);
      });
    });
  }

  async playSong(
    url: string,
    title: string,
    category: string,
  ): Promise<boolean> {
    // https://stackoverflow.com/questions/63199238/discord-js-ytdl-error-input-stream-status-code-416
    const musicStream = ytdl(url, {
      filter: "audioonly",
      quality: "highestaudio",
      highWaterMark: 1 << 25,
      liveBuffer: 4000,
    });

    const musicRc = createAudioResource(musicStream);

    sLogger.log(`[DJCorgi] Playing ${title} in category of ${category}`);
    this.player.play(musicRc);

    return new Promise<boolean>((resolve, _) => {
      this.player.on(AudioPlayerStatus.Idle, () => {
        resolve(true);
      });
      this.player.on("error", (err: AudioPlayerError) => {
        sLogger.log(
          `[DJCorgi] Error while playing ${title}: ${err.message}`,
          "ERROR",
        );
        resolve(false);
      });
    });
  }

  forceSkip() {
    // * Stop player causing class to think tts/music has ended
    this.player.stop(true);
  }
}
