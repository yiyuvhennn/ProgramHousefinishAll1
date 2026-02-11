import { Router } from "express";
import { prisma } from "./prisma";

export interface House {
  id: number;
  slug: string;
  title: string;
  city: string;
  price: string; // 前端是 string → 後端保持 string
  area: string;
  rooms: string;
  features: string[];
  description: string;
  image: string;
}

const router = Router();

function toStringSafe(v: any) {
  return String(v ?? "").trim();
}

function parseFeatures(input: any): string[] {
  if (Array.isArray(input)) {
    return input.map((x) => toStringSafe(x)).filter(Boolean);
  }
  const s = toStringSafe(input);
  if (!s) return [];
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function buildHouseFromBody(body: any): Omit<House, "id"> {
  return {
    slug: toStringSafe(body.slug),
    title: toStringSafe(body.title),
    city: toStringSafe(body.city),
    price: toStringSafe(body.price),
    area: toStringSafe(body.area),
    rooms: toStringSafe(body.rooms),
    image: toStringSafe(body.image),
    description: toStringSafe(body.description),
    features: parseFeatures(body.features),
  };
}

function mapHouseDbToApi(h: any): House {
  return {
    id: h.id,
    slug: h.slug,
    title: h.title,
    city: h.city,
    price: h.price,
    area: h.area,
    rooms: h.rooms,
    image: h.image,
    description: h.description,
    features: (h.houseFeatures ?? [])
      .map((hf: any) => hf?.feature?.name)
      .filter(Boolean),
  };
}

function prismaUniqueError(e: any) {
  return e?.code === "P2002";
}

// ===== GET /houses?slug=xxx 或 /houses?q=keyword =====
router.get("/", async (req, res) => {
  const slug = toStringSafe(req.query.slug);
  const q = toStringSafe(req.query.q);

  try {
    // 1) slug 精準查詢（給 fetchHouseBySlug 用）
    if (slug) {
      const rows = await prisma.house.findMany({
        where: { slug },
        include: { houseFeatures: { include: { feature: true } } },
        orderBy: { id: "asc" },
      });
      return res.json(rows.map(mapHouseDbToApi));
    }

    // 2) q 模糊搜尋（給 searchHouses 用）
    if (q) {
      const rows = await prisma.house.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { city: { contains: q } },
            { area: { contains: q } },
            { slug: { contains: q } },
          ],
        },
        include: { houseFeatures: { include: { feature: true } } },
        orderBy: { id: "asc" },
      });
      return res.json(rows.map(mapHouseDbToApi));
    }

    // 3) 全部
    const rows = await prisma.house.findMany({
      include: { houseFeatures: { include: { feature: true } } },
      orderBy: { id: "asc" },
    });
    return res.json(rows.map(mapHouseDbToApi));
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// ===== POST /houses =====
router.post("/", async (req, res) => {
  const body = req.body ?? {};
  const data = buildHouseFromBody(body);

  // 你 schema 全是必填欄位（String），所以這裡做最基本的防呆
  if (!data.slug) return res.status(400).json({ message: "slug is required" });
  if (!data.title) return res.status(400).json({ message: "title is required" });

  try {
    const created = await prisma.house.create({
      data: {
        slug: data.slug,
        title: data.title,
        city: data.city,
        price: data.price,
        area: data.area,
        rooms: data.rooms,
        image: data.image,
        description: data.description,
        houseFeatures: {
          create: data.features.map((name) => ({
            feature: {
              connectOrCreate: {
                where: { name },
                create: { name },
              },
            },
          })),
        },
      },
      include: { houseFeatures: { include: { feature: true } } },
    });

    return res.status(201).json(mapHouseDbToApi(created));
  } catch (e: any) {
    if (prismaUniqueError(e)) {
      return res.status(409).json({ message: "slug already exists" });
    }
    console.error(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// ===== PATCH /houses/:id =====
router.patch("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid id" });

  const body = req.body ?? {};

  // 只更新有傳的欄位
  const updateData: any = {};
  if (body.slug !== undefined) updateData.slug = toStringSafe(body.slug);
  if (body.title !== undefined) updateData.title = toStringSafe(body.title);
  if (body.city !== undefined) updateData.city = toStringSafe(body.city);
  if (body.price !== undefined) updateData.price = toStringSafe(body.price);
  if (body.area !== undefined) updateData.area = toStringSafe(body.area);
  if (body.rooms !== undefined) updateData.rooms = toStringSafe(body.rooms);
  if (body.image !== undefined) updateData.image = toStringSafe(body.image);
  if (body.description !== undefined) updateData.description = toStringSafe(body.description);

  const hasFeaturesUpdate = body.features !== undefined;
  const nextFeatures = hasFeaturesUpdate ? parseFeatures(body.features) : [];

  try {
    // 先確認存在
    const exists = await prisma.house.findUnique({ where: { id } });
    if (!exists) return res.status(404).json({ message: "House not found" });

    const updated = await prisma.$transaction(async (tx) => {
      // 1) 先更新 House 基本欄位
      await tx.house.update({
        where: { id },
        data: updateData,
      });

      // 2) 如果有傳 features：重建多對多關聯（刪掉舊的 → 建新的）
      if (hasFeaturesUpdate) {
        await tx.houseFeature.deleteMany({ where: { houseId: id } });

        if (nextFeatures.length > 0) {
          await tx.house.update({
            where: { id },
            data: {
              houseFeatures: {
                create: nextFeatures.map((name) => ({
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
      }

      // 3) 回傳最新（含 features）
      return tx.house.findUnique({
        where: { id },
        include: { houseFeatures: { include: { feature: true } } },
      });
    });

    if (!updated) return res.status(404).json({ message: "House not found" });
    return res.json(mapHouseDbToApi(updated));
  } catch (e: any) {
    if (prismaUniqueError(e)) {
      return res.status(409).json({ message: "slug already exists" });
    }
    console.error(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// ===== DELETE /houses/:id =====
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid id" });

  try {
    await prisma.house.delete({ where: { id } });
    return res.status(204).send();
  } catch (e: any) {
    // Prisma 找不到會 throw
    if (e?.code === "P2025") {
      return res.status(404).json({ message: "House not found" });
    }
    console.error(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
