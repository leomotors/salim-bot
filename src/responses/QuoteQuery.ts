// * QuoteQuery.ts : Query about Quotes and Keywords Count

import { Message } from "discord.js";

import { Detector } from "../core/Detector";
import { Logger } from "../utils/Logger";
import { MentionQuery } from "./MentionQuery";
import { Voice } from "../core/Voice";
import { Quotes } from "../core/Quotes";

export class QuoteQuery extends MentionQuery {
    constructor() {
        super([
            {
                keywords: ["วาทกรรม", "ด่า", "quote"],
                response: (msg: Message) => {
                    const reply = `ตอนนี้ผมมีวาทกรรมมีพร้อมจะด่าพวกสามกีบอย่างคุณ ${Quotes.quotesCount} ประโยค`;
                    msg.channel.send(reply);
                    Voice.sayTo(msg.member, reply);
                    Logger.log("Query about Quotes Count answered");
                }
            },
            {
                keywords: ["ไม่ชอบ", "หมิ่น", "คีย", "key"],
                response: (msg: Message) => {
                    const reply = `มันก็มีคำพูดอยู่ ${Detector.keywordsCount} คำที่สามกีบชอบพูดแล้วทำให้ผมไม่สบายใจ`;
                    msg.channel.send(reply);
                    Voice.sayTo(msg.member, reply);
                    Logger.log("Query about Keywords Count answered");
                }
            }
        ], true);
    }
}
