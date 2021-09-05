// * Facebook.ts : Quality Facebook Page Recommendation

import { Message } from "discord.js";

import * as fs from "fs/promises";
import Logger from "../utils/Logger";
import MentionQuery from "./MentionQuery";

const facebookLoc = "./data/facebook.json";

interface Recommendation {
    message: string,
    id: number,
    name: string
}

export default class Facebook extends MentionQuery {
    static facebook: { name: string, url: string }[] = [];

    constructor() {
        super([
            {
                keywords: ["เฟส", "เฟซ", "fb", "face"],
                response: (msg: Message) => {
                    const recom = Facebook.recommendation;
                    msg.reply(recom.message);
                    Logger.log(`Recommended ${recom.name} (#${recom.id})`);
                }
            }
        ]);
    }

    static async construct(isReload = false): Promise<void> {
        const buffer = await fs.readFile(facebookLoc);
        Facebook.facebook = JSON.parse(buffer.toString()).คนรักสถาบัน;
        Logger.log(`[FETCH COMPLETE] Retrieved ${Facebook.facebook.length} Facebook Pages from File`, "SUCCESS", isReload);
    }

    static get recommendation(): Recommendation {
        const randIndex = Math.floor(Math.random() * Facebook.facebook.length);
        const fb = Facebook.facebook[randIndex];

        return {
            message: `ดิฉันแนะนำให้คุณให้ติดตาม ${fb.name} เผื่อคุณจะได้ตาสว่างบ้าง ${fb.url}`,
            id: randIndex + 1,
            name: fb.name
        };
    }

    static printAll(): void {
        let id = 1;
        for (const fb of Facebook.facebook) {
            console.log(`#${id} => ${fb.name}`);
            id++;
        }
    }
}
