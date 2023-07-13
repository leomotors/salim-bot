/* eslint-disable @typescript-eslint/no-explicit-any */
import { Loader } from "../loader.js";

export type transformFunction = (t: any) => string;

export abstract class StringLoader extends Loader<string> {
  protected data: string[] = [];
  private transform?: transformFunction;

  constructor(transform?: transformFunction) {
    super();
    this.transform = transform;
  }

  async loadData() {
    // to implement by super class
  }

  mapTransform(datas: any[]): string[] {
    if (!this.transform) return datas;

    const newdata = [];
    for (const data of datas) newdata.push(this.transform(data));
    return newdata;
  }
}
