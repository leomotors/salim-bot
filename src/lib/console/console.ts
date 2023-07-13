import readline from "readline";

import type { SBotClient } from "../client/index.js";
import { Loader } from "../data/loader.js";

export class Console {
  sbclient?: SBotClient;
  rl: readline.Interface;

  constructor(client: SBotClient) {
    this.sbclient = client;

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    this.rl.on("line", (cmd: string) => {
      this.execute(cmd);
    });
  }

  execute(cmd: string) {
    const cmds = cmd.split(" ");
    switch (cmds[0]) {
      case "reload":
        for (const loader of this.loaders) loader.loadData();
        break;
      case "logout":
        this.sbclient?.client?.destroy();
        process.exit(0);
      default:
        // todo print this
        return "Unknown Command";
    }
  }

  private loaders: Loader<unknown>[] = [];
  addLoader(...args: Loader<unknown>[]) {
    this.loaders.push(...args);
  }
}
