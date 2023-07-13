import { CocoaVersion } from "cocoa-discord-utils/meta";
import {
  CogSlashClass,
  Param,
  SlashCommand,
} from "cocoa-discord-utils/slash/class";
import { getStatusFields } from "cocoa-discord-utils/template";

import {
  ActionRowBuilder,
  Client,
  InteractionType,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  ModalSubmitInteraction,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

import { Actions } from "../actions.js";
import { combinedQuotes, sclient } from "../legacy.js";
import { getUser3rdParty, prisma, updateUserCredit } from "../prisma.js";
import { prismaQuote } from "../prismaQuote.js";

import { style } from "./styles.js";

function trim(str: string) {
  return str.replace(/\s/g, "").toLowerCase();
}

function lim(str: string, len = 256) {
  return str.length > len ? str.slice(0, len - 3) + "..." : str;
}

export default class Salim extends CogSlashClass {
  constructor(client: Client) {
    super("Salim Cog", "คำสั่งหลักๆของบอทสลิ่ม");

    client.on("interactionCreate", (ctx) => {
      if (ctx.type == InteractionType.ModalSubmit) {
        if (ctx.customId == "essay") {
          this.onEssaySubmit(ctx);
        }
      }
    });
  }

  @SlashCommand("รับสถานะของบอทสลิ่ม")
  async status(
    ctx: SlashCommand.Context,
    @Param.Ephemeral ephemeral: Param.Ephemeral.Type,
  ) {
    const emb = style
      .use(ctx)
      .setTitle("สถานะของบอทสลิ่ม")
      .setDescription(
        `บอทสลิ่มเวอร์ชั่น ${process.env.npm_package_version}
โกโก้ดิสคอร์ดยูทิลลิตี้เวอร์ชั่น ${CocoaVersion}`,
      )
      .addFields(await getStatusFields(ctx));

    await ctx.reply({
      embeds: [emb],
      ephemeral: ephemeral ?? false,
    });
  }

  @SlashCommand("เพิ่มประโยค คุ ณ ภ า พ เข้าคลัง")
  async train(
    ctx: SlashCommand.Context,
    @Param.String("ประโยค คุ ณ ภ า พ ที่ต้องการนำเข้าคลัง")
    quote: Param.String.Type,
  ) {
    await ctx.deferReply();

    if (combinedQuotes.getData().includes(quote)) {
      await ctx.followUp("ซ้ำครับ หัดใช้สมองบ้างสิครับ ทำตัวเป็นสามกีบไปได้");
      await updateUserCredit(ctx, Actions.DuplicateTrain);
      return;
    }

    await prisma.quote.create({
      data: {
        content: quote,
      },
    });

    await ctx.followUp("กระผมน้อนสลิ่มจะจดจำแล้วนำไปใช้ครับ");
    await updateUserCredit(ctx, Actions.TrainQuote);

    await prismaQuote.reload();
  }

  @SlashCommand("รับประโยคคุณภาพจากดัชนี")
  async getquote(
    ctx: SlashCommand.Context,
    @Param.Integer("ดัชนีของประโยคคุณภาพที่ต้องการ")
    index: Param.Integer.Type,
  ) {
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

  @SlashCommand("ค้นหาประโยคคุณภาพ")
  async searchquote(
    ctx: SlashCommand.Context,
    @Param.String("คำที่ต้องการค้นหา")
    query: Param.String.Type,
    @Param.Ephemeral ephemeral: Param.Ephemeral.Type,
  ) {
    const results = Object.entries(combinedQuotes.getData()).filter((q) =>
      trim(q[1]).includes(trim(query)),
    );

    let description = "";

    const limit = 700;
    let progressed = 0;
    for (const [i, q] of results.slice(0, 10)) {
      progressed++;
      description += `💭 ${lim(q).replaceAll(
        "*",
        "\\*",
      )} **[${combinedQuotes.getRefIndex(+i)}]**\n`;
      if (description.length > limit) break;
    }

    if (!description) {
      description = "ไม่พบคำที่ค้นหา";
    }

    if (results.length > progressed) {
      description += `หมายเหตุ: มีอีก ${results.length - progressed} คำที่พบ`;
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

    await ctx.reply({ embeds: [emb], ephemeral: ephemeral ?? false });
  }

  formatTime(ms_timestamp: number) {
    const t = Math.round(ms_timestamp / 1000);

    return `<t:${t}> (<t:${t}:R>)`;
  }

  socialCredit(score: number) {
    if (score < 0) {
      return "อมนุษย์ที่ไม่ได้มีประโยชน์ใด ๆ ต่อแผ่นดินของพ่อ อยู่อย่างหนักแผ่นดิน สมควรได้รับการกำจัดทิ้ง";
    } else if (score < 500) {
      return "นักโทษที่มีพฤติกรรมกระทำความผิดในลักษณะเดิมหลายครั้ง ไม่ควรได้รับการประกันตัว";
    } else if (score < 700) {
      return "บุคคลชังชาติระดับร้ายแรง เป็นภัยต่อความมั่นคงภายในราชอาณาจักร";
    } else if (score < 800) {
      return "บุคคลที่ต้องเฝ้าระวังการสร้างสถานการณ์ความไม่สงบเรียบร้อย";
    } else if (score < 900) {
      return "พวกสามกีบชังชาติ";
    } else if (score < 1100) {
      return "พลเมืองทั่วไป";
    } else if (score < 1200) {
      return "คนดี";
    } else if (score < 1300) {
      return "คนดียิ่งกว่าคนดี";
    } else if (score < 1500) {
      return "ผู้ที่จงรักภักดีพร้อมเป็นข้ารองบาททุกชาติไปและน้อมนำคำสอนของพ่อหลวงมาปฏิบัติ";
    } else if (score < 2000) {
      return "ผู้สมควรได้รับพระราชทานเครื่องราชอิสริยาภรณ์";
    } else {
      return "พลเมืองไทยต้นแบบ ผู้รักชาติ ศาสน์ กษัตริย์";
    }
  }

  @SlashCommand("แสดงบัตรประจำตัวประชาชนชาวไทย")
  async citizenstatus(
    ctx: SlashCommand.Context,
    @Param.User("บุคคลที่ต้องการให้แสดงข้อมูล ปล่อยว่างเพื่อแสดงของตัวคุณเอง", {
      required: false,
    })
    user: Param.User.Nullable,
  ) {
    user ??= ctx.user;

    const gmember = ctx.guild?.members.cache.get(user.id);

    const puser = await getUser3rdParty(user, ctx);

    const emb = style
      .use(ctx)
      .setTitle("บัตรประจำตัวประชาชนชาวไทย")
      .setDescription("บัตรที่แสดงสถานะพลเมืองของคุณ รวมถึงความประพฤติ")
      .setThumbnail(user.avatarURL() ?? user.defaultAvatarURL)
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
        },
      );

    await ctx.reply({ embeds: [emb] });
  }

  @SlashCommand("แสดงอันดับคะแนนสังคมของประชาชน")
  async citizenranking(ctx: SlashCommand.Context) {
    const topUsers = await prisma.user.findMany({
      orderBy: {
        socialCredit: "desc",
      },
      include: {
        profile: true,
      },
      where: {
        socialCredit: {
          gte: 900,
        },
      },
      take: 5,
    });

    const bottomUsers = await prisma.user.findMany({
      orderBy: {
        socialCredit: "asc",
      },
      include: {
        profile: true,
      },
      where: {
        socialCredit: {
          lt: 900,
        },
      },
      take: 5,
    });

    const avg = await prisma.user.aggregate({
      _avg: {
        socialCredit: true,
      },
    });

    const emb = style
      .use(ctx)
      .setTitle("อันดับคะแนนสังคมของประชาชน")
      .setDescription(
        "ตารางด้านล่างจะแสดงอันดับของประชาชนพลเมืองดี และพวกหนักแผ่นดิน ท่านอาจจะเห็นบุคคลที่อยู่เซิร์ฟเวอร์อื่น ถึงแม้คุณจะไม่รู้จักพวกเขา แต่หากเขาเป็นพลเมืองดี เขาควรได้รับการยกย่อง แต่หากเขาเป็นพวกหนัแผ่นดิน เขาก็ควรได้รับการประนาม",
      )
      .addFields(
        {
          name: "อันดับประชาชนดีเด่น",
          value: topUsers
            .map(
              (u, i) =>
                `${i + 1}. ท่าน ${u.profile?.username} ${u.socialCredit.toFixed(
                  2,
                )} แต้ม`,
            )
            .join("\n"),
        },
        {
          name: "อันดับประชาชนหนักแผ่นดิน",
          value: bottomUsers
            .map(
              (u, i) =>
                `${i + 1}. ไอ้เวร ${u.profile
                  ?.username} ${u.socialCredit.toFixed(2)} แต้ม`,
            )
            .join("\n"),
        },
        {
          name: "คะแนนสังคมเฉลี่ย",
          value: avg._avg.socialCredit
            ? `${avg._avg.socialCredit.toFixed(2)} แต้ม`
            : "เกิดข้อผิดพลาดร้ายแรง ฝีมือทักษิณแน่นอน",
        },
      );

    await ctx.reply({ embeds: [emb] });
  }

  private static readonly _16hours = 16 * 60 * 60 * 1000;

  @SlashCommand("เขียนเรียงความถึงพ่อหลวงเพื่อรับแต้มคะแนนสังคม")
  async essay(ctx: SlashCommand.Context) {
    const cooldown =
      (
        await prisma.cooldown.findUnique({
          where: { userId: ctx.user.id },
        })
      )?.essayToDad?.getTime() ?? 0;

    if (Date.now() - cooldown < Salim._16hours) {
      await ctx.reply(
        `ขอบคุณสำหรับความสนใจ แต่คุณต้องรอจนถึง ${this.formatTime(
          cooldown + Salim._16hours,
        )} ถึงจะเขียนเรียงความอีกครั้งได้`,
      );
      return;
    }

    const modal = new ModalBuilder()
      .setTitle("แบบฟอร์มส่งข้อสอบการเขียนเรียงความถึงในหลวง")
      .setCustomId("essay");

    const form = new TextInputBuilder()
      .setLabel("เขียนอย่างน้อย ๑๑๑๒ ตัวอักษร")
      .setCustomId("essay-form")
      .setStyle(TextInputStyle.Paragraph)
      .setMaxLength(2048);

    const row =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        form,
      );

    modal.addComponents(row);

    await ctx.showModal(modal);
  }

  private async onEssaySubmit(ctx: ModalSubmitInteraction) {
    const content = ctx.fields.getTextInputValue("essay-form");

    let msg = "";
    let point = 0;
    if (content.length < 1112) {
      msg = `ขอบคุณคุณ <@${ctx.user.id}> สำหรับการส่งการเขียนเรียงความนี้ แต่คุณเขียนไม่ถูกต้องตามเงื่อนไข คือความยาวไม่ถึง ๑๑๑๒ ตัวอักษรค่ะ ดิฉันขอหักคะแนนสังคม ๑๑๒ เป็นการลงโทษนะค่ะ`;
      point = -112;
    } else {
      msg = `ขอบคุณคุณ <@${ctx.user.id}> สำหรับการส่งการเขียนเรียงความนี้ คุณได้แสดงความจงรักภักดีต่อพ่อหลวงแล้ว ดิฉันขอมอบคะแนนสังคม ๙ คะแนนเป็นการตอบแทนคะ`;
      point = 9;
    }

    await updateUserCredit(ctx, point);
    await prisma.essay.create({
      data: {
        user: {
          connect: {
            id: ctx.user.id,
          },
        },
        content,
      },
    });
    await prisma.cooldown.upsert({
      where: {
        userId: ctx.user.id,
      },
      create: {
        essayToDad: new Date(),
        user: {
          connect: {
            id: ctx.user.id,
          },
        },
      },
      update: {
        essayToDad: new Date(),
      },
    });

    await ctx.reply(msg);
  }
}
