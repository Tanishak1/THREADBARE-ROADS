import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCity } from '../data/india'
import RatingStamp from '../components/RatingStamp'

const CITY_IMAGES = {
  jaipur: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=85',
  jodhpur: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1600&q=85',
  alleppey: 'https://images.unsplash.com/photo-1602307531131-a8d5f3e4d2aa?auto=format&fit=crop&w=1600&q=85',
  munnar: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=85',
  agra: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=85',
  varanasi: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=1600&q=85',
  panaji: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=85',
  calangute: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=85',
  manali: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=85',
  madurai: 'https://images.unsplash.com/photo-1600100397608-f010d7b2b7e4?auto=format&fit=crop&w=1600&q=85',
  delhi: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1600&q=85',
}

const DELHI_ACCESS = {
  'Red Fort': {
    airport: 'Indira Gandhi International Airport: 21 km; take the Airport Express to New Delhi, then a taxi or metro toward Lal Qila.',
    bus: 'Kashmere Gate ISBT: 4 km; continue by metro or taxi to Old Delhi.',
    railway: 'Old Delhi Railway Station: 2 km; cycle-rickshaw or taxi to Lahori Gate.',
    metro: 'Lal Qila Metro Station on the Violet Line: about 600 m walk.',
  },
  'Qutub Minar': {
    airport: 'Indira Gandhi International Airport: 12 km; taxi via NH 48 and Mehrauli-Gurgaon Road.',
    bus: 'Mehrauli Bus Terminal: about 2 km; local bus or auto-rickshaw to the monument.',
    railway: 'New Delhi Railway Station: 17 km; taxi or Yellow Line metro via Qutub Minar station.',
    metro: 'Qutub Minar Metro Station on the Yellow Line: about 2 km by auto-rickshaw.',
  },
  'Humayun\u2019s Tomb': {
    airport: 'Indira Gandhi International Airport: 18 km; taxi via Lodhi Road and Mathura Road.',
    bus: 'Maharana Pratap ISBT: 11 km; take the metro or taxi toward Nizamuddin East.',
    railway: 'Hazrat Nizamuddin Railway Station: 2 km; taxi or auto-rickshaw to the east gate.',
    metro: 'JLN Stadium Metro Station on the Violet Line: about 2.5 km by auto-rickshaw.',
  },
  'India Gate': {
    airport: 'Indira Gandhi International Airport: 14 km; taxi via Sardar Patel Marg and Kartavya Path.',
    bus: 'Kashmere Gate ISBT: 11 km; bus or taxi toward Central Delhi.',
    railway: 'New Delhi Railway Station: 5 km; taxi or auto-rickshaw via India Gate Circle.',
    metro: 'Central Secretariat Metro Station on the Yellow and Violet Lines: about 2.5 km walk or auto-rickshaw.',
  },
  'Jama Masjid': {
    airport: 'Indira Gandhi International Airport: 21 km; Airport Express to New Delhi, then metro or taxi.',
    bus: 'Kashmere Gate ISBT: 4 km; metro to Jama Masjid or a short taxi ride.',
    railway: 'Old Delhi Railway Station: 1 km; walk or take an e-rickshaw toward Gate 1.',
    metro: 'Jama Masjid Metro Station on the Violet Line: about 700 m walk.',
  },
  'Lotus Temple': {
    airport: 'Indira Gandhi International Airport: 21 km; taxi via Outer Ring Road.',
    bus: 'Maharana Pratap ISBT: 17 km; metro or taxi toward Kalkaji.',
    railway: 'New Delhi Railway Station: 14 km; Violet Line metro via Mandi House.',
    metro: 'Kalkaji Mandir Metro Station on the Violet and Magenta Lines: about 1 km walk.',
  },
  'Purana Qila': {
    airport: 'Indira Gandhi International Airport: 15 km; taxi via Sardar Patel Marg and India Gate.',
    bus: 'Maharana Pratap ISBT: 10 km; bus or taxi toward National Stadium.',
    railway: 'Hazrat Nizamuddin Railway Station: 5 km; taxi or auto-rickshaw via Mathura Road.',
    metro: 'Supreme Court Metro Station on the Blue Line: about 2.5 km by auto-rickshaw.',
  },
  'Agrasen ki Baoli': {
    airport: 'Indira Gandhi International Airport: 18 km; taxi via Barakhamba Road and Hailey Lane.',
    bus: 'Kashmere Gate ISBT: 9 km; bus or metro to Connaught Place, then a short walk.',
    railway: 'New Delhi Railway Station: 2.5 km; taxi, auto-rickshaw, or walk via Barakhamba Road.',
    metro: 'Barakhamba Road Metro Station on the Blue Line: about 700 m walk.',
  },
  'Raj Ghat': {
    airport: 'Indira Gandhi International Airport: 20 km; taxi via Mahatma Gandhi Marg.',
    bus: 'Kashmere Gate ISBT: 5 km; bus or taxi toward Raj Ghat Power House.',
    railway: 'Old Delhi Railway Station: 3 km; taxi or e-rickshaw via Ring Road.',
    metro: 'Delhi Gate Metro Station on the Violet Line: about 2 km by auto-rickshaw.',
  },
  'Chandni Chowk': {
    airport: 'Indira Gandhi International Airport: 21 km; Airport Express to New Delhi, then Yellow Line metro.',
    bus: 'Kashmere Gate ISBT: 4 km; Yellow Line metro or taxi to Old Delhi.',
    railway: 'Old Delhi Railway Station: adjacent to the market; walk from the station exit.',
    metro: 'Chandni Chowk Metro Station on the Yellow Line: direct access to the market lanes.',
  },
}

