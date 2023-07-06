import { ComputedLoader, sLogger } from "s-bot-framework/dist";

import { prisma } from "./prisma";

class AsyncLoader extends ComputedLoader {
  private asyncLoadFunction: () => Promise<string[]>;

  constructor(
    private sourceName: string,
    asyncLoadFunction: () => Promise<string[]>,
  ) {
    super(() => []);
    this.asyncLoadFunction = asyncLoadFunction;
    this.reload();
  }

  async reload() {
    const start = performance.now();
    const data = await this.asyncLoadFunction();
    this.data = data;
    sLogger.log(
      `Successfully loaded ${this.data.length} datas from ${
        this.sourceName
      } in ${(performance.now() - start).toFixed(3)} ms`,
      "SUCCESS",
    );
  }

  override getData(): string[] {
    return this.data;
  }
}

export const prismaQuote = new AsyncLoader(
  "Prisma Database (Quote)",
  async () => (await prisma.quote.findMany()).map((q) => q.content),
);
