import { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ArticleCard from "@/components/ArticleCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Civic Voice - Local Governance News",
  description: "Independent journalism focused on municipal and provincial governance. In-depth coverage of city council meetings, legislative updates, investigations, and civic engagement.",
  openGraph: {
    title: "Civic Voice - Local Governance News",
    description: "Independent journalism focused on municipal and provincial governance. Holding power accountable through investigative reporting.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Civic Voice - Local Governance News",
    description: "Independent journalism focused on municipal and provincial governance. Holding power accountable.",
  },
}

// Helper function to format dates
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

async function getStories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/stories`, {
      cache: 'no-store'
    })
    if (!res.ok) return []
    const data = await res.json()
    return data
  } catch (error) {
    console.error('Failed to fetch stories:', error)
    return []
  }
}

export default async function Home() {
  const allStories = await getStories()
  
  // Get featured story (first featured or first story)
  const featuredStory = allStories.find((s: any) => s.featured) || allStories[0]
  
  // Filter stories by category
  const municipalArticles = allStories.filter((s: any) => s.categoryName === 'Municipal').slice(0, 3)
  const provincialArticles = allStories.filter((s: any) => s.categoryName === 'Provincial').slice(0, 3)
  const investigationsArticles = allStories.filter((s: any) => s.categoryName === 'Investigations').slice(0, 3)
  const opinionArticles = allStories.filter((s: any) => s.categoryName === 'Opinion').slice(0, 1)
  const internationalArticles = allStories.filter((s: any) => s.categoryName === 'International').slice(0, 1)

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        {featuredStory && (
          <section className="bg-background border-b border-border">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
              <ArticleCard 
                title={featuredStory.title}
                excerpt={featuredStory.excerpt}
                category={featuredStory.categoryName}
                date={formatDate(featuredStory.publishedAt)}
                author={featuredStory.author}
                image={featuredStory.image}
                slug={featuredStory.slug}
                featured 
              />
            </div>
          </section>
        )}

        {/* Municipal Section */}
        {municipalArticles.length > 0 && (
          <section className="section-accent bg-gradient-to-r from-muted/30 to-transparent -mt-1">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Municipal</h2>
                <Link href="/municipal">
                  <Button variant="default" size="lg" className="bg-primary hover:bg-primary/90">
                    View all
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {municipalArticles.map((article: any) => (
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
            </div>
          </section>
        )}

        {/* Provincial Section */}
        {provincialArticles.length > 0 && (
          <section className="section-accent bg-gradient-to-r from-muted/20 to-transparent -mt-1">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Provincial</h2>
                <Link href="/provincial">
                  <Button variant="default" size="lg" className="bg-primary hover:bg-primary/90">
                    View all
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {provincialArticles.map((article: any) => (
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
            </div>
          </section>
        )}

        {/* Investigations Section */}
        {investigationsArticles.length > 0 && (
          <section className="section-accent -mt-1">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Investigations</h2>
                <Link href="/investigations">
                  <Button variant="default" size="lg" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                    View all
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {investigationsArticles.map((article: any) => (
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
            </div>
          </section>
        )}

        {/* Opinion & International Grid */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16">
            {/* Opinion */}
            <div className="p-8 rounded-xl border border-border">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Opinion</h2>
                <Link href="/opinion">
                  <Button variant="outline" size="lg">View all</Button>
                </Link>
              </div>
              <div className="space-y-8">
                {opinionArticles.length > 0 ? (
                  opinionArticles.map((article: any) => (
                    <article key={article.id} className="border-b border-border pb-6">
                      <Badge variant="default" className="bg-accent text-accent-foreground text-xs mb-2 px-2 py-1">
                        Opinion
                      </Badge>
                      <Link href={`/article/${article.slug}`} className="group block">
                        <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors leading-snug">
                          {article.title}
                        </h3>
                        <p className="text-base text-muted-foreground mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>
                        <p className="text-sm text-muted-foreground font-medium">
                          By {article.author} • {formatDate(article.publishedAt)}
                        </p>
                      </Link>
                    </article>
                  ))
                ) : (
                  <p className="text-muted-foreground">No opinion articles available.</p>
                )}
              </div>
            </div>

            {/* International */}
            <div className="p-8 rounded-xl border border-border">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground">International</h2>
                <Link href="/international">
                  <Button variant="outline" size="lg">View all</Button>
                </Link>
              </div>
              <div className="space-y-8">
                {internationalArticles.length > 0 ? (
                  internationalArticles.map((article: any) => (
                    <article key={article.id} className="border-b border-border pb-6">
                      <Badge variant="default" className="bg-secondary text-secondary-foreground text-xs mb-2 px-2 py-1">
                        International
                      </Badge>
                      <Link href={`/article/${article.slug}`} className="group block">
                        <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors leading-snug">
                          {article.title}
                        </h3>
                        <p className="text-base text-muted-foreground mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>
                        <p className="text-sm text-muted-foreground font-medium">
                          By {article.author} • {formatDate(article.publishedAt)}
                        </p>
                      </Link>
                    </article>
                  ))
                ) : (
                  <p className="text-muted-foreground">No international articles available.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}