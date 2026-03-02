import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/shared/PageHeader"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Plus } from "lucide-react"

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Knowledge Base Articles"
        description={`${articles.length} articles`}
        action={
          <Button asChild className="bg-[#1B3A5C]">
            <Link href="/articles/new">
              <Plus className="mr-2 h-4 w-4" />
              New Article
            </Link>
          </Button>
        }
      />

      <div className="space-y-3">
        {articles.map((article) => (
          <Card key={article.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-[#1B3A5C]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-4 w-4 text-[#1B3A5C]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1B3A5C]">{article.title}</p>
                    {article.excerpt && <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">{article.excerpt}</p>}
                    <p className="text-xs text-muted-foreground mt-1">
                      By {article.author?.name} · {formatDate(article.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant="outline">{article.category}</Badge>
                  <Badge className={article.published ? "bg-green-100 text-green-800 border-0" : "bg-gray-100 text-gray-600 border-0"}>
                    {article.published ? "Published" : "Draft"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {articles.length === 0 && <p className="text-center text-muted-foreground py-12">No articles yet</p>}
      </div>
    </div>
  )
}
