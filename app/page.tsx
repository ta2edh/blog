import Link from "next/link"
import { getAllPosts } from "@/lib/api"
import { PostCard } from "@/components/post-card"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignal, faWifi, faRadio, faCode } from '@fortawesome/free-solid-svg-icons'

export default async function Home() {
  const posts = await getAllPosts()

  return (
    <div className="min-h-screen bg-black text-hamgreen-500">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8 border-b border-hamgreen-900 pb-4">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faSignal} className="h-8 w-8 text-hamgreen-500" />
            <h1 className="text-3xl font-bold terminal-header">TA2EDH BLOG</h1>
            <span className="text-xs text-hamgreen-700 terminal-blink">●</span>
          </div>
        </header>

        <main>
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <FontAwesomeIcon icon={faWifi} className="h-5 w-5 text-hamgreen-500" />
              <h2 className="text-2xl font-semibold terminal-header">LATEST TRANSMISSIONS</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <FontAwesomeIcon icon={faRadio} className="h-5 w-5 text-hamgreen-500" />
              <h2 className="text-2xl font-semibold terminal-header">ABOUT THIS STATION</h2>
            </div>
            <div className="prose dark:prose-invert max-w-none terminal-text border border-hamgreen-900 bg-black p-6 rounded">
              <p>
              This is where I share my thoughts, projects, and experiences—especially around my passion for radio communication, electronics, and tech.
              </p>
              <p className="text-hamgreen-300">73's and happy DXing!</p>
            </div>
          </section>
        </main>

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
