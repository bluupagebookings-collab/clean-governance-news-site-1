import { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ShareButtons from "@/components/ShareButtons"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { notFound } from "next/navigation"

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

async function getStoryBySlug(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/stories?slug=${slug}`,
      { cache: 'no-store' }
    )
    if (!res.ok) return null
    const data = await res.json()
    return data[0] || null
  } catch (error) {
    console.error('Failed to fetch story:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const article = await getStoryBySlug(slug)
  
  if (!article) {
    return {
      title: "Article Not Found | Civic Voice",
    }
  }

  return {
    title: `${article.title} | Civic Voice`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author],
      images: article.image ? [{ url: article.image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: article.image ? [article.image] : [],
    },
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const article = await getStoryBySlug(slug)
  
  if (!article) {
    notFound()
  }

  // Generate initials from author name
  const initials = article.author
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  // Generate full article URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const articleUrl = `${baseUrl}/article/${article.slug}`

  return (
    <>
      <Header />
      <article className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Article Header */}
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary">{article.categoryName}</Badge>
              <span className="text-sm text-muted-foreground">{formatDate(article.publishedAt)}</span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">5 min read</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
              {article.title}
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8">
              {article.excerpt}
            </p>

            {/* Author Info */}
            <div className="flex items-center gap-4 mb-8">
              <Avatar className="h-12 w-12">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{article.author}</p>
                <p className="text-sm text-muted-foreground">{article.categoryName} Reporter</p>
              </div>
            </div>

            <Separator className="mb-8" />
          </div>

          {/* Hero Image */}
          <div className="max-w-5xl mx-auto mb-8 sm:mb-12">
            <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Article Content */}
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              {article.content.split('\n\n').map((paragraph: string, index: number) => (
                <p key={index} className="text-base sm:text-lg leading-relaxed mb-6 text-foreground/90">
                  {paragraph}
                </p>
              ))}
            </div>

            <Separator className="my-12" />

            {/* Share Buttons */}
            <div className="mb-12">
              <ShareButtons
                title={article.title}
                excerpt={article.excerpt}
                url={articleUrl}
              />
            </div>

            <Separator className="my-12" />

            {/* Author Bio */}
            <div className="bg-muted/50 rounded-lg p-6 sm:p-8">
              <h3 className="text-lg font-bold mb-4">About the Author</h3>
              <div className="flex gap-4">
                <Avatar className="h-16 w-16 flex-shrink-0">
                  <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold mb-1">{article.author}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {article.categoryName} Reporter covering governance, policy, and civic engagement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
      <Footer />
    </>
  )
}