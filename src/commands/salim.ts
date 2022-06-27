import { CocoaVersion } from "cocoa-discord-utils/meta";
import { CogSlashClass, SlashCommand } from "cocoa-discord-utils/slash/class";
import {
    AutoBuilder,
    CocoaOption,
    Ephemeral,
    getEphemeral,
    getStatusFields,
} from "cocoa-discord-utils/template";

import { CommandInteraction } from "discord.js";

import fs from "fs/promises";
import { FrameWorkVersion } from "s-bot-framework";

import { Actions } from "../actions";
import { combinedQuotes, localquotes, sclient } from "../legacy";
import { getUser, updateUserCredit } from "../prisma";

import { style } from "./styles";

function trim(str: string) {
    return str.replace(/\s/g, "").toLowerCase();
}

function lim(str: string, len = 256) {
    return str.length > len ? str.slice(0, len - 3) + "..." : str;
}

export default class Salim extends CogSlashClass {
    constructor() {
        super("Salim Cog", "คำสั่งหลักๆของบอทสลิ่ม");
    }

    @SlashCommand(
        AutoBuilder("รับสถานะของบอทสลิ่ม").addBooleanOption(Ephemeral())
    )
    async status(ctx: CommandInteraction) {
        const ephemeral = getEphemeral(ctx);

        const emb = style
            .use(ctx)
            .setTitle("สถานะของบอทสลิ่ม")
            .setDescription(
                `บอทสลิ่มเวอร์ชั่น ${process.env.npm_package_version}
สลิ่มบอทเฟรมเวิร์กเวอร์ชั่น ${FrameWorkVersion}
โกโก้ดิสคอร์ดยูทิลลิตี้เวอร์ชั่น ${CocoaVersion}`
            )
            .addFields(await getStatusFields(ctx));

        await ctx.reply({ embeds: [emb.toJSON()], ephemeral });
    }

    @SlashCommand(
        AutoBuilder("เพิ่มประโยค คุ ณ ภ า พ เข้าคลัง").addStringOption(
            CocoaOption("quote", "ประโยค คุ ณ ภ า พ ที่ต้องการนำเข้าคลัง", true)
        )
    )
    async train(ctx: CommandInteraction) {
        await ctx.deferReply();

        const quote = ctx.options.getString("quote", true);

        const morequotes = { วาทกรรมสลิ่ม: localquotes.getData() };

        if (combinedQuotes.getData().includes(quote)) {
            await ctx.followUp(
                "ซ้ำครับ หัดใช้สมองบ้างสิครับ ทำตัวเป็นสามกีบไปได้"
            );
            await updateUserCredit(ctx.user.id, Actions.DuplicateTrain);
            return;
        }

        morequotes.วาทกรรมสลิ่ม.push(quote);

        await fs.writeFile(
            "data/morequotes.json",
            JSON.stringify(morequotes, null, 4)
        );

        await ctx.followUp("กระผมน้อนสลิ่มจะจดจำแล้วนำไปใช้ครับ");
        await updateUserCredit(ctx.user.id, Actions.TrainQuote);

        await localquotes.loadData();
    }

    @SlashCommand(
        AutoBuilder("รับประโยคคุณภาพจากดัชนี").addIntegerOption(
            CocoaOption("index", "ดัชนีของประโยคคุณภาพที่ต้องการ", true)
        )
    )
    async getquote(ctx: CommandInteraction) {
        const index = ctx.options.getInteger("index", true);
        const quote = combinedQuotes.getData()[index - 1];

        if (!quote) {
            const r = "มันไม่มีคำพูดที่ตำแหน่งนั้นนะ หัดหาข้อมูลบ้าง อีสามกีบ";
            sclient.corgiSwiftJutsu(ctx, r);
            await ctx.reply(r);
            return;
        }

        sclient.corgiSwiftJutsu(ctx, quote);
        await ctx.reply(`${quote} [${combinedQuotes.getRefIndex(index - 1)}]`);
    }

