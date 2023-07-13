import { StringLoader } from "./stringLoader.js";

export class ComputedLoader extends StringLoader {
  private loadFunction: () => string | string[];

  constructor(loadFunction: () => string | string[]) {
    super();
    this.loadFunction = loadFunction;
  }

  override getData(): string[] {
    const data = this.loadFunction();
    if (typeof data === "string") return [data];
    else return data;
  }
}
