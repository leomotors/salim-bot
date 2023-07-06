import { EmbedStyle } from "cocoa-discord-utils";
import { getElapsed } from "cocoa-discord-utils/meta";

export const style = new EmbedStyle({
  author: "invoker",
  color: 0xfee65c,
  footer: (ctx) => {
    return {
      text: `การตอบโต้ใช้เวลา ${getElapsed(
        ctx.createdAt,
      )} มิลลิวินาที・ทำด้วยหัวใจ เพื่อชาติ ศาสน์ กษัตริย์ 💛💛💛`,
    };
  },
});

export const quiz_style = style.extends({
  footer: {
    text: "ภูมิใจนำเสนอโดยทีมพัฒนาบอทสลิ่ม・ทำด้วยหัวใจ เพื่อชาติ ศาสน์ กษัตริย์ 💛💛💛",
  },
});
