import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await prisma.article.findFirst({
    where: { slug, published: true },
    include: { author: { select: { name: true } } },
  })

  if (!article) notFound()

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/portal/guides" className="flex items-center gap-2 text-sm text-[#1B3A5C] hover:text-[#D4A843] mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Guides
      </Link>

      <article>
        <div className="mb-6">
          <Badge variant="outline" className="mb-3">{article.category}</Badge>
          <h1 className="text-3xl font-bold text-[#1B3A5C]">{article.title}</h1>
          {article.excerpt && <p className="text-lg text-muted-foreground mt-2">{article.excerpt}</p>}
          <p className="text-sm text-muted-foreground mt-3">
            By {article.author?.name} · {formatDate(article.publishedAt || article.createdAt)}
          </p>
        </div>

        <Card>
          <CardContent className="p-6 prose prose-slate max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {article.content}
            </div>
          </CardContent>
        </Card>
      </article>
    </div>
  )
}
