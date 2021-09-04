// * MessageHandler.ts : Take care of incoming Message

import { Message } from "discord.js";

import { Detector } from "../core/Detector";
import { Voice } from "../core/Voice";
import { Logger } from "../utils/Logger";
import { Quotes } from "../core/Quotes";

export class MessageHandler {
    onMessage(msg: Message): void {
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

        if (Detector.isชังชาติ(msg.content)) {
            Logger.log(`ชังชาติ detector detected ${Detector.last_detected}`);
            const quote = Quotes.getQuote();
            msg.channel.send(`${quote.quote}`);
            Logger.log(`Replied to พวกชังชาติ with ${quote.quote} (${quote.id.type} #${quote.id.id})`);
            Voice.sayTo(msg.member, quote.quote);
            return;
        }
    }

    getFunction(): (msg: Message) => void {
        return this.onMessage;
    }
}
