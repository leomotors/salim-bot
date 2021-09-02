// * Detector.ts : Take care of Detecting ชังชาติ

import * as fs from "fs";
import { Logger } from "../utils/Logger";

export class Detector {
    keywords: string[] = [];
    last_detected = "";

    constructor() {
        fs.readFile("./data/keywords.json", "utf-8", (err, data) => {
            if (err) {
                Logger.log(`Detector @ constructor: ${err}`);
            }

            const kwff: string[] = JSON.parse(data.toString()).ชังชาติ;

            for (const kw of kwff) {
                if (this.keywords.includes(kw)) {
                    Logger.log(`[IMPORT WARNING] Duplicate Keywords: ${kw}`, "WARNING", false);
                }
                else {
                    this.keywords.push(kw);
                }
            }
        });
    }

    isชังชาติ(message: string): boolean {
        message = message.replace(/^\s+/, "").toLowerCase();

        for (const kw of this.keywords) {
            if (message.includes(kw)) {
                this.last_detected = kw;
                return true;
            }
        }

        return false;
    }
}