const CITY_ACCESS = {
  jaipur: {
    airport: 'Jaipur International Airport: about 13 km; taxi or app cab to the city centre.',
    bus: 'Sindhi Camp Bus Stand: the main intercity bus terminal, about 3 km from the Old City.',
    railway: 'Jaipur Junction: about 4 km from the walled city; taxi, auto-rickshaw, or local bus.',
    metro: 'Badi Chaupar Metro Station on the Pink Line: useful for the Old City; last-mile auto-rickshaw to the monument.',
  },
  jodhpur: {
    airport: 'Jodhpur Airport: about 6 km; taxi or auto-rickshaw to the fort and old city.',
    bus: 'Paota Bus Stand: the main intercity bus terminal, about 3 km from the old city.',
    railway: 'Jodhpur Junction: about 3 km from Mehrangarh Fort; taxi or auto-rickshaw.',
    metro: 'No metro system currently operates in Jodhpur; use an auto-rickshaw, taxi, or local bus.',
  },
  alleppey: {
    airport: 'Cochin International Airport: about 85 km; taxi or pre-booked transfer to Alappuzha.',
    bus: 'Alappuzha KSRTC Bus Station: central bus terminal near the town and boat jetties.',
    railway: 'Alappuzha Railway Station: about 4 km from the beach and main boat jetties; auto-rickshaw or taxi.',
    metro: 'No metro system operates in Alappuzha; use an auto-rickshaw, taxi, or local bus.',
  },
  munnar: {
    airport: 'Cochin International Airport: about 110 km; taxi or pre-booked hill transfer.',
    bus: 'Munnar KSRTC Bus Station: central terminal in Munnar town.',
    railway: 'Aluva Railway Station: about 105 km; continue by taxi or state bus to Munnar.',
    metro: 'No metro system operates in Munnar; use local taxis or buses for the final journey.',
  },
  agra: {
    airport: 'Agra Airport: about 13 km from the Taj Mahal; taxi or auto-rickshaw.',
    bus: 'Idgah Bus Stand: the main intercity terminal, about 6 km from the Taj Mahal.',
    railway: 'Agra Cantt Railway Station: about 7 km; taxi, auto-rickshaw, or local bus.',
    metro: 'Agra Metro is operating in phases; for the Taj area, use a taxi or auto-rickshaw from the nearest active corridor.',
  },
  varanasi: {
    airport: 'Lal Bahadur Shastri International Airport: about 25 km; taxi or app cab to the ghats.',
    bus: 'Varanasi Cantt Bus Stand: central intercity terminal, about 5 km from the old city.',
    railway: 'Varanasi Junction (Cantt): about 5 km from Dashashwamedh Ghat; taxi or auto-rickshaw.',
    metro: 'No metro system currently operates in Varanasi; use an auto-rickshaw, e-rickshaw, or boat for ghat areas.',
  },
  panaji: {
    airport: 'Manohar International Airport: about 30 km; taxi or pre-booked cab to Panaji.',
    bus: 'Kadamba Bus Stand, Panaji: central terminal for Goa and interstate buses.',
    railway: 'Karmali Railway Station: about 12 km from Panaji; taxi or local bus.',
    metro: 'No metro system operates in Goa; use a taxi, local bus, or app cab.',
  },
  calangute: {
    airport: 'Manohar International Airport: about 38 km; taxi or pre-booked cab to Calangute.',
    bus: 'Mapusa Bus Stand: about 9 km; continue by local bus or taxi to Calangute.',
    railway: 'Thivim Railway Station: about 20 km; taxi or local bus to the beach area.',
    metro: 'No metro system operates in Goa; use a taxi, local bus, or app cab.',
  },
  manali: {
    airport: 'Kullu-Manali Airport at Bhuntar: about 52 km; taxi or pre-booked transfer through the valley.',
    bus: 'Manali Bus Stand: central terminal for Volvo and state buses from Delhi and Chandigarh.',
    railway: 'Joginder Nagar Railway Station: about 160 km; most visitors arrive by road from Chandigarh or Delhi.',
    metro: 'No metro system operates in Manali; use local taxis, buses, or walking trails.',
  },
  madurai: {
    airport: 'Madurai International Airport: about 12 km; taxi or app cab to the temple district.',
    bus: 'Mattuthavani Integrated Bus Stand: main intercity terminal, about 7 km from the temple.',
    railway: 'Madurai Junction: about 2 km from Meenakshi Amman Temple; auto-rickshaw or taxi.',
    metro: 'No metro system currently operates in Madurai; use an auto-rickshaw, taxi, or local bus.',
  },
}

