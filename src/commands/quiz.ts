import { CocoaEmbed, ArrayLoader } from "cocoa-discord-utils";
import { NonEmptyArray } from "cocoa-discord-utils/internal/base";
import {
  CogSlashClass,
  Param,
  SlashCommand,
} from "cocoa-discord-utils/slash/class";

import {
  ActionRowBuilder,
  Client,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
} from "discord.js";

import * as fs from "node:fs";
import { v4 as uuid } from "uuid";

import { Actions } from "../actions";
import { updateUserCredit } from "../prisma";

import { quiz_style } from "./styles";

interface Question {
  question: string;
  correct: string;
  wrong: NonEmptyArray<string>;
}

interface Quiz {
  name: string;
  source: string;
  questions: Question[];
}

function trim(str: string, len: number) {
  if (str.length >= len) {
    return str.slice(0, len - 4) + "...";
  }

  return str;
}

const quizes = ArrayLoader.fromFile<Quiz>("Quiz Loader", "./data/quiz.json");

class QuizManager {
  private quiz: Quiz;
  private readonly quizId = uuid().split("-")[0]!;
  private originalContext: SlashCommand.Context;
  private currentChoiceOrder: string[] = [];
  private currentIndex = 0;
  private score = 0;
  ongoing = true;

  /** Make Index for Quiz, **WARNING**: This method mutates the class */
  makeEmbed(
    index: number,
  ): [CocoaEmbed, ActionRowBuilder<StringSelectMenuBuilder>] {
    this.currentIndex = index;
    const questions = this.quiz.questions;
    const question = questions[index]!;

    const choices = [question.correct, ...question.wrong].sort(
      (_, __) => Math.random() - 0.5,
    );

    this.currentChoiceOrder = choices;

    const desc = `ข้อที่ ${index + 1} จาก ${questions.length}\n\n**${
      question.question
    }**\n\n${choices.map((c) => `- ${c}`).join("\n")}\n`;

    const select = new StringSelectMenuBuilder()
      .setCustomId(this.quizId)
      .setPlaceholder("คำตอบของคุณ")
      .setMinValues(1)
      .setMaxValues(1)
      .addOptions(
        ...choices.map((choice, index) => ({
          label: trim(choice, 100),
          value: `${index}`,
        })),
      );

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      select,
    );

    return [
      quiz_style
        .use(this.originalContext)
        .setTitle(this.quiz.name)
        .setDescription(desc),
      row,
    ];
  }

  async handleInteraction(ctx: StringSelectMenuInteraction) {
    if (ctx.customId != this.quizId) {
      await ctx
        .editReply({
          components: [],
          content: "นี่คืออะไร ฉันไม่รู้จัก",
        })
        .catch(console.error);
      return;
    }

    const userchoice = ctx.values[0]!;

    if (
      this.currentChoiceOrder[+userchoice] ==
      this.quiz.questions[this.currentIndex]!.correct
    ) {
      this.score++;
    }

    if (this.currentIndex + 1 < this.quiz.questions.length) {
      const [emb, row] = this.makeEmbed(this.currentIndex + 1);

      await ctx.update({ embeds: [emb.toJSON()], components: [row] });
    } else {
      this.ongoing = false;

      const emb = this.summaryEmbed();

      await updateUserCredit(
        this.originalContext,
        (this.score / this.quiz.questions.length - 0.6) * Actions.QuizVar,
      );

      await ctx.update({ embeds: [emb.toJSON()], components: [] });
    }
  }

  summaryEmbed() {
    const sr = this.score / this.quiz.questions.length;

    const emb = quiz_style
      .use(this.originalContext)
      .setTitle("สรุปผลการทำแบบทดสอบ")
      .setThumbnail(this.originalContext.user.avatarURL({ size: 4096 }))
      .addFields([
        {
          name: "ชื่อแบบทดสอบ",
          value: this.quiz.name,
        },
        {
          name: "ผู้แต่งแบบทดสอบ",
          value: this.quiz.source,
        },
        {
          name: "คะแนนของคุณ",
          value: `${this.score}/${this.quiz.questions.length}`,
        },
        {
          name: "ยศของคุณ",
          value:
            sr >= 0.8
              ? "บุคคลผู้ได้รับรองว่ามีความรักชาติ"
              : sr >= 0.6
              ? "บุคคลที่ผ่านการทดสอบ"
              : sr >= 0.3
              ? "พวกสามกีบชังชาติ"
              : "สามกีบที่ชังชาติร้ายแรง ต้องถูกกำจัด",
        },
      ]);

    return emb;
  }

  constructor(ctx: SlashCommand.Context, index: number) {
    this.quiz = quizes.data[index]!;
    this.quiz.questions.sort((_, __) => Math.random() - 0.5);
    this.originalContext = ctx;
  }
}

function getChoices() {
  const obj = JSON.parse(
    fs.readFileSync("./data/quiz.index.json").toString(),
  ) as string[];

  return obj.map((o, index) => ({ name: o, value: index + "" }));
}

export default class QuizCog extends CogSlashClass {
  private quizManager: { [guildIds: string]: QuizManager } = {};
  private client: Client;

  constructor(client: Client) {
    super(
      "Salim Quiz",
      "น้อนสลิ่มต้องการทดสอบความรู้คุณเกี่ยวกับประวัติศาสตร์ชาติไทย",
    );

    this.client = client;

    this.client.on("interactionCreate", (interaction) => {
      if (!interaction.isStringSelectMenu()) return;

      this.quizManager[interaction.guildId!]
        ?.handleInteraction(interaction)
        .catch(console.error);
    });
  }

  @SlashCommand("Start the Quiz")
  async quiz(
    ctx: SlashCommand.Context,
    @Param.Choices<Param.String.Type>(getChoices())
    @Param.String("แบบทดสอบที่คุณต้องการทำ")
    quiz_name: Param.String.Type,
    @Param.Boolean("Force creating new quiz", { required: false })
    force: Param.Boolean.Nullable,
  ) {
    const quiz_id = +quiz_name;

    await quizes.initialPromise;

    if (this.quizManager[ctx.guildId!]?.ongoing && !force) {
      await ctx.reply("คุณต้องกลับไปทำแบบทดสอบก่อนหน้าให้เสร็จก่อน");
      return;
    }

    this.quizManager[ctx.guildId!] = new QuizManager(ctx, quiz_id);

    const [emb, row] = this.quizManager[ctx.guildId!]!.makeEmbed(0);

    await ctx.reply({ embeds: [emb], components: [row] });
  }
}
