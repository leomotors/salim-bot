// * Response.ts : Take care of incoming Message

import { Message } from "discord.js";

import BotClient from "../client/Client";
import Detector from "../core/Detector";
import DJSalima from "../core/DJSalima";
import Voice from "../core/Voice";
import Logger from "../utils/Logger";
import Quotes from "../core/Quotes";
import Train from "../core/Train";

import MentionQuery from "./MentionQuery";
import Facebook from "./Facebook";
import QuoteQuery from "./QuoteQuery";
import StaticQuery from "./StaticQuery";

export default class Response {
    queries: MentionQuery[];

    constructor() {
        this.queries = [new StaticQuery(), new QuoteQuery(), new Facebook()];
    }

    getFunction(client: BotClient): (msg: Message) => void {
        return (msg: Message) => {
            if (client == null) {
                console.log("this.client is null", "ERROR");
            }
            if (msg.author == client.user) {
                // * Own Message: Ignore it
                return;
            }

            Logger.log(`Incoming Message from ${msg.author.tag} : ${msg.content}`);

            // * VC Function
            if (msg.content.toLowerCase().startsWith("!salim")) {
                if (msg.member) {
                    // * This is always true but in case some error did happen
                    Voice.joinTo(msg.member, msg);
                }
                else {
                    Logger.log("UNEXPECTED: message.member is null or undefined", "WARNING");
                }
                return;
            }

            if (msg.content.toLowerCase().startsWith("!dc") || msg.content.toLowerCase().startsWith("!leave")) {
                Voice.leaveChannel(msg);
                return;
            }

            // * DJSalima
            if (msg.content.toLowerCase().startsWith("!djsalima")) {
                if (msg.content.toLowerCase().split(" ").length > 1)
                    DJSalima.playSearch(msg);
                else
                    DJSalima.playRandomSong(msg);
                return;
            }

            // * Train
            if (msg.content.startsWith("!train")) {
                Train.train(msg);
                return;
            }

            // * Mention Queries
            if (client.user && msg.content.includes(client.user.id)) {
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
                msg.react("😡");
                Logger.log(`Replied to พวกชังชาติ with ${quote.quote} (${quote.id.type} #${quote.id.id})`);
                Voice.sayTo(msg.member, quote.quote, msg);
                return;
            }
        };
    }
}