    @SlashCommand(
        AutoBuilder("ค้นหาประโยคคุณภาพ")
            .addStringOption(CocoaOption("query", "คำที่ต้องการค้นหา", true))
            .addBooleanOption(Ephemeral())
    )
    async searchquote(ctx: CommandInteraction) {
        const ephemeral = getEphemeral(ctx);
        const query = ctx.options.getString("query", true);

        const results = Object.entries(combinedQuotes.getData()).filter((q) =>
            trim(q[1]).includes(trim(query))
        );

        let description = "";

        const limit = 700;
        let progressed = 0;
        for (const [i, q] of results.slice(0, 10)) {
            progressed++;
            description += `💭 ${lim(q).replaceAll(
                "*",
                "\\*"
            )} **[${combinedQuotes.getRefIndex(+i)}]**\n`;
            if (description.length > limit) break;
        }

        if (!description) {
            description = "ไม่พบคำที่ค้นหา";
        }

        if (results.length > progressed) {
            description += `หมายเหตุ: มีอีก ${
                results.length - progressed
            } คำที่พบ`;
        }

        const emb = style
            .use(ctx)
            .setTitle(`ผลการค้นหาคำพูดสลิ่มเจ๋งๆ คำที่ค้นหา: ${query}`)
            .setDescription(description)
            .addFields([
                {
                    name: "ขอบคุณที่มาคุณภาพ",
                    value: "[วาร์ป](https://watasalim.vercel.app/)",
                    inline: true,
                },
            ]);

        await ctx.reply({ embeds: [emb.toJSON()], ephemeral });
    }

    formatTime(ms_timestamp: number) {
        const t = Math.round(ms_timestamp / 1000);

        return `<t:${t}> (<t:${t}:R>)`;
    }

    socialCredit(score: number) {
        if (score < 0) {
            return "กบฎทรราช";
        } else if (score < 500) {
            return "บุคคลชังชาติขั้นรุนแรง เป็นภัยต่อความมั่นคง";
        } else if (score < 900) {
            return "พวกสามกีบชังชาติ";
        } else if (score < 1100) {
            return "พลเมืองทั่วไป";
        } else if (score < 1500) {
            return "ผู้มีความศรัทธาต่อพ่อหลวงของแผ่นดิน";
        } else if (score < 2000) {
            return "ผู้มีความจงรักภักดีต่อพ่อหลวงของแผ่นดิน";
        } else {
            return "พลเมืองไทยต้นแบบ ผู้ปิดทองหลังพระ";
        }
    }

    @SlashCommand(
        AutoBuilder("แสดงบัตรประจำตัวประชาชนชาวไทย").addUserOption(
            CocoaOption(
                "user",
                "บุคคลที่ต้องการให้แสดงข้อมูล ปล่อยว่างเพื่อแสดงของตัวคุณเอง"
            )
        )
    )
    async citizenstatus(ctx: CommandInteraction) {
        const user = ctx.options.getUser("user") ?? ctx.user;

        const gmember = ctx.guild?.members.cache.get(user.id);

        const puser = await getUser(user.id);

        const emb = style
            .use(ctx)
            .setTitle("บัตรประจำตัวประชาชนชาวไทย")
            .setDescription("บัตรที่แสดงสถานะพลเมืองของคุณ รวมถึงความประพฤติ")
            .setThumbnail(
                user.avatarURL() ??
                    "https://cdn.discordapp.com/embed/avatars/1.png"
            )
            .addInlineFields(
                {
                    name: "ชื่อ",
                    value: `<@${user.id}>`,
                },
                {
                    name: "วันเกิด",
                    value: this.formatTime(user.createdTimestamp),
                },
                {
                    name: "วันเข้าร่วม",
                    value: gmember?.joinedTimestamp
                        ? this.formatTime(gmember.joinedTimestamp)
                        : "ไม่ทราบวันเข้าร่วม อาจเป็นคนเถื่อน",
                },
                {
                    name: "คะแนนสังคม",
                    value: `${Math.round(puser.socialCredit)} แต้ม`,
                },
                {
                    name: "สถานะประชาชน",
                    value: this.socialCredit(puser.socialCredit),
                }
            );

        await ctx.reply({ embeds: [emb.toJSON()] });
    }
}
