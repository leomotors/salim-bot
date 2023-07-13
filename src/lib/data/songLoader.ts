import fs from "fs/promises";

import { sLogger } from "../logger/index.js";
import { timems } from "../utils/index.js";

import { Loader } from "./loader.js";

export interface Song {
  url: string;
  name?: string;
}

export class SongLoader extends Loader<Song> {
  private data_path: string;
  private data_key?: string;

  constructor(data_path: string, data_key?: string) {
    super();
    this.data_path = data_path;
    this.data_key = data_key;

    this.loadData();
  }

  override async loadData() {
    try {
      const start = performance.now();
      const buffer = await fs.readFile(this.data_path);
      const obj = JSON.parse(buffer.toString());
      this.data = this.data_key ? obj[this.data_key] : obj;
      sLogger.log(
        `Successfully fetched ${this.data.length} songs from ${
          this.data_path
        } in ${timems(start)}`,
        "SUCCESS",
      );
    } catch (err) {
      this.data = [];
      sLogger.log(`Can't load data from ${this.data_path}`, "ERROR");
    }
  }
}
