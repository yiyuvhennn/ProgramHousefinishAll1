import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const DATABASE_URL = process.env.DATABASE_URL ?? "file:./prisma/dev.db";

// 讓 adapter 一致（你 seed 也是用 better-sqlite3 adapter）
const adapter = new PrismaBetterSqlite3({ url: DATABASE_URL });

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

// 避免 dev 熱重載造成 PrismaClient 重複建立
export const prisma =
  global.__prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  global.__prisma = prisma;
}
