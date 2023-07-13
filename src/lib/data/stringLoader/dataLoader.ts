import fs from "fs/promises";

import { sLogger } from "../../logger/index.js";
import { timems } from "../../utils/index.js";

import { StringLoader, transformFunction } from "./stringLoader.js";

export class DataLoader extends StringLoader {
  private data_path: string;
  private data_key?: string;

  constructor(
    data_path: string,
    data_key?: string,
    transform?: transformFunction,
  ) {
    super(transform);
    this.data_path = data_path;
    this.data_key = data_key;

    this.loadData();
  }

  override async loadData() {
    try {
      const start = performance.now();
      const buffer = await fs.readFile(this.data_path);
      const obj = JSON.parse(buffer.toString());
      this.data = this.mapTransform(this.data_key ? obj[this.data_key] : obj);
      sLogger.log(
        `Successfully fetched ${this.data.length} datas from ${
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
