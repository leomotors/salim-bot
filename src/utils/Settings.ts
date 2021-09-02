// * Settings.ts : Take care of settings

import * as fs from "fs";
import { Logger } from "../utils/Logger";

const defaultSettings = {
    "allow_vc": true,
    "python_prefix": "python3",
    "do_log": true,
    "message_cache": 10,
    "allow_training": true,
    "limited_training": false,
    "salim_insiders": [],
    "asq_quotes": true,
    "local_quotes": true,
    "limited_questioning": false
};

export class Settings {
    static settings: typeof defaultSettings;

    static construct(): void {
        try {
            const buffer = fs.readFileSync("./config/bot_settings.json");
            this.settings = JSON.parse(buffer.toString());
        }
        catch (err) {
            Logger.log(`Settings @ construct: ${err}`, "ERROR", false);
            this.settings = defaultSettings;
        }
    }
}
