import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface ArticleCardProps {
  title: string
  excerpt: string
  category: string
  date: string
  author: string
  image: string
  slug: string
  featured?: boolean
}

export default function ArticleCard({
  title,
  excerpt,
  category,
  date,
  author,
  image,
  slug,
  featured = false,
}: ArticleCardProps) {
  return (
    <Link href={`/article/${slug}`} className="group block h-full">
      <article className={`overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow ${featured ? "md:flex md:gap-6" : ""}`}>
        {/* Image with subtle overlay */}
        <div
          className={`relative ${featured ? "md:w-1/2 h-64 md:h-auto" : "h-48 sm:h-56"} bg-gradient-to-br from-muted to-border`}
        >
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {featured && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          )}
        </div>

        {/* Content */}
        <div className={`${featured ? "md:w-1/2 p-6 flex flex-col justify-between" : "p-6"}`}>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-primary text-primary-foreground text-xs px-2 py-1">
                {category}
              </Badge>
              <span className="text-xs text-muted-foreground font-medium">{date}</span>
            </div>

            <h3 className={`font-bold leading-tight group-hover:text-primary transition-colors ${featured ? "text-2xl" : "text-xl"}`}>
              {title}
            </h3>

            <p className="text-sm text-muted-foreground line-clamp-2">{excerpt}</p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-muted-foreground font-medium">By {author}</p>
            <span className="text-xs text-primary hidden sm:inline">Read more →</span>
          </div>
        </div>
      </article>
    </Link>
  )
}