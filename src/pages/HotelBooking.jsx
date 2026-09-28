import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { addBooking } from '../data/bookings'

async function searchHotels({ city }) {
  const response = await fetch(`/api/hotels?city=${encodeURIComponent(city.trim())}`)
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.detail || 'Hotel search is temporarily unavailable.')
  return data.map((room) => ({
    ...room,
    name: room.vendor_name || 'Local hotel',
    type: room.title,
    price: room.price,
  }))
}

// Stand-in for your hotel app's booking endpoint, e.g.
// POST https://your-hotel-app.example.com/api/bookings
async function bookHotel({ user, hotel, checkIn, checkOut }) {
  await new Promise((r) => setTimeout(r, 600))
  return {
    bookingId: `HTL-${Math.floor(Math.random() * 900000 + 100000)}`,
    hotel,
    checkIn,
    checkOut,
    guest: user.email,
  }
}

export default function HotelBooking() {
  const { user } = useAuth()
  const location = useLocation()
  const [city, setCity] = useState(location.state?.presetCity || '')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [results, setResults] = useState(null)
  const [searching, setSearching] = useState(false)
  const [confirmation, setConfirmation] = useState(null)
  const [booking, setBooking] = useState(false)
  const [error, setError] = useState('')

  async function handleSearch(e) {
    e.preventDefault()
    if (!city) return
    setSearching(true)
    setConfirmation(null)
    setError('')
    try {
      const hotels = await searchHotels({ city, checkIn, checkOut })
      setResults(hotels)
    } catch (searchError) {
      setResults([])
      setError(searchError.message)
    } finally {
      setSearching(false)
    }
  }

  async function handleBook(hotel) {
    setBooking(true)
    const result = await bookHotel({ user, hotel, checkIn, checkOut })
    addBooking({
      type: 'hotel',
      userEmail: user.email,
      title: result.hotel.name,
      detail: `${result.checkIn || 'Check-in TBD'} → ${result.checkOut || 'Check-out TBD'}`,
      reference: result.bookingId,
    })
    setConfirmation(result)
    setBooking(false)
  }

  return (
    <div>
      <section className="bg-night text-paper">
        <div className="max-w-4xl mx-auto px-6 pt-14 pb-10">
          <p className="text-marigold text-sm font-medium mb-2">Stay</p>
          <h1 className="font-display text-4xl">Find a place to stay</h1>
          <p className="text-paper/70 mt-3 max-w-lg">
            Search welcoming stays and keep your accommodation plans together
            as you shape your next city break.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <form onSubmit={handleSearch} className="grid sm:grid-cols-4 gap-4 items-end">
          <div className="sm:col-span-2">
            <label className="block text-sm text-ink/60 mb-1">City</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Jaipur"
              required
              className="w-full px-3 py-2.5 border border-ink/20 focus:border-night outline-none bg-white"
            />
          </div>
          <div>
            <label className="block text-sm text-ink/60 mb-1">Check-in</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full px-3 py-2.5 border border-ink/20 focus:border-night outline-none bg-white"
            />
          </div>
          <div>
            <label className="block text-sm text-ink/60 mb-1">Check-out</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full px-3 py-2.5 border border-ink/20 focus:border-night outline-none bg-white"
            />
          </div>
          <button
            type="submit"
            className="sm:col-span-4 bg-vermillion text-paper font-semibold py-2.5 hover:opacity-90 transition-opacity"
          >
            {searching ? 'Searching…' : 'Search hotels'}
          </button>
        </form>

        {results && (
          <div className="mt-10 space-y-4">
            <h2 className="font-display text-2xl">Results for {city}</h2>
            {results.length === 0 && <p className="border border-ink/15 bg-paper p-5 text-ink/65">No rooms are currently listed in {city}. Try another city or check back soon.</p>}
            {results.map((hotel) => (
              <div
                key={hotel.id}
                className="ledger-rule-strong pt-4 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {hotel.image_url && <img src={hotel.image_url} alt="" className="h-24 w-full object-cover sm:w-32" />}
                <div>
                  <h3 className="font-semibold">{hotel.name}</h3>
                  <p className="text-ink/60 text-sm">{hotel.type} · {hotel.available_count} available</p>
                  <p className="mt-1 text-xs text-ink/50">{hotel.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-display text-lg">₹{hotel.price.toLocaleString('en-IN')}<span className="text-sm text-ink/50"> /night</span></span>
                  <button
                    onClick={() => handleBook(hotel)}
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

        {error && <p role="alert" className="mt-6 border border-vermillion/30 bg-paper p-4 text-sm text-vermillion">{error}</p>}

        {confirmation && (
          <div className="mt-10 border-2 border-teal p-6">
            <p className="text-teal font-semibold">Booking confirmed</p>
            <p className="mt-2 text-ink/80">
              {confirmation.hotel.name} — {confirmation.checkIn || 'today'} to{' '}
              {confirmation.checkOut || 'TBD'}
            </p>
            <p className="text-ink/50 text-sm mt-1">
              Reference: {confirmation.bookingId} · Guest: {confirmation.guest}
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
