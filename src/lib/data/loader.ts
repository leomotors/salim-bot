import { sLogger } from "../logger/index.js";

export abstract class Loader<T> {
  protected data: T[] = [];
  async loadData() {
    sLogger.log(
      "This Loader is not reactive and should not be added to console",
      "WARNING",
    );
  }

  getData(): T[] {
    return this.data;
  }

  get length() {
    return this.data.length;
  }

  getRefIndex(index: number) {
    if (this.data.length) return `#${index + 1}`;
    else return "";
  }
}
