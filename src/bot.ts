import "dotenv/config";

import { sclient } from "./legacy.js";

import chalk from "chalk";
import { SlashCenter } from "cocoa-discord/slash";

import QuizCog from "./commands/quiz.js";
import Salim from "./commands/salim.js";
import { style } from "./commands/styles.js";
import { GuildIds } from "./environment.js";
import { sLogger } from "./lib/index.js";

// * Salim Bot: Bot that is running in my group's server 24/7

const setupStart = performance.now();

console.log(
  chalk.cyan("Starting Salim Bot ") +
    chalk.magenta(process.env.npm_package_version) +
    "✨✨",
);

// * Using Slash Commands with Cocoa Discord Utils 🍫
const salimCenter = new SlashCenter(sclient.client, GuildIds);
salimCenter.addModules(new Salim(sclient.client), new QuizCog(sclient.client));
salimCenter.useHelpCommand(style);
salimCenter.on("error", async (name, err, ctx) => {
  await ctx.channel?.send(
    `คำสั่ง ${name} ทำงานผิดพลาด ดิฉันคิดว่าต้องเป็นฝีมือของ${
      Math.random() >= 0.5 ? "ทักษิณ" : "ไอทอน"
    }แน่เลย\n${err}`,
  );
});
salimCenter.on("interaction", (name, ctx) => {
  sLogger.log(`[Slash Command ${name}] Invoked by ${ctx.user.tag}`);
});

sclient.client.on("ready", async () => {
  await salimCenter.validateCommands();
  await salimCenter.syncCommands();
});

// * Done! That's it required for this bot!
sLogger.log(
  `✨✨ Synchronous Setup Done in ${(performance.now() - setupStart).toFixed(
    3,
  )} ms`,
  "SUCCESS",
);
