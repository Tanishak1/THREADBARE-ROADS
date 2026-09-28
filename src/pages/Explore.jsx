import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getStates, getAllCities } from '../data/india'

const CITY_IMAGES = {
  jaipur: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=80',
  jodhpur: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=80',
  alleppey: 'https://images.unsplash.com/photo-1602307531131-a8d5f3e4d2aa?auto=format&fit=crop&w=900&q=80',
  munnar: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=80',
  agra: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80',
  varanasi: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=900&q=80',
  panaji: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80',
  calangute: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80',
  manali: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=80',
  madurai: 'https://images.unsplash.com/photo-1600100397608-f010d7b2b7e4?auto=format&fit=crop&w=900&q=80',
  delhi: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=900&q=80',
}

export default function Explore() {
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [activeState, setActiveState] = useState('all')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getStates(), getAllCities()]).then(([s, c]) => {
      setStates(s)
      setCities(c)
      setLoading(false)
    })
  }, [])

  const visibleCities = cities
    .filter((c) =>
      activeState === 'all'
        ? true
        : c.state === states.find((s) => s.id === activeState)?.name
    )
    .filter((c) =>
      query.trim() === ''
        ? true
        : c.name.toLowerCase().includes(query.trim().toLowerCase())
    )

  return (
    <div>
      {/* Hero */}
      <section className="bg-night text-paper">
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-12">
          <p className="text-marigold text-sm font-medium mb-3">
            A living atlas of India
          </p>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.05] max-w-2xl">
            Every city has a story worth stamping in your passport.
          </h1>
          <p className="mt-5 text-paper/70 max-w-lg text-lg">
            Pick a state, find what to see, what to eat, and where locals
            actually eat it — rated by real travellers, not a brochure.
          </p>
          <div className="mt-7 max-w-sm">
            <label htmlFor="city-search" className="sr-only">Search cities</label>
            <input
              id="city-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a city, e.g. Jaipur"
              className="w-full px-4 py-3 bg-paper text-ink placeholder:text-ink/40 border border-paper/20 focus:border-marigold outline-none"
            />
          </div>
        </div>
      </section>

      {/* State filter strip */}
      <div className="border-b border-ink/10 bg-paper sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 flex gap-1 overflow-x-auto py-3">
          <button
            onClick={() => setActiveState('all')}
            className={`px-4 py-2 text-sm whitespace-nowrap font-medium transition-colors ${
              activeState === 'all'
                ? 'bg-night text-paper'
                : 'text-ink/60 hover:text-ink'
            }`}
          >
            All states
          </button>
          {states.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveState(s.id)}
              className={`px-4 py-2 text-sm whitespace-nowrap font-medium transition-colors ${
                activeState === s.id
                  ? 'bg-night text-paper'
                  : 'text-ink/60 hover:text-ink'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* City list */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        {loading ? (
          <p className="text-ink/50">Loading cities…</p>
        ) : visibleCities.length === 0 ? (
          <p className="text-ink/50">
            No cities match "{query}". Try a different search or clear it.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleCities.map((city, i) => (
              <Link
                key={city.id}
                to={`/city/${city.id}`}
                className="group block overflow-hidden border border-ink/10 bg-paper transition-all duration-300 hover:-translate-y-1 hover:border-vermillion/40 hover:shadow-[0_12px_30px_rgba(20,33,61,0.12)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-night">
                  <img
                    src={CITY_IMAGES[city.id]}
                    alt={`${city.name} landmark or landscape`}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-night/10 to-transparent" />
                  <span className="absolute bottom-4 left-4 text-xs text-paper font-medium">
                    {String(i + 1).padStart(2, '0')} · {city.state}
                  </span>
                </div>
                <div className="p-5">
                  <h2 className="font-display text-3xl group-hover:text-vermillion transition-colors">
                    {city.name}
                  </h2>
                  <p className="mt-2 text-ink/70 text-sm leading-relaxed">
                    {city.description}
                  </p>
                  <span className="mt-4 inline-block text-sm font-medium text-night group-hover:text-vermillion transition-colors">
                    See the city →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
