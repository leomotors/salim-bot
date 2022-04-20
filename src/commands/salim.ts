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

import chalk from "chalk";
import fs from "fs/promises";
import { FrameWorkVersion } from "s-bot-framework";

import { style } from "./styles";

export default class Salim extends CogSlashClass {
    constructor() {
        super("Salim Cog", "Main Slash Cog of Salim Bot");
    }

    @SlashCommand(
        AutoBuilder("Get Status of Salim Bot").addBooleanOption(Ephemeral())
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
            .addFields(...(await getStatusFields(ctx)));

        await ctx.reply({ embeds: [emb], ephemeral });
    }

    @SlashCommand(
        AutoBuilder("Add quote เข้าคลัง").addStringOption(
            CocoaOption("quote", "quote คุ ณ ภ า พ ที่ต้องการนำเข้าคลัง")
        )
    )
    async train(ctx: CommandInteraction) {
        await ctx.deferReply();

        const quote = ctx.options.getString("quote", true);

        let morequotes = {} as { วาทกรรมสลิ่ม: string[] };
        try {
            morequotes = JSON.parse(
                (await fs.readFile("data/morequotes.json")).toString()
            );
        } catch (e) {
            console.log(chalk.yellow("[INFO] morequotes is initialized"));
            morequotes = { วาทกรรมสลิ่ม: [] };
        }

        if (morequotes.วาทกรรมสลิ่ม.includes(quote)) {
            await ctx.followUp(
                "ซ้ำครับ หัดใช้สมองบ้างสิครับ ทำตัวเป็นสามกีบไปได้"
            );
            return;
        }

        morequotes.วาทกรรมสลิ่ม.push(quote);

        await fs.writeFile(
            "data/morequotes.json",
            JSON.stringify(morequotes, null, 4)
        );

        await ctx.followUp(
            "กระผมน้อนสลิ่มจะจดจำแล้วนำไปใช้ครับ ทั้งนี้กรุณาฝากเรียนไปที่เจ้าของบอทให้รีโหลดด้วย"
        );
    }
}
