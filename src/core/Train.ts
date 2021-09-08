// * Train.ts : Train Center

import { Message } from "discord.js";
import * as fs from "fs";

import Logger from "../utils/Logger";
import Quotes from "./Quotes";
import { getFormattedTime } from "../utils/Time";

interface trainQuote {
    trainer: string,
    time: string,
    quote: string,
}

const trainSaveLoc = "./scripts/train.json";

export default class Train {
    static trainedCount = 0;

    static async train(msg: Message): Promise<void> {
        let trainQuotes: { data: trainQuote[] };

        try {
            const buffer = fs.readFileSync(trainSaveLoc);
            trainQuotes = JSON.parse(buffer.toString());
        }
        catch (err) {
            Logger.log("[Train] No train.json found or error occured, automatically created template object");
            trainQuotes = { data: [] };
        }

        const alreadyTrained: string[] = [];
        trainQuotes.data.map((quote: trainQuote) => alreadyTrained.push(quote.quote));

        const quote = msg.content.slice(7).replace("\n", " ");
        if (Quotes.asq_quotes.includes(quote) || Quotes.local_quotes.includes(quote) || alreadyTrained.includes(quote)) {
            msg.reply("ซ้ำครับ");
            Logger.log(`Trained by ${msg.author.tag} but that quote already exists`);
            return;
        }

        Train.trainedCount += 1;
        msg.reply("กระผม นศท. น้อนสลิ่ม จะจดจำ และนำไปใช้ ครับ!");
        msg.react("🇹🇭");
        Logger.log(`[TRAIN] น้อน นศท ได้รับการฝึกมาจาก ${msg.author.tag} บัดนี้กำลังรอท่านผู้บังคับบัญชาอนุมัติ`);

        trainQuotes.data.push({
            trainer: msg.author.tag,
            time: getFormattedTime(),
            quote: quote
        });

        try {
            fs.writeFileSync(trainSaveLoc, JSON.stringify(trainQuotes, null, 4));
        }
        catch (err) {
            Logger.log(`Error Occured while writing Train File: ${err}`, "ERROR");
        }
    }
}
