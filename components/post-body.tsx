type PostBodyProps = {
  content: string
}

export function PostBody({ content }: PostBodyProps) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}
