import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRadio } from '@fortawesome/free-solid-svg-icons'

type PostCardProps = {
  post: {
    slug: string
    title: string
    date: string
    excerpt: string
    tags?: string[]
    author?: {
      name: string
      callsign?: string
    }
  }
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="h-full flex flex-col border border-hamgreen-700 bg-black shadow-[0_0_10px_rgba(0,255,0,0.1)]">
      <CardHeader className="border-b border-hamgreen-900">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faRadio} className="h-4 w-4 text-hamgreen-500" />
          <CardTitle className="line-clamp-2 terminal-header">
            <Link href={`/posts/${post.slug}`} className="hover:text-hamgreen-300">
              {post.title}
            </Link>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pt-4">
        <p className="text-muted-foreground text-sm mb-4 terminal-text">
          <span className="text-hamgreen-600">TX:</span> {formatDate(post.date)}
          {post.author && (
            <>
              {" • "}
              <span className="text-hamgreen-400">
                {post.author.name}
                {post.author.callsign && ` (${post.author.callsign})`}
              </span>
            </>
          )}
        </p>
        <p className="line-clamp-3 text-muted-foreground terminal-text">{post.excerpt}</p>
      </CardContent>
      <CardFooter className="border-t border-hamgreen-900">
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-black border border-hamgreen-700 text-hamgreen-500">
                {tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">+{post.tags.length - 3} more</span>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
