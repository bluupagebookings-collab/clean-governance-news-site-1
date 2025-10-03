import { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ArticleCard from "@/components/ArticleCard"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Municipal News | Civic Voice",
  description: "City council meetings, local budgets, zoning decisions, infrastructure projects, and community initiatives. Comprehensive coverage of municipal governance.",
  openGraph: {
    title: "Municipal News | Civic Voice",
    description: "City council meetings, local budgets, zoning decisions, infrastructure projects, and community initiatives.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Municipal News | Civic Voice",
    description: "City council meetings, local budgets, zoning decisions, infrastructure projects, and community initiatives.",
  },
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return "Just now"
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

async function getStoriesByCategory(category: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/stories?category=${category}`,
      { cache: 'no-store' }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data
  } catch (error) {
    console.error('Failed to fetch stories:', error)
    return []
  }
}

export default async function MunicipalPage() {
  const articles = await getStoriesByCategory('Municipal')

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <section className="section-accent bg-gradient-to-r from-primary/10 to-transparent">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="flex items-center justify-between mb-12">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Municipal News</h1>
              <Button variant="ghost" asChild>
                <Link href="/">← Back to Home</Link>
              </Button>
            </div>
            {articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article: any) => (
                  <ArticleCard 
                    key={article.id}
                    title={article.title}
                    excerpt={article.excerpt}
                    category={article.categoryName}
                    date={formatDate(article.publishedAt)}
                    author={article.author}
                    image={article.image}
                    slug={article.slug}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-12">No municipal stories available yet.</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}