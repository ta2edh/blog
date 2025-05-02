import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRadio } from '@fortawesome/free-solid-svg-icons'
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-hamgreen-500 flex items-center justify-center">
      <div className="text-center">
        <FontAwesomeIcon icon={faRadio} className="h-16 w-16 text-hamgreen-500 mb-4" />
        <h1 className="text-4xl font-bold mb-4 terminal-header">404 - Signal Lost</h1>
        <p className="text-lg mb-8 terminal-text">The frequency you're looking for is not in range.</p>
        <Link href="/" className="text-hamgreen-400 hover:text-hamgreen-300 terminal-text">
          Return to base station
        </Link>
      </div>
    </div>
  )
}
