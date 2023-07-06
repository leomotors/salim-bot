import { PrismaClient } from "@prisma/client";

const res = await fetch("https://github.com/CarelessDev/bigmc-salim-quotes/raw/main/morequotes.json").then(r=>r.json());

const quotes = res.วาทกรรมสลิ่ม as string[];

const prisma = new PrismaClient();

// await prisma.quote.deleteMany();
await prisma.quote.createMany({
  data: quotes.map((q) => ({ content: q })),
});

export {};
