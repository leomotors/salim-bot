// * StaticQuery.ts : Static Response

import { Message } from "discord.js";

import { MentionQuery } from "./MentionQuery";
import { Logger } from "../utils/Logger";

export class StaticQuery extends MentionQuery {
    constructor() {
        super(
            ["introduce", "แนะนำตัว"],
            (msg: Message) => {
                msg.channel.send("ส วั ส ดี ค รั บ ท่ า น ส ม า ชิ ก ช ม ร ม ค น รั ก ก ะ สั ส ทุ ก ท่ า น");
                Logger.log(`Introduced myself to ${msg.author.tag}`);
            }
        );
    }
}
