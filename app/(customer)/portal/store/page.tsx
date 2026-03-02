import { prisma } from "@/lib/prisma"
import { StoreClient } from "./StoreClient"

export default async function StorePage() {
  const parts = await prisma.sparePart.findMany({
    where: { stockQuantity: { gt: 0 } },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  })

  const categories = [...new Set(parts.map((p) => p.category))]

  return <StoreClient parts={parts} categories={categories} />
}
