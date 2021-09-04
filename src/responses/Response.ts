// * Response.ts : Take care of incoming Message

import { Message } from "discord.js";

import { BotClient } from "../client/Client";
import { Detector } from "../core/Detector";
import { Voice } from "../core/Voice";
import { Logger } from "../utils/Logger";
import { Quotes } from "../core/Quotes";

import { MentionQuery } from "./MentionQuery";
import { StaticQuery } from "./StaticQuery";

export class Response {
    client?: BotClient;
    queries: MentionQuery[];

    constructor() {
        this.queries = [new StaticQuery()];
    }

    onMessage(msg: Message): void {
        if (this.client == null) {
            console.log("this.client is null", "ERROR");
        }
        if (msg.author == this.client?.user) {
            // * Own Message: Ignore it
            return;
        }

        Logger.log(`Incoming Message from ${msg.author.tag} : ${msg.content}`);

        if (msg.content.startsWith("!salim")) {
            if (msg.member) {
                // * This is always true but in case some error did happen
                Voice.joinTo(msg.member);
            }
            else {
                Logger.log("message.member is null or undefined", "WARNING");
            }
            return;
        }

        // * Mention Queries
        if (this.client?.user && msg.content.includes(this.client.user.id)) {
            for (const query of this.queries) {
                if (query.check(msg))
                    return;
            }
        }

        // * Base Case: Detect ชังชาติ
        if (Detector.isชังชาติ(msg.content)) {
            Logger.log(`ชังชาติ detector detected ${Detector.last_detected}`);
            const quote = Quotes.getQuote();
            msg.channel.send(`${quote.quote}`);
            Logger.log(`Replied to พวกชังชาติ with ${quote.quote} (${quote.id.type} #${quote.id.id})`);
            Voice.sayTo(msg.member, quote.quote);
            return;
        }
    }

    getFunction(client: BotClient): (msg: Message) => void {
        this.client = client;
        return this.onMessage;
    }
}
