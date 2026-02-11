import { Router } from "express";
import { prisma } from "./prisma";

const router = Router();

router.post("/reset", async (_req, res) => {
  if (process.env.NODE_ENV !== "test") {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    // 清空 DB（順序重要：先關聯表，再主表）
    await prisma.houseFeature.deleteMany();
    await prisma.feature.deleteMany();
    await prisma.house.deleteMany();

    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Reset failed" });
  }
});

export default router;
