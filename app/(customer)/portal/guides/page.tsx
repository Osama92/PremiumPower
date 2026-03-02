import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { BookOpen } from "lucide-react"

export default async function GuidesPage() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    include: { author: { select: { name: true } } },
    orderBy: { publishedAt: "desc" },
  })

  const categories = [...new Set(articles.map((a) => a.category))]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1B3A5C]">Generator Tips & Guides</h1>
        <p className="text-sm text-muted-foreground">Expert advice from the PPS team</p>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <span key={cat} className="px-3 py-1 bg-[#1B3A5C]/10 text-[#1B3A5C] text-xs font-medium rounded-full">
            {cat}
          </span>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {articles.map((article) => (
          <Link key={article.id} href={`/portal/guides/${article.slug}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer group h-full">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#D4A843]/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BookOpen className="h-5 w-5 text-[#D4A843]" />
                  </div>
                  <div>
                    <Badge variant="outline" className="text-xs mb-2">{article.category}</Badge>
                    <h3 className="font-semibold text-[#1B3A5C] group-hover:text-[#D4A843] transition-colors">{article.title}</h3>
                    {article.excerpt && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{article.excerpt}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      By {article.author?.name} · {formatDate(article.publishedAt || article.createdAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {articles.length === 0 && (
          <p className="text-muted-foreground col-span-2 text-center py-12">No articles published yet</p>
        )}
      </div>
    </div>
  )
}
