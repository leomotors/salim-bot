// * Detector.ts : Take care of Detecting ชังชาติ

import * as fs from "fs";

import { Logger } from "../utils/Logger";
import { trim } from "../utils/String";

export class Detector {
    static keywords: string[] = [];
    static last_detected = "";

    static construct(): void {
        fs.readFile("./data/keywords.json", "utf-8", (err, data) => {
            if (err) {
                Logger.log(`Detector @ constructor: ${err}`);
            }

            const kwff: string[] = JSON.parse(data).ชังชาติ;

            for (const kw of kwff) {
                if (Detector.keywords.includes(kw)) {
                    Logger.log(`[IMPORT WARNING] Duplicate Keywords: ${kw}`, "WARNING", false);
                }
                else {
                    Detector.keywords.push(kw);
                }
            }
        });
    }

    static isชังชาติ(message: string): boolean {
        message = trim(message);

        for (const kw of Detector.keywords) {
            if (message.includes(kw)) {
                Detector.last_detected = kw;
                return true;
            }
        }

        return false;
    }
}
