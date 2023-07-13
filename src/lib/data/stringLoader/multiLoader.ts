import { StringLoader } from "./stringLoader.js";

export interface MultiLoaderOptions {
  loader: StringLoader;
  label: string;
}

export class MultiLoader extends StringLoader {
  private loaders: MultiLoaderOptions[];

  constructor(loaders: MultiLoaderOptions[]) {
    super();
    this.loaders = loaders;
  }

  override getData(): string[] {
    let data: string[] = [];
    for (const loaderOption of this.loaders)
      data = data.concat(loaderOption.loader.getData());
    return data;
  }

  override getRefIndex(index: number) {
    let ldIndex = 0;
    let ldC = 0;

    for (const loaderOption of this.loaders) {
      ldIndex += 1;
      ldC += loaderOption.loader.length;
      if (ldC > index) {
        ldIndex -= 1;
        ldC -= loaderOption.loader.length;
      }
    }

    return `${this.loaders[ldIndex]?.label} #${index - ldC + 1}`;
  }
}
