import { sLogger } from "../../logger/index.js";
import { timems } from "../../utils/index.js";

import { StringLoader, transformFunction } from "./stringLoader.js";

export class OnlineLoader extends StringLoader {
  private url: string;
  private data_key?: string;
  private interval?: NodeJS.Timeout;

  constructor(url: string, data_key?: string, transform?: transformFunction) {
    super(transform);
    this.url = url;
    this.data_key = data_key;

    this.loadData();
  }

  override async loadData(autorefresh = false) {
    try {
      const start = performance.now();
      const res = await fetch(this.url);
      if (res.status >= 400) throw `Error ${res.status}`;
      const restxt = await res.text();
      const obj = JSON.parse(restxt);
      this.data = this.mapTransform(this.data_key ? obj[this.data_key] : obj);
      sLogger.log(
        `${autorefresh ? "[AUTO] " : ""}Successfully fetched ${
          this.data.length
        } datas from ${this.url} in ${timems(start)}`,
        "SUCCESS",
      );
    } catch (err) {
      sLogger.log(`Can't fetch data from ${this.url}`, "ERROR");
    }
  }

  setAutoRefresh(minutes: number): NodeJS.Timer {
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => this.loadData(true), minutes * 60 * 1000);
    return this.interval;
  }
}
