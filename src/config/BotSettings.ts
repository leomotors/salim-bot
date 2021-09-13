// * Bot Settings : bot_settings.json

import * as fs from "fs/promises";

import { BotSettingsTemplate, BotSettingsType } from "../template/BotSettings.template";
import Logger from "../utils/Logger";

export default class BotSettings {
    static settings: BotSettingsType = BotSettingsTemplate;

    static async import(isReload = false): Promise<void> {
        try {
            const buffer = await fs.readFile("./config/bot_settings.json");
            BotSettings.settings = JSON.parse(buffer.toString());
            Logger.log("Successfully imported Bot Settings", "SUCCESS", isReload);
        }
        catch (err) {
            Logger.log("Bot Settings not found or error importing, using default one");
            BotSettings.settings = BotSettingsTemplate;
        }
    }
}
