// * Bot Settings : bot_settings.json

import * as fs from "fs/promises";

import { BotSettingsTemplate, BotSettingsType } from "../template/BotSettings.template";
import Logger from "../utils/Logger";

export default class BotSettings {
    static settings: BotSettingsType = BotSettingsTemplate;

    static async import(isReload = false): Promise<void> {
        try {
            const buffer = await fs.readFile("./config/bot_settings.json");
            const obj = JSON.parse(buffer.toString());
            for (const prop in BotSettingsTemplate) {
                // @ts-ignore
                BotSettings.settings[prop] = obj[prop] ?? BotSettingsTemplate[prop];
            }
            Logger.log("[FETCH COMPLETE] Successfully imported Bot Settings", "SUCCESS", isReload);
        }
        catch (err) {
            Logger.log("Bot Settings not found or error importing, using default one");
            BotSettings.settings = BotSettingsTemplate;
        }
    }
}
