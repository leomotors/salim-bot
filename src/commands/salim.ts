import { CocoaVersion } from "cocoa-discord-utils/meta";
import { CogSlashClass, SlashCommand } from "cocoa-discord-utils/slash/class";
import {
    AutoBuilder,
    Ephemeral,
    getEphemeral,
    getStatusFields,
} from "cocoa-discord-utils/template";

import { CommandInteraction } from "discord.js";

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
}
