// * SalimShell.ts : Shell But Salim

import { DMChannel, NewsChannel, TextChannel, Message } from "discord.js";

import * as fs from "fs/promises";
import { ShellConfigTemplate, ShellConfig } from "../template/ShellConfig.template";
import Logger from "../utils/Logger";

const configFilePath = "./save/shellconfig.json";

export const shellPrefix = "#!salim";

type DiscordChannel = TextChannel | NewsChannel;

export default class SalimShell {
    static shellConfig: ShellConfig = ShellConfigTemplate;

    static async loadConfig(): Promise<void> {
        try {
            const buffer = await fs.readFile(configFilePath);
            SalimShell.shellConfig = JSON.parse(buffer.toString());
        }
        catch (err) {
            SalimShell.shellConfig = ShellConfigTemplate;
        }
        Logger.log(`Successfully load Salim Config, there are ${SalimShell.shellConfig.config.disabled.length} disabled channels`, "SUCCESS", false);
    }

    static async execute(msg: Message): Promise<void> {
        const commands = msg.content.split(" ");
        if (commands.length <= 1) {
            msg.reply("No Commands");
            return;
        }

        switch (commands[1]) {
            case "disable":
                {
                    if (msg.channel instanceof DMChannel) {
                        msg.reply("This don't work here!");
                        return;
                    }
                    const traceback = await SalimShell.toggleChannel(msg.channel, false);
                    if (traceback)
                        msg.reply(traceback);
                    else
                        msg.react("💛");
                    return;
                }
            case "enable":
                {
                    if (msg.channel instanceof DMChannel) {
                        msg.reply("This don't work here!");
                        return;
                    }
                    const traceback = await SalimShell.toggleChannel(msg.channel, true);
                    if (traceback)
                        msg.reply(traceback);
                    else
                        msg.react("💛");
                    return;
                }
            default:
                msg.reply("Unknown Command");
        }
    }

    private static async toggleChannel(channel: DiscordChannel, value: boolean): Promise<string> {
        if (value) {
            if (SalimShell.shellConfig.config.disabled.includes(channel.id)) {
                SalimShell.shellConfig.config.disabled.splice(SalimShell.shellConfig.config.disabled.indexOf(channel.id), 1);
                SalimShell.saveConfig();
                Logger.log(`[SalimShell] Channel ${channel.name} has been enabled`);
                return "";
            }
            else {
                return "That Channel is not disabled";
            }
        }
        else {
            if (SalimShell.shellConfig.config.disabled.includes(channel.id)) {
                return "Already Disabled";
            }
            else {
                SalimShell.shellConfig.config.disabled.push(channel.id);
                SalimShell.saveConfig();
                Logger.log(`[SalimShell] Channel ${channel.name} has been disabled`);
                return "";
            }
        }
    }

    private static async saveConfig(): Promise<void> {
        await fs.writeFile(configFilePath, JSON.stringify(SalimShell.shellConfig, null, 4));
        Logger.log("Save Config Success", "SUCCESS");
    }
}
