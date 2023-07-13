import {
  ActivityOptions,
  Client,
  Message,
  IntentsBitField,
  EmbedBuilder,
  Partials,
  ActivityType,
} from "discord.js";

import ytdl from "ytdl-core";

import { Console } from "../console/console.js";
import { ActivityLoader } from "../data/activityLoader.js";
import { Song } from "../data/songLoader.js";
import { sLogger as Logger } from "../logger/logger.js";
import { Response } from "../response/response.js";
import { lowerBoundLinear } from "../utils/algorithm.js";
import { durationFormat, timems } from "../utils/index.js";
import { checkPrefix, shorten, trim } from "../utils/string.js";
import { VoiceControl, VoiceValidateResult } from "../voice/index.js";

import {
  corgiQueue,
  VoiceOptions,
  DJCommands,
  SongOptions,
  getVoiceChannel,
  Context,
  getUser,
} from "./clientVoice.js";

export interface MessageResponse {
  message: string;
  react?: string;
  reply?: boolean;
  audio?: boolean;
  refIndex: string;
}

export interface SBotOptions {
  token: string | undefined;
  activityRefreshInterval?: number;
  logLocation?: string;
  ignorePrivacy?: boolean;
  logIncomingMessage?: boolean;
}

export class SBotClient {
  client: Client;
  get user() {
    return this.client.user;
  }

  get readlineInterface() {
    return this.utility?.console?.rl;
  }

  private utility: {
    response: Response[];
    console?: Console;
    activityLoader?: ActivityLoader;
  };

  private options: SBotOptions;

  /**
   * @param options Options has 5 fields
   *
   * - token: Bot Token, Defaults to `process.env.DISCORD_TOKEN`
   *
   * - activityRefreshInterval (Optional): Default 600 seconds
   *
   * - logLocation: Location for logging, Default is deactivated
   *
   * - ignorePrivacy: If set to true, bot will not deafen when joining voice channel,
   * PS: this bot does not listen to voice chat
   *
   * - logIncomingMessage: If set to true, will report every incoming message
   * just like older version of Salim Bot
   */
  constructor(options?: SBotOptions) {
    const F = IntentsBitField.Flags;

    this.client = new Client({
      intents: [
        F.Guilds,
        F.GuildMembers,
        F.GuildMessages,
        F.GuildMessageReactions,
        F.GuildVoiceStates,
        F.DirectMessages,
        F.DirectMessageReactions,
        F.MessageContent,
      ],
      partials: [Partials.Channel],
    });

    const start = performance.now();

    // * Initialize Utility Classes
    this.utility = {
      response: [],
    };

    const {
      token = process.env.DISCORD_TOKEN,
      activityRefreshInterval = 600,
      logLocation,
    } = (this.options = options ?? ({} as SBotOptions));

    Logger.startFile(logLocation);

    this.client.on("ready", () => {
      Logger.log(
        `=====> Logged in! Bot Mounted on ${this.client.user
          ?.tag} (Took ${timems(start)}) <=====`,
        "SPECIAL",
        false,
      );
      this.setSelfActivity();
    });

    this.client.login(token);

    setInterval(() => {
      this.setSelfActivity();
    }, activityRefreshInterval * 1000);

    this.client.on("messageCreate", this.response.bind(this));
  }

  private props: {
    computedActivity?: ActivityOptions;
  } = {};

  useComputedActivity(activity: ActivityOptions) {
    const { type, name = "" } = activity;
    this.props.computedActivity = activity;
    this.client.user?.setActivity(name, { type, name });
  }

  useActivities(loader: ActivityLoader) {
    this.utility.activityLoader = loader;
  }

  private setSelfActivity(index?: number) {
    const loader = this.utility.activityLoader;
    if (!this.props.computedActivity && !loader?.length) return;

    if (index === undefined) {
      index = Math.floor(
        Math.random() *
          (Number(!!loader?.length) + Number(!!this.utility.activityLoader)),
      );
    }

    const selectedActivity =
      loader?.getData()[index] ?? this.props.computedActivity;

    if (selectedActivity) {
      const { type, name = "" } = selectedActivity;
      this.client.user?.setActivity(name, {
        // @ts-ignore
        type: ActivityType[type],
        name,
      });
    }
  }

