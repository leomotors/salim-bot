import { CocoaEmbed, Loader } from "cocoa-discord-utils";
import { NonEmptyArray } from "cocoa-discord-utils/internal/base";
import { CogSlashClass, SlashCommand } from "cocoa-discord-utils/slash/class";
import { AutoBuilder, CocoaOption } from "cocoa-discord-utils/template";

import {
    Client,
    CommandInteraction,
    MessageActionRow,
    MessageSelectMenu,
    SelectMenuInteraction,
} from "discord.js";

import * as fs from "node:fs";
import { v4 as uuid } from "uuid";

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

const quizes = Loader.fromFile<Quiz>("Quiz Loader", "./data/quiz.json");

class QuizManager {
    private quiz: Quiz;
    private readonly quizId = uuid().split("-")[0];
    private originalContext: CommandInteraction;
    private currentChoiceOrder: string[] = [];
    private currentIndex = 0;
    private score = 0;
    ongoing = true;

    /** Make Index for Quiz, **WARNING**: This method mutates the class */
    makeEmbed(index: number): [CocoaEmbed, MessageActionRow] {
        this.currentIndex = index;
        const questions = this.quiz.questions;
        const question = questions[index];

        const choices = [question.correct, ...question.wrong].sort(
            (_, __) => Math.random() - 0.5
        );

        this.currentChoiceOrder = choices;

        const desc = `ข้อที่ ${index + 1} จาก ${questions.length}\n\n**${
            question.question
        }**\n\n${choices.map((c) => `- ${c}`).join("\n")}\n`;

        const select = new MessageSelectMenu()
            .setCustomId(this.quizId)
            .setPlaceholder("คำตอบของคุณ")
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions(
                ...choices.map((choice, index) => {
                    return {
                        label: trim(choice, 100),
                        description: "",
                        value: `${index}`,
                    };
                })
            );

        const row = new MessageActionRow().addComponents(select);

        return [
            quiz_style
                .use(this.originalContext)
                .setTitle(this.quiz.name)
                .setDescription(desc),
            row,
        ];
    }

    async handleInteraction(ctx: SelectMenuInteraction) {
        if (ctx.customId != this.quizId) {
            await ctx
                .editReply({
                    components: [],
                    content: "นี่คืออะไร ฉันไม่รู้จัก",
                })
                .catch(console.error);
            return;
        }

        const userchoice = ctx.values[0];

        if (
            this.currentChoiceOrder[+userchoice] ==
            this.quiz.questions[this.currentIndex].correct
        ) {
            this.score++;
        }

        if (this.currentIndex + 1 < this.quiz.questions.length) {
            const [emb, row] = this.makeEmbed(this.currentIndex + 1);

            await ctx.update({ embeds: [emb], components: [row] });
        } else {
            this.ongoing = false;

            const emb = this.summaryEmbed();

            await ctx.update({ embeds: [emb], components: [] });
        }
    }

    summaryEmbed() {
        const sr = this.score / this.quiz.questions.length;

        const emb = quiz_style
            .use(this.originalContext)
            .setTitle("สรุปผลการทำแบบทดสอบ")
            .setThumbnail(this.originalContext.user.avatarURL({ size: 4096 }))
            .addFields(
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
                }
            );

        return emb;
    }

    constructor(ctx: CommandInteraction, index: number) {
        this.quiz = quizes.data[index];
        this.quiz.questions.sort((_, __) => Math.random() - 0.5);
        this.originalContext = ctx;
    }
}

function getChoices(): [string, string][] {
    const obj = JSON.parse(
        fs.readFileSync("./data/quiz.spec.json").toString()
    ) as string[];

    return obj.map((o, index) => [o, `${index}`]);
}

export default class QuizCog extends CogSlashClass {
    private quizManager: { [guildIds: string]: QuizManager } = {};
    private client: Client;

    constructor(client: Client) {
        super(
            "Salim Quiz",
            "น้อนสลิ่มต้องการทดสอบความรู้คุณเกี่ยวกับประวัติศาสตร์ชาติไทย"
        );

        this.client = client;

        this.client.on("interactionCreate", (interaction) => {
            if (!interaction.isSelectMenu()) return;

            this.quizManager[interaction.guildId!]
                ?.handleInteraction(interaction)
                .catch(console.error);
        });
    }

    @SlashCommand(
        AutoBuilder("Start the Quiz")
            .addStringOption((option) =>
                option
                    .setName("quiz_name")
                    .setDescription("แบบทดสอบที่คุณต้องการทำ")
                    .addChoices(getChoices())
                    .setRequired(true)
            )
            .addBooleanOption(CocoaOption("force", "Force creating new quiz"))
    )
    async quiz(ctx: CommandInteraction) {
        const force = ctx.options.getBoolean("force");
        const quiz_id = +ctx.options.getString("quiz_name", true);

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
