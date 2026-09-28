import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-6 py-24 text-center">
      <p className="text-marigold-dark font-display text-6xl mb-4">404</p>
      <h1 className="font-display text-2xl mb-3">This page hasn't been mapped yet.</h1>
      <p className="text-ink/60 mb-6">
        The page you're looking for doesn't exist. Let's get you back on the route.
      </p>
      <Link to="/" className="inline-block bg-night text-paper px-6 py-3 font-medium hover:bg-night-light transition-colors">
        Back to Explore
      </Link>
    </div>
  )
}