  useResponse(response: Response) {
    response.setClient(this);
    this.utility.response.push(response);
  }

  private async response(msg: Message) {
    if (msg.author.id == this.client.user?.id) return;

    if (msg.author.bot) return;

    if (this.options.logIncomingMessage)
      Logger.log(`Recieved Message from ${msg.author.tag}: ${msg.content}`);

    // * DJ Corgi Part
    if (
      await this.djCorgiResponse(msg).catch((err) =>
        Logger.log(
          `Error while handling DJ Corgi (djCorgiResponse): ${err}`,
          "ERROR",
        ),
      )
    )
      return;

    // * Registered Response Part
    for (const response of this.utility.response) {
      if (response.isTrigger(msg.content)) {
        const reply = response.getReply();
        try {
          if (reply.react) await msg.react(reply.react);
          if (reply.reply) await msg.reply(reply.message);
          else await msg.channel.send(reply.message);
          if (reply.audio) this.corgiSwiftJutsu(msg, reply.message);

          const refInd = reply.refIndex;
          Logger.log(
            `Replied ${msg.author.tag} with ${reply.message}${
              refInd ? ` (${refInd})` : ""
            }`,
          );

          await response.after?.(msg);
        } catch (err) {
          Logger.log(`Error while responding to message : ${err}`, "ERROR");
        }
        return;
      }
    }
  }

  useConsole(console: Console) {
    this.utility.console = console;
  }

  /// * VOICE CONTROL SECTION ///

  private voiceOptions?: VoiceOptions;
  private voiceCtrl?: VoiceControl;

  /**
   * Activate voice feature, you will need to provide words
   * for your bot to speak under each circumstance.
   *
   * See: src/client/clientVoice.ts @ `VoiceOptions`
   */
  useVoice(options: VoiceOptions) {
    this.voiceOptions = options;
  }

  private async djCorgiResponse(msg: Message) {
    if (
      this.djCommands &&
      checkPrefix(msg.content, this.djCommands.play.prefixes)
    ) {
      this.requestSong(msg);
      return true;
    }

    if (this.djCommands?.skip) {
      if (checkPrefix(msg.content, this.djCommands.skip.prefixes)) {
        if (this.voiceCtrl) {
          this.voiceCtrl.forceSkip();
          this.djCommands.skip.react &&
            (await msg.react(this.djCommands.skip.react));
        } else {
          this.djCommands.skip.already_empty &&
            (await msg.reply(this.djCommands.skip.already_empty));
        }
        return true;
      }
    }

    if (this.djCommands?.clear) {
      if (checkPrefix(msg.content, this.djCommands.clear.prefixes)) {
        if (this.voiceCtrl) {
          this.corgiSwiftQueue = [];
          this.voiceCtrl.forceSkip();
          this.djCommands.clear.react &&
            (await msg.react(this.djCommands.clear.react));
        } else {
          this.djCommands.clear.already_empty &&
            (await msg.reply(this.djCommands.clear.already_empty));
        }
        return true;
      }
    }

    return false;
  }

  corgiSwiftQueue: corgiQueue[] = [];
  async corgiSwiftJutsu(msg: Context, content: string) {
    if (VoiceControl.validateUser(msg)) return;

    // * Ignore TTS if Music is on Queue
    if (this.corgiSwiftQueue.filter((q) => q.type == "SONG").length) return;

    const notRunning = !this.corgiSwiftQueue.length;

    this.corgiSwiftQueue.push({ msg, type: "TTS", content });
    if (notRunning) this.corgiSwiftClearQueue();
  }

