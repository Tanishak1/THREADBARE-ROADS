import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { addBooking } from '../data/bookings'

// Stand-in for your travel app's options endpoint, e.g.
// GET https://your-travel-app.example.com/api/transport?city=...
async function searchTransport({ city, pickup, destination }) {
  await new Promise((r) => setTimeout(r, 500))
  return [
    { mode: 'Auto-rickshaw', desc: `Best for short hops from ${pickup} to ${destination}`, price: 60 },
    { mode: 'Cab (sedan)', desc: `Air-conditioned ride from ${pickup} to ${destination}`, price: 350 },
    { mode: 'E-bike rental', desc: `Self-drive option for exploring ${city} from ${pickup}`, price: 150 },
  ]
}

// Stand-in for your travel app's booking endpoint, e.g.
// POST https://your-travel-app.example.com/api/transport/book
async function bookTransport({ user, option, city, pickup, destination, when }) {
  await new Promise((r) => setTimeout(r, 600))
  return {
    bookingId: `TRP-${Math.floor(Math.random() * 900000 + 100000)}`,
    option,
    city,
    pickup,
    destination,
    when,
    rider: user.email,
  }
}

export default function Transport() {
  const { user } = useAuth()
  const location = useLocation()
  const [city, setCity] = useState(location.state?.presetCity || '')
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [when, setWhen] = useState('')
  const [results, setResults] = useState(null)
  const [searching, setSearching] = useState(false)
  const [confirmation, setConfirmation] = useState(null)
  const [booking, setBooking] = useState(false)

  async function handleSearch(e) {
    e.preventDefault()
    if (!city || !pickup || !destination) return
    setSearching(true)
    setConfirmation(null)
    const options = await searchTransport({ city, pickup, destination })
    setResults(options)
    setSearching(false)
  }

  async function handleBook(option) {
    setBooking(true)
    const result = await bookTransport({ user, option, city, pickup, destination, when })
    addBooking({
      type: 'transport',
      userEmail: user.email,
      title: `${result.option.mode}: ${result.pickup} to ${result.destination}`,
      detail: `${result.city} · ${result.when ? new Date(result.when).toLocaleString('en-IN') : 'Time TBD'}`,
      pickup: result.pickup,
      destination: result.destination,
      reference: result.bookingId,
    })
    setConfirmation(result)
    setBooking(false)
  }

  return (
    <div>
      <section className="bg-night text-paper">
        <div className="max-w-4xl mx-auto px-6 pt-14 pb-10">
          <p className="text-marigold text-sm font-medium mb-2">Move</p>
          <h1 className="font-display text-4xl">Get around the city</h1>
          <p className="text-paper/70 mt-3 max-w-lg">
            Compare practical ways to move through the city, from quick rides
            to comfortable options for longer days out.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <form onSubmit={handleSearch} className="grid sm:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-sm text-ink/60 mb-1">City</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Varanasi"
              required
              className="w-full px-3 py-2.5 border border-ink/20 focus:border-night outline-none bg-white"
            />
          </div>
          <div>
            <label className="block text-sm text-ink/60 mb-1">Your location</label>
            <input
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="e.g. New Delhi Railway Station"
              required
              className="w-full px-3 py-2.5 border border-ink/20 focus:border-night outline-none bg-white"
            />
          </div>
          <div>
            <label className="block text-sm text-ink/60 mb-1">Destination</label>
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Red Fort"
              required
              className="w-full px-3 py-2.5 border border-ink/20 focus:border-night outline-none bg-white"
            />
          </div>
          <div>
            <label className="block text-sm text-ink/60 mb-1">When</label>
            <input
              type="datetime-local"
              value={when}
              onChange={(e) => setWhen(e.target.value)}
              className="w-full px-3 py-2.5 border border-ink/20 focus:border-night outline-none bg-white"
            />
          </div>
          <button
            type="submit"
            className="sm:col-span-2 bg-vermillion text-paper font-semibold py-2.5 hover:opacity-90 transition-opacity"
          >
            {searching ? 'Searching…' : 'Find transport'}
          </button>
        </form>

        {results && (
          <div className="mt-10 space-y-4">
            <h2 className="font-display text-2xl">Options from {pickup} to {destination}</h2>
            {results.map((option) => (
              <div
                key={option.mode}
                className="ledger-rule-strong pt-4 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h3 className="font-semibold">{option.mode}</h3>
                  <p className="text-ink/60 text-sm">{option.desc}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-display text-lg">₹{option.price}<span className="text-sm text-ink/50"> approx.</span></span>
                  <button
                    onClick={() => handleBook(option)}
                    disabled={booking}
                    className="px-4 py-2 bg-night text-paper text-sm font-medium hover:bg-night-light transition-colors disabled:opacity-60"
                  >
                    {booking ? 'Booking…' : 'Book'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {confirmation && (
          <div className="mt-10 border-2 border-teal p-6">
            <p className="text-teal font-semibold">Ride booked</p>
            <p className="mt-2 text-ink/80">
              {confirmation.option.mode} from {confirmation.pickup} to {confirmation.destination} in {confirmation.city}
              {confirmation.when ? ` at ${new Date(confirmation.when).toLocaleString('en-IN')}` : ''}
            </p>
            <p className="text-ink/50 text-sm mt-1">
              Reference: {confirmation.bookingId} · Rider: {confirmation.rider}
            </p>
            <Link to="/bookings" className="inline-block mt-3 text-sm font-medium text-night hover:text-vermillion">
              View all my bookings →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
