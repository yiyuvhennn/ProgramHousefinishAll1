import { PrismaClient } from "@prisma/client"

export async function seedDemoIfEmpty() {
  const prisma = new PrismaClient()
  try {
    const count = await prisma.house.count()
    if (count > 0) return

    await prisma.house.createMany({
      data: [
        {
          title: "示範建案 A",
          slug: "demo-a",
          city: "台中市",
          area: "西屯區",
          price: "1688",
          description: "Render 免費版可能重啟，這是自動補上的 demo 資料。"
        },
        {
          title: "示範建案 B",
          slug: "demo-b",
          city: "台中市",
          area: "南屯區",
          price: "2380",
          description: "可用於展示搜尋、詳情頁、CRUD。"
        }
      ]
    })
  } finally {
    await prisma.$disconnect()
  }
}