function getVendorPhone(vendor) {
  return vendor.phone || vendor.vendor_phone || vendor.phone_number || ''
}

function openVendorWhatsApp(vendor, cityName) {
  const phoneNumber = getVendorPhone(vendor).replace(/\D/g, '')
  if (!phoneNumber) return

  const message = `Hi, I found your listing on the Travel App. I would like to know more about ${vendor.name} in ${cityName}.`
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
}

export default function CityDetail() {
  const { cityId } = useParams()
  const [city, setCity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedAttraction, setSelectedAttraction] = useState(null)

  useEffect(() => {
    setLoading(true)
    getCity(cityId).then((c) => {
      setCity(c)
      setSelectedAttraction(c?.attractions?.[0] ?? null)
      setLoading(false)
    })
  }, [cityId])

  if (loading) {
    return <p className="max-w-6xl mx-auto px-6 py-16 text-ink/50">Loading…</p>
  }

  if (!city) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16">
        <p className="text-ink/70">We couldn't find that city.</p>
        <Link to="/" className="text-vermillion font-medium">← Back to Explore</Link>
      </div>
    )
  }

  return (
    <div>
      <section className="relative overflow-hidden bg-night text-paper">
        <img
          src={CITY_IMAGES[city.id]}
          alt={`${city.name} landmark or landscape`}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-night/75" />
        <div className="relative max-w-6xl mx-auto px-6 pt-12 pb-10">
          <Link to="/" className="text-marigold text-sm font-medium">← All cities</Link>
          <p className="text-paper/60 text-sm mt-4">{city.state}</p>
          <h1 className="font-display text-5xl mt-1">{city.name}</h1>
          <p className="mt-4 max-w-xl text-paper/80 text-lg leading-relaxed">
            {city.description}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="space-y-10">
          {/* History & why famous */}
          <section>
            <h2 className="font-display text-2xl mb-3">Why it's famous</h2>
            <p className="text-ink/80 leading-relaxed">{city.whyFamous}</p>
            <h3 className="font-display text-xl mt-6 mb-2">A little history</h3>
            <p className="text-ink/80 leading-relaxed">{city.history}</p>
          </section>

          {/* Attractions */}
          <section>
            <div className="flex items-end justify-between gap-4 mb-4">
              <div>
                <p className="text-vermillion text-xs font-semibold uppercase tracking-[0.18em]">Places worth the detour</p>
                <h2 className="font-display text-2xl mt-1">What to explore</h2>
              </div>
              <span className="text-ink/40 text-sm">{city.attractions.length} spots</span>
            </div>
            <div className="grid lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] gap-8 items-start">
              <div className="space-y-2">
                {city.attractions.map((attraction, index) => {
                  const isSelected = selectedAttraction?.name === attraction.name

                  return (
                    <button
                      key={attraction.name}
                      type="button"
                      onClick={() => setSelectedAttraction(attraction)}
                      className={`w-full text-left border p-4 transition-colors ${
                        isSelected
                          ? 'border-vermillion bg-vermillion text-paper'
                          : 'border-ink/10 hover:border-vermillion/50 hover:bg-night/5'
                      }`}
                    >
                      <span className={`text-xs ${isSelected ? 'text-paper/70' : 'text-ink/40'}`}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="block font-semibold mt-2">{attraction.name}</span>
                      <span className={`block text-xs mt-1 ${isSelected ? 'text-paper/70' : 'text-ink/50'}`}>
                        {attraction.type}
                      </span>
                    </button>
                  )
                })}
              </div>

              {selectedAttraction && (
                <article className="border border-ink/10 bg-night text-paper overflow-hidden lg:sticky lg:top-20">
                  <div className="aspect-[16/9] bg-night-light">
                    <img
                      src={selectedAttraction.image || CITY_IMAGES[city.id]}
                      alt={selectedAttraction.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-marigold text-xs font-semibold uppercase tracking-[0.18em]">Selected spot</p>
                    <h3 className="font-display text-3xl mt-2">{selectedAttraction.name}</h3>
                    <p className="text-paper/60 text-xs uppercase tracking-[0.16em] mt-3">{selectedAttraction.type}</p>
                    <p className="text-paper/75 leading-relaxed mt-4">{selectedAttraction.note}</p>
                    <div className="border-t border-paper/20 mt-5 pt-5">
                      <p className="text-marigold text-xs font-semibold uppercase tracking-[0.18em]">History</p>
                      <p className="text-paper/75 leading-relaxed mt-2">{selectedAttraction.history}</p>
                    </div>
                    {(DELHI_ACCESS[selectedAttraction.name] || CITY_ACCESS[city.id]) && (
                      <div className="border-t border-paper/20 mt-5 pt-5">
                        <p className="text-marigold text-xs font-semibold uppercase tracking-[0.18em]">How to reach</p>
                        <dl className="mt-3 space-y-3 text-sm">
                          <div>
                            <dt className="text-paper/50">Airport</dt>
                            <dd className="text-paper/80 mt-1">{(DELHI_ACCESS[selectedAttraction.name] || CITY_ACCESS[city.id]).airport}</dd>
                          </div>
                          <div>
                            <dt className="text-paper/50">Major bus station</dt>
                            <dd className="text-paper/80 mt-1">{(DELHI_ACCESS[selectedAttraction.name] || CITY_ACCESS[city.id]).bus}</dd>
                          </div>
                          <div>
                            <dt className="text-paper/50">Railway station</dt>
                            <dd className="text-paper/80 mt-1">{(DELHI_ACCESS[selectedAttraction.name] || CITY_ACCESS[city.id]).railway}</dd>
                          </div>
                          <div>
                            <dt className="text-paper/50">Nearest metro</dt>
                            <dd className="text-paper/80 mt-1">{(DELHI_ACCESS[selectedAttraction.name] || CITY_ACCESS[city.id]).metro}</dd>
                          </div>
                        </dl>
                      </div>
                    )}
                  </div>
                </article>
              )}
            </div>
          </section>

          {/* Local markets and restaurants */}
          <section>
            <div className="flex items-end justify-between gap-4 mb-4">
              <div>
                <p className="text-vermillion text-xs font-semibold uppercase tracking-[0.18em]">Find the city beyond the landmarks</p>
                <h2 className="font-display text-2xl mt-1">Local discoveries</h2>
              </div>
              <span className="text-ink/40 text-sm">Eat, browse, remember</span>
            </div>
            <div className="grid lg:grid-cols-2 gap-10">
              {city.localMarkets?.length > 0 && (
                <div>
                  <div className="flex items-end justify-between gap-4 mb-4">
                    <h3 className="font-display text-xl">Local markets</h3>
                    <span className="text-ink/40 text-sm">{city.localMarkets.length} markets</span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-5">
                    {city.localMarkets.map((market) => (
                      <article key={market.name} className="ledger-rule pt-4">
                        <h4 className="font-semibold">{market.name}</h4>
                        <p className="text-vermillion text-sm font-medium mt-1">Famous for: {market.item}</p>
                        <p className="text-ink/70 text-sm mt-1 leading-relaxed">{market.note}</p>
                      </article>
                    ))}
                  </div>

                  <div className="border-t border-ink/10 mt-8 pt-6">
                    <h3 className="font-display text-xl mb-4">Local food to try</h3>
                    <div className="space-y-4">
                      {city.food.map((food) => (
                        <article key={food.name} className="ledger-rule pt-4">
                          <h4 className="font-semibold">{food.name}</h4>
                          <p className="text-ink/70 text-sm mt-1">{food.note}</p>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-end justify-between gap-4 mb-4">
                  <h3 className="font-display text-xl">Nearest restaurants</h3>
                  <span className="text-ink/40 text-sm">{city.restaurants.length} places</span>
                </div>
                <div className="space-y-5">
                  {city.restaurants.map((restaurant) => (
                    <article key={restaurant.name} className="ledger-rule-strong pt-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                        <h4 className="font-semibold">{restaurant.name}</h4>
                        <p className="text-ink/60 text-sm">{restaurant.cuisine}</p>
                        <p className="text-ink/50 text-xs mt-1">{restaurant.area}</p>
                        </div>
                        <RatingStamp rating={restaurant.rating} reviews={restaurant.reviews} />
                      </div>
                      <button
                        type="button"
                        disabled={!getVendorPhone(restaurant)}
                        onClick={() => openVendorWhatsApp(restaurant, city.name)}
                        title={!getVendorPhone(restaurant) ? 'Vendor contact unavailable' : 'Open WhatsApp chat'}
                        className="mt-4 w-full bg-teal px-4 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-teal-dark disabled:cursor-not-allowed disabled:bg-ink/10 disabled:text-ink/40"
                      >
                        Connect with Vendor
                      </button>
                    </article>
                  ))}
                </div>
                <p className="text-xs text-ink/40 mt-6">
                  Ratings and reviews help you choose a place that fits your journey.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Cross-links to booking pages, kept close to the content that motivates them */}
      <div className="border-t border-ink/10 bg-night/5">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row gap-4">
          <Link
            to="/stay"
            state={{ presetCity: city.name }}
            className="flex-1 bg-night text-paper px-6 py-4 hover:bg-night-light transition-colors"
          >
            <span className="block text-marigold text-sm font-medium">Next step</span>
            <span className="block font-display text-lg mt-1">Find a place to stay in {city.name} →</span>
          </Link>
          <Link
            to="/move"
            state={{ presetCity: city.name }}
            className="flex-1 bg-vermillion text-paper px-6 py-4 hover:opacity-90 transition-opacity"
          >
            <span className="block text-paper/70 text-sm font-medium">Getting around</span>
            <span className="block font-display text-lg mt-1">Book local transport in {city.name} →</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
