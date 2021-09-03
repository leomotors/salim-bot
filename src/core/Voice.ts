// * Voice.ts : Voice Control

import { Logger } from "../utils/Logger";

import { exec } from "child_process";
//import path from "path";

export class Voice {

    static tts(message: string): void {
        exec(`echo ${message} | python3 ./scripts/tts.py`, (error, stdout, stderr) => {
            if (error || stderr) {
                Logger.log(`Error Executing Python Script (tts): ${error?.message}${stderr ?? ""}`, "ERROR");
                return;
            }
        });
    }
}
