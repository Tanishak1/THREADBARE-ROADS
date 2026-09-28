import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getBookingsForUser } from '../data/bookings'

export default function MyBookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    if (user) setBookings(getBookingsForUser(user.email))
  }, [user])

  return (
    <div>
      <section className="bg-night text-paper">
        <div className="max-w-4xl mx-auto px-6 pt-14 pb-10">
          <p className="text-marigold text-sm font-medium mb-2">Your trip</p>
          <h1 className="font-display text-4xl">My bookings</h1>
          <p className="text-paper/70 mt-3">
            Everything you've booked through Stay and Move, in one place.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {bookings.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-ink/60">No bookings yet.</p>
            <div className="mt-4 flex justify-center gap-4">
              <Link to="/stay" className="text-vermillion font-medium">Book a hotel →</Link>
              <Link to="/move" className="text-vermillion font-medium">Book transport →</Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div key={b.reference} className="ledger-rule-strong pt-4 pb-2 flex items-start justify-between gap-4">
                <div>
                  <span className={`text-xs font-medium uppercase tracking-wide ${b.type === 'hotel' ? 'text-marigold-dark' : 'text-vermillion'}`}>
                    {b.type === 'hotel' ? 'Stay' : 'Move'}
                  </span>
                  <h3 className="font-semibold mt-1">{b.title}</h3>
                  <p className="text-ink/60 text-sm">{b.detail}</p>
                </div>
                <span className="text-ink/40 text-xs whitespace-nowrap">{b.reference}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
