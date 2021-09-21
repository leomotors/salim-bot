// * WhyImWrong.ts : ผมผิดอะไร

import { Message } from "discord.js";

import Detector from "../core/Detector";
import MentionQuery from "./MentionQuery";
import Voice from "../core/Voice";
import Logger from "../utils/Logger";

export default class WhyImWrong extends MentionQuery {
    constructor() {
        super([
            {
                keywords: ["ผิด", "wrong"],
                response: (msg: Message) => {
                    const replymsg = `พวกคุณผิดที่พูดคำว่า ${Detector.last_detected} ถือเป็นการคุบคามสถาบันอย่างร้ายแรง ไม่สมควรได้รับการให้อภัย`;
                    msg.reply(replymsg);
                    Voice.sayTo(msg.member, replymsg);
                    Logger.log(`Told ${msg.author.tag} why they are ภัยคุกคามต่อสถาบัน`);
                }
            }
        ]);
    }
}
