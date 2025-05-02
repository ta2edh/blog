import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getAllPosts, getPostBySlug } from "@/lib/api"
import { PostBody } from "@/components/post-body"
import { PostHeader } from "@/components/post-header"
import Link from "next/link"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faSignal, faCode } from '@fortawesome/free-solid-svg-icons'

type Props = {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: `${post.title} | TA2EDH Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
  }
}

export async function generateStaticParams() {
  const posts = await getAllPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function Post({ params }: Props) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-black text-hamgreen-500">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8 border-b border-hamgreen-900 pb-4">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faSignal} className="h-6 w-6 text-hamgreen-500" />
            <Link href="/" className="text-xl font-bold terminal-header">
            TA2EDH BLOG
            </Link>
            <span className="text-xs text-hamgreen-700 terminal-blink ml-2">●</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center text-muted-foreground hover:text-hamgreen-400 terminal-text">
              <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4 mr-2" />
              Back to base
            </Link>
          </div>
        </header>

        <article className="max-w-3xl mx-auto border border-hamgreen-900 bg-black p-6 rounded shadow-[0_0_15px_rgba(0,255,0,0.1)]">
          <PostHeader title={post.title} date={post.date} author={post.author} tags={post.tags} />
          <PostBody content={post.content} />
        </article>

        <footer className="border-t border-hamgreen-900 pt-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground terminal-text">
              © {new Date().getFullYear()} TA2EDH <span className="text-hamgreen-700">|</span> CQ CQ CQ
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="https://ta2edh.com" className="text-sm text-muted-foreground hover:text-hamgreen-400 terminal-text">
                ta2edh.com
              </Link>
              <Link
                href="https://github.com/ta2edh/blog"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-hamgreen-400 terminal-text"
              >
                <FontAwesomeIcon icon={faCode} className="h-4 w-4" />
                Source
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