  private async corgiSwiftClearQueue() {
    if (!this.corgiSwiftQueue.length) return;

    const { msg } = this.corgiSwiftQueue[0]!;

    const targetVoiceChannel = getVoiceChannel(msg);
    if (!targetVoiceChannel?.joinable) {
      // * Users no longer in VC or VC is not joinable
      this.corgiSwiftQueue.shift();
      this.corgiSwiftClearQueue();
      return;
    }

    try {
      this.voiceCtrl = new VoiceControl(
        msg,
        this.options.ignorePrivacy ?? false,
        () => {
          this.voiceCtrl = undefined;
        },
      );
      await this.voiceCtrl.waitTillReady("CorgiSwift術 Mode");

      while (this.corgiSwiftQueue.length) {
        const frontier = this.corgiSwiftQueue[0]!;
        if (this.voiceCtrl.isSameChannel(getVoiceChannel(frontier.msg))) {
          if (frontier.type == "TTS")
            await this.voiceCtrl.speak(frontier.content);
          else await this.corgiPlaySong(msg, frontier.song, frontier.category);
          this.corgiSwiftQueue.shift();
        } else {
          this.voiceCtrl.destruct();
          this.corgiSwiftClearQueue();
          return;
        }
      }

      this.voiceCtrl?.destruct();
    } catch (err) {
      Logger.log(`CorgiSwift術 Failed: ${err}`);
      this.voiceCtrl?.destruct();
      this.corgiSwiftQueue.shift();
      this.corgiSwiftClearQueue();
    }
  }

  /// * MUSIC SECTION * ///

  private printSongsList(songs: { index: number; song: Song }[]): string {
    return songs.map((s) => `#${s.index} : ${s.song.name}`).join("\n");
  }

  private songOptions?: SongOptions[];
  private djCommands?: DJCommands;
  /**
   * Activate DJ Feature, see [Salim Bot](https://github.com/Leomotors/Salim-Bot)
   *
   * Basically, like other part of this framework, you need to provide all
   * information and the framework will take care of them
   */
  useDJ(SongOptions: SongOptions[], Options: DJCommands) {
    this.songOptions = SongOptions;
    this.djCommands = Options;
  }

  async requestSong(msg: Message) {
    // * Validate User
    const fallbackMsg = this.voiceOptions?.fallback;
    let failMsg: string | undefined;

    const validateRes = VoiceControl.validateUser(msg);
    switch (validateRes) {
      case VoiceValidateResult.NOT_JOINABLE:
        failMsg = fallbackMsg?.not_joinable;
        break;
      case VoiceValidateResult.NO_CHANNEL:
        failMsg = fallbackMsg?.no_channel;
        break;
      case VoiceValidateResult.STAGE_CHANNEL:
        failMsg = fallbackMsg?.stage_channel;
        break;
    }

    if (validateRes) {
      if (failMsg) {
        if (fallbackMsg!.reply) await msg.reply(failMsg);
        else await msg.channel.send(failMsg);
      }
      return;
    }

    // * Prepare Music Data
    let totalLength = 0;
    const allSongs: Song[] = [];
    const breakpoints = [0];
    this.songOptions!.forEach((so) => {
      totalLength += so.loader.length;
      breakpoints.push(breakpoints.at(-1)! + so.loader.length);
      allSongs.push(...so.loader.getData());
    });

    const userQuery = msg.content
      .split(" ")
      .filter((w) => w.length)
      .slice(1)
      .join(" ");

    const getCategory = (index: number) =>
      this.songOptions![lowerBoundLinear(breakpoints, index)]!;

    let selectedIndex = Math.floor(Math.random() * totalLength);

    if (this.djCommands?.overrides) {
      const overrides = this.djCommands.overrides;

      if (overrides.direct_youtube) {
        if (
          checkPrefix(
            msg.content
              .split(" ")
              .slice(1)
              .filter((w) => w.length)
              .join(" "),
            overrides.direct_youtube.prefixes,
          )
        ) {
          this.corgiSwiftQueue.push({
            msg,
            type: "SONG",
            song: {
              url: msg.content.split(" ")[2]!,
            },
            category: "YouTube",
          });
          const m = this.djCommands.overrides.direct_youtube!.message;
          if (this.djCommands.overrides.direct_youtube!.reply)
            await msg.reply(m);
          else msg.channel.send(m);
          if (this.corgiSwiftQueue.length < 2) this.corgiSwiftClearQueue();
          return;
        }
      }
    }

    if (!this.djCommands!.play.random_only && userQuery) {
      // * User Search
      const matched: { index: number; song: Song }[] = [];
      for (let i = 0; i < totalLength; i++) {
        if (
          trim(allSongs[i]!.name?.toLowerCase() ?? "").includes(trim(userQuery))
        ) {
          if (!getCategory(i)!.appearance)
            matched.push({
              index: i,
              song: allSongs[i]!,
            });
        }
      }

      if (matched.length) {
        if (matched.length > 1) {
          const message = shorten(
            `${this.djCommands!.play.search_multiple_result}\n` +
              this.printSongsList(matched),
            1950,
          );

          if (this.djCommands!.play.reply) await msg.reply(message);
          else await msg.channel.send(message);
          return;
        }
        selectedIndex = matched[0]!.index;
      } else {
        const sf = this.djCommands!.play.search_fail;
        if (sf) {
          if (this.djCommands!.play.reply) await msg.reply(sf);
          else await msg.channel.send(sf);
          return;
        }
      }
    }

    const selectedSong = allSongs[selectedIndex]!;
    const selectedCategory = getCategory(selectedIndex);
    const category = selectedCategory.category;
    const onPlay = selectedCategory.onPlay;

    const isEmptyQueue = !this.corgiSwiftQueue.length;
    this.corgiSwiftQueue.push({
      msg,
      type: "SONG",
      song: selectedSong,
      category,
    });

    let message = onPlay.replace("{song_name}", selectedSong.name ?? "???");
    if (!isEmptyQueue) {
      if (this.corgiSwiftQueue[0]!.type == "TTS")
        message += ` ${this.djCommands!.play.onQueued.tts}`;
      else message += ` ${this.djCommands!.play.onQueued.song}`;
    }

    if (this.djCommands!.play.reply) await msg.reply(message);
    else await msg.channel.send(message);

    if (isEmptyQueue) this.corgiSwiftClearQueue();

    await this.djCommands?.afterRequest?.(msg);
  }

