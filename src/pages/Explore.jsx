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

const features = [
  ['01', 'Discover', 'Explore Indian cities through heritage, food, culture and local recommendations.'],
  ['02', 'Plan with AI', 'Build a structured itinerary around your days, budget, interests and transport preference.'],
  ['03', 'Travel locally', 'Keep stays, local movement and bookings connected to the same traveller journey.'],
  ['04', 'Support local', 'Give local hosts, food businesses and experience providers a direct digital entry point.'],
]

export default function Explore() {
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [activeState, setActiveState] = useState('all')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getStates(), getAllCities()]).then(([s, c]) => {
      setStates(s); setCities(c); setLoading(false)
    })
  }, [])

  const visibleCities = cities
    .filter((c) => activeState === 'all' || c.state === states.find((s) => s.id === activeState)?.name)
    .filter((c) => !query.trim() || c.name.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <div>
      <section className="relative overflow-hidden bg-night text-paper">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-marigold/20" />
        <div className="absolute right-10 top-10 h-52 w-52 rounded-full border border-paper/10" />
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-16 md:pt-24 md:pb-20 relative">
          <div className="inline-flex items-center gap-2 border border-paper/20 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-marigold">
            Smart India Hackathon · SIH 26204
          </div>
          <div className="mt-7 grid lg:grid-cols-[1.4fr_.6fr] gap-10 items-end">
            <div>
              <p className="text-marigold text-sm font-medium mb-3">India, beyond the obvious.</p>
              <h1 className="font-display text-5xl md:text-7xl leading-[.98] max-w-4xl">
                Discover deeper. Plan smarter. Travel local.
              </h1>
              <p className="mt-6 text-paper/70 max-w-2xl text-lg leading-relaxed">
                THREADBARE ROADS connects destination discovery, AI-assisted trip planning,
                stays, local transport and local businesses in one India-first travel experience.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/plan" className="px-6 py-3 bg-marigold text-night font-semibold hover:bg-marigold-dark transition-colors">
                  Plan my trip →
                </Link>
                <Link to="/about" className="px-6 py-3 border border-paper/30 text-paper font-semibold hover:border-marigold hover:text-marigold transition-colors">
                  See how it works
                </Link>
              </div>
            </div>
            <div className="border-l border-paper/20 pl-6 grid grid-cols-2 gap-6">
              <div><strong className="block font-display text-3xl text-marigold">1</strong><span className="text-sm text-paper/60">unified travel journey</span></div>
              <div><strong className="block font-display text-3xl text-marigold">AI</strong><span className="text-sm text-paper/60">assisted itinerary</span></div>
              <div><strong className="block font-display text-3xl text-marigold">Local</strong><span className="text-sm text-paper/60">vendor ecosystem</span></div>
              <div><strong className="block font-display text-3xl text-marigold">India</strong><span className="text-sm text-paper/60">focused discovery</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10 bg-white/30">
        <div className="max-w-6xl mx-auto px-6 py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map(([n, title, copy]) => (
            <div key={n}>
              <span className="text-xs tracking-widest text-vermillion">{n}</span>
              <h2 className="font-display text-2xl mt-2">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pt-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <p className="text-vermillion text-xs font-semibold uppercase tracking-[.18em]">Explore India</p>
            <h2 className="font-display text-4xl mt-2">Start with a city.</h2>
          </div>
          <div className="w-full md:max-w-sm">
            <label htmlFor="city-search" className="sr-only">Search cities</label>
            <input id="city-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a city, e.g. Jaipur"
              className="w-full px-4 py-3 bg-white/60 text-ink border border-ink/15 focus:border-marigold outline-none" />
          </div>
        </div>
      </section>

      <div className="border-b border-ink/10 bg-paper sticky top-0 z-10 mt-7">
        <div className="max-w-6xl mx-auto px-6 flex gap-1 overflow-x-auto py-3">
          <button onClick={() => setActiveState('all')} className={`px-4 py-2 text-sm whitespace-nowrap font-medium transition-colors ${activeState === 'all' ? 'bg-night text-paper' : 'text-ink/60 hover:text-ink'}`}>All states</button>
          {states.map((s) => (
            <button key={s.id} onClick={() => setActiveState(s.id)} className={`px-4 py-2 text-sm whitespace-nowrap font-medium transition-colors ${activeState === s.id ? 'bg-night text-paper' : 'text-ink/60 hover:text-ink'}`}>{s.name}</button>
          ))}
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-6 py-10">
        {loading ? <p className="text-ink/50">Loading cities…</p> : visibleCities.length === 0 ? (
          <p className="text-ink/50">No cities match “{query}”. Try another search.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleCities.map((city, i) => (
              <Link key={city.id} to={`/city/${city.id}`} className="group block overflow-hidden border border-ink/10 bg-paper transition-all duration-300 hover:-translate-y-1 hover:border-vermillion/40 hover:shadow-[0_12px_30px_rgba(20,33,61,0.12)]">
                <div className="relative aspect-[16/10] overflow-hidden bg-night">
                  <img src={CITY_IMAGES[city.id]} alt={`${city.name} landmark or landscape`} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-night/10 to-transparent" />
                  <span className="absolute bottom-4 left-4 text-xs text-paper font-medium">{String(i + 1).padStart(2, '0')} · {city.state}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-3xl group-hover:text-vermillion transition-colors">{city.name}</h3>
                  <p className="mt-2 text-ink/70 text-sm leading-relaxed">{city.description}</p>
                  <span className="mt-4 inline-block text-sm font-medium text-night group-hover:text-vermillion">Explore city →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="bg-night text-paper">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-8 md:items-center">
          <div>
            <p className="text-marigold text-sm">Ready to turn discovery into a journey?</p>
            <h2 className="font-display text-4xl mt-2">Build your itinerary around you.</h2>
          </div>
          <Link to="/plan" className="self-start md:self-auto px-6 py-3 bg-marigold text-night font-semibold">Open AI Planner →</Link>
        </div>
      </section>
    </div>
  )
}
