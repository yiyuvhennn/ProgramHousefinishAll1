import "dotenv/config";
import fs from "node:fs";
import path from "node:path";

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";

const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url }),
});

function splitFeatures(input: any): string[] {
  if (!input) return [];
  if (Array.isArray(input)) return input.map(String).map((s) => s.trim()).filter(Boolean);
  return String(input)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

async function main() {
  const dbJsonPath = path.resolve(process.cwd(), "../mock/db.json");
  const raw = JSON.parse(fs.readFileSync(dbJsonPath, "utf-8"));
  const houses = Array.isArray(raw) ? raw : raw.houses;
  if (!Array.isArray(houses)) throw new Error("mock/db.json 找不到 houses 陣列");

  // 每次重灌
  await prisma.houseFeature.deleteMany();
  await prisma.feature.deleteMany();
  await prisma.house.deleteMany();

  // 防 slug 重複
  const used = new Set<string>();

  for (let i = 0; i < houses.length; i++) {
    const h: any = houses[i];

    let slug = String(h.slug ?? `house-${i}`).trim();
    if (!slug) slug = `house-${i}`;
    let candidate = slug;
    let k = 1;
    while (used.has(candidate)) candidate = `${slug}-${k++}`;
    used.add(candidate);

    const featuresArr = splitFeatures(h.features);

    await prisma.house.create({
      data: {
        slug: candidate,
        title: String(h.title ?? "未命名建案").trim(),
        city: h.city ?? null,
        price: h.price ?? null,
        area: h.area ?? null,
        rooms: h.rooms ?? null,
        image: h.image ?? null,
        description: h.description ?? null,

        // ✅ 正規化：只寫關聯，不再寫 features 字串欄位
        houseFeatures: {
          create: featuresArr.map((name) => ({
            feature: {
              connectOrCreate: {
                where: { name },
                create: { name },
              },
            },
          })),
        },
      },
    });
  }

  console.log(`✅ Seed 完成：匯入 ${houses.length} 筆（含 Feature 關聯）`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
