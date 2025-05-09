import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRadio, faSignal } from '@fortawesome/free-solid-svg-icons'

type PostHeaderProps = {
  title: string
  date: string
  author?: {
    name: string
    callsign?: string
  }
  tags?: string[]
}

export function PostHeader({ title, date, author, tags }: PostHeaderProps) {
  return (
    <div className="mb-8 border-b border-green-800 pb-4">
      <div className="flex items-center gap-2 mb-2">
        <FontAwesomeIcon icon={faSignal} className="h-6 w-6 text-green-500" />
        <h1 className="text-3xl font-bold terminal-header">{title}</h1>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-6 terminal-text">
        <div className="flex items-center">
          <FontAwesomeIcon icon={faRadio} className="h-4 w-4 text-green-500 mr-2" />
          <time dateTime={date}>{formatDate(date)}</time>
        </div>
        {author && (
          <>
            <span className="text-green-700">•</span>
            <span className="text-green-400">
              {author.name}
              {author.callsign && ` (${author.callsign})`}
            </span>
          </>
        )}
      </div>

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-black border border-green-700 text-green-500">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
