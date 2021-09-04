// * StaticQuery.ts : Static Response

import { Message } from "discord.js";

import MentionQuery from "./MentionQuery";
import Voice from "../core/Voice";
import Logger from "../utils/Logger";
import PackageInfo from "../constants/PackageInfo";

const introduceMessage =
    `ส วั ส ดี ค รั บ ท่ า น ส ม า ชิ ก ช ม ร ม ค น รั ก ก ะ สั ส ทุ ก ท่ า น
ผมเป็น ส ลิ่ ม ที่ ใ จ เ ก เ ร เพราะความ รั ก ช า ติ ก่ อ ตั ว ใ น ใ จ ฉั น 
ตอนนี้ผมอยู่ที่เวอร์ชั่น ${PackageInfo.pkg_version} และกำลังวิวัฒนาการอยู่เรื่อยๆ
Sauce Code ของผมอยู่ที่นี่ https://github.com/Leomotors/Salim-Bot
วาทกรรมสลิ่มที่ผมใช้ด่าพวกสามกีบอย่างคุณ มาจากที่นี่ https://github.com/narze/awesome-salim-quotes`;

export default class StaticQuery extends MentionQuery {
    constructor() {
        super([
            {
                keywords: ["introduce", "แนะนำตัว", "しょうかい", "紹介"],
                response: (msg: Message) => {
                    msg.channel.send(introduceMessage);
                    Voice.sayTo(msg.member, introduceMessage);
                    Logger.log(`Introduced myself to ${msg.author.tag}`);
                }
            }
        ]);
    }
}