  private async corgiPlaySong(msg: Context, song: Song, category: string) {
    const embed = this.djCommands!.play.now_playing;
    if (embed?.send_embed) {
      try {
        const vidInfo = await ytdl.getBasicInfo(song.url);
        const user = getUser(msg);

        const msgE = new EmbedBuilder({
          title: embed.title ?? "Now Playing",
          description: `\`\`\`\n${
            song.name ?? vidInfo.videoDetails.title
          }\n\`\`\``,
          author: {
            name: user.username,
            iconURL: user.avatarURL() ?? user.defaultAvatarURL,
          },
        })
          .setColor(embed.color ?? "Blue")
          .setThumbnail(vidInfo.videoDetails.thumbnails[0]!.url)
          .addFields(
            {
              name: embed.requested_by ?? "Requested by",
              value: `<@!${user.id}>`,
            },
            {
              name: embed.duration ?? "Duration",
              value: durationFormat(
                vidInfo.player_response.videoDetails.lengthSeconds,
              ),
            },
            {
              name: embed.link ?? "Link",
              value: `[${embed.click_here ?? "Click"}](${song.url})`,
            },
          )
          .setTimestamp()
          .setFooter({ text: embed.footer ?? "" });
        await msg.channel?.send({ embeds: [msgE] });
      } catch (err) {
        Logger.log(
          `Error getting info of ${song.name} or sending its embed : ${err}`,
          "ERROR",
        );
        return;
      }
    }

    try {
      await this.voiceCtrl!.playSong(
        song.url,
        song.name ?? "<Other Sauce Song>",
        category,
      );
    } catch (err) {
      Logger.log(
        `DJCorgi Music Deliwry Mission Failed while playing ${song.name}: ${err}`,
      );
      if (this.voiceOptions?.fallback) {
        const iemsg = this.voiceOptions.fallback.internal;
        if (iemsg) {
          if (this.voiceOptions.fallback.reply) await msg.reply(iemsg);
          else await msg.channel?.send(iemsg);
        }
      }
      this.voiceCtrl?.destruct();
    }
  }
}
