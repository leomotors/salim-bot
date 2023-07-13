import { StringLoader } from "./stringLoader.js";

export class StaticLoader extends StringLoader {
  constructor(data: string[]) {
    super();
    this.data = data;
  }
}
