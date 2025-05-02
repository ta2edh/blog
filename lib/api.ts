import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import html from "remark-html"

const postsDirectory = path.join(process.cwd(), "_posts")

export type Post = {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  author?: {
    name: string
  }
  tags?: string[]
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, "utf8")

    const { data, content } = matter(fileContents)

    const processedContent = await remark().use(html).process(content)

    const contentHtml = processedContent.toString()

    return {
      slug,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt || "",
      content: contentHtml,
      author: data.author,
      tags: data.tags,
    }
  } catch (error) {
    return null
  }
}

export async function getAllPosts(): Promise<Post[]> {
  // Create the directory if it doesn't exist
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true })
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = await Promise.all(
    fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map(async (fileName) => {
        const slug = fileName.replace(/\.md$/, "")
        const post = await getPostBySlug(slug)
        return post
      }),
  )

  // Filter out any null values and sort by date
  return allPostsData
    .filter((post): post is Post => post !== null)
    .sort((a, b) => (new Date(b.date) > new Date(a.date) ? 1 : -1))
}
