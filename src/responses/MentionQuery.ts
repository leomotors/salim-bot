// * MentionQuery.ts : Response when mentioned

import { Message } from "discord.js";

import { trim } from "../utils/String";

export class MentionQuery {
    keywords: string[];
    response: (msg: Message) => void;

    constructor(keywords: string[], response: (msg: Message) => void) {
        this.keywords = keywords;
        this.response = response;
    }

    check(msg: Message): boolean {
        for (const kw of this.keywords) {
            if (trim(msg.content).includes(kw)) {
                this.response(msg);
                return true;
            }
        }
        return false;
    }
}
