import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-night text-paper/60 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-10 grid sm:grid-cols-3 gap-8 text-sm">
        <div>
          <p className="font-display text-lg text-paper mb-2">THREADBARE ROADS</p>
          <p>
            For the worn paths and the words they hold.
          </p>
        </div>
        <div>
          <p className="text-paper mb-2 font-medium">Explore</p>
          <ul className="space-y-1">
            <li><Link to="/" className="hover:text-marigold">All cities</Link></li>
            <li><Link to="/stay" className="hover:text-marigold">Book a hotel</Link></li>
            <li><Link to="/move" className="hover:text-marigold">Local transport</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-paper mb-2 font-medium">About</p>
          <ul className="space-y-1">
            <li><Link to="/about" className="hover:text-marigold">About this project</Link></li>
            <li><Link to="/bookings" className="hover:text-marigold">My bookings</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/10 px-6 py-4 text-xs text-center">
        Travel further. Stay curious. Make every city yours.
      </div>
    </footer>
  )
}
