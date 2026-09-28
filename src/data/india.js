// Mock dataset standing in for a real backend (e.g. GET /api/states, /api/cities/:id).
// Swap the functions at the bottom for real fetch() calls once your API is ready —
// every component in this app only talks to those functions, never to this array directly.

export const STATES = [
  {
    id: 'delhi',
    name: 'Delhi',
    tagline: 'Imperial avenues, ancient ruins and living old-city lanes',
    cities: [
      {
        id: 'delhi',
        name: 'Delhi',
        state: 'Delhi',
        description: 'India’s capital is a layered city where Mughal walls, colonial avenues, sacred monuments and busy bazaars meet.',
        history:
          'Delhi has been a major settlement for more than a millennium. Its historic heart grew through successive capitals, including the walled Mughal city of Shahjahanabad and New Delhi, inaugurated as the capital of British India in 1931.',
        whyFamous: 'The city brings together the Red Fort, Qutub Minar, Humayun’s Tomb, India Gate, colonial-era neighborhoods, cultural heritage sites, and iconic places like Chandni Chowk, Connaught Place, and the Lotus Temple.',
        attractions: [
          { name: 'Red Fort', type: 'Fort', note: 'A vast red sandstone citadel with ceremonial halls, gardens and palace apartments.', history: 'Shah Jahan built the Red Fort between 1638 and 1648 as the palace-fort of his new capital, Shahjahanabad. Its Lahori Gate became a national symbol after independence.', image: 'https://images.unsplash.com/photo-1596306499309-91ff6fbd8c9a?auto=format&fit=crop&w=1200&q=85' },
          { name: 'Qutub Minar', type: 'Minaret', note: 'A soaring early-medieval tower surrounded by the ruins of the first Delhi Sultanate complex.', history: 'Construction began under Qutb-ud-din Aibak around 1199 and continued under his successors. The 73-metre tower was built in stages and bears inscriptions from several rulers.', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=85' },
          { name: 'Humayun’s Tomb', type: 'Mausoleum', note: 'A garden tomb of red sandstone and marble, often described as a forerunner of the Taj Mahal.', history: 'Commissioned by Hamida Banu Begum in 1569, the tomb introduced the grand Persian charbagh garden-tomb tradition to India and became an important model for later Mughal architecture.', image: 'https://images.unsplash.com/photo-1505761671935-60e7925ab6b4?auto=format&fit=crop&w=1200&q=85' },
          { name: 'India Gate', type: 'War memorial', note: 'A monumental arch on Rajpath commemorating Indian soldiers who died in the First World War.', history: 'Designed by Edwin Lutyens and completed in 1931, the 42-metre arch records the names of more than 13,000 soldiers of the former Indian Army.', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=85' },
          { name: 'Jama Masjid', type: 'Mosque', note: 'One of India’s largest mosques, rising above the lanes of Old Delhi.', history: 'Commissioned by Shah Jahan and completed in 1656, Jama Masjid was the principal congregational mosque of Shahjahanabad and remains a defining monument of the old city.', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=85' },
          { name: 'Lotus Temple', type: 'Temple', note: 'A contemporary Bahá’í House of Worship formed from 27 marble petals.', history: 'Completed in 1986, the Lotus Temple was designed by Iranian architect Fariborz Sahba. Its open, non-denominational worship space welcomes people of every faith.', image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1200&q=85' },
          { name: 'Purana Qila', type: 'Fort', note: 'A historic fort beside the Yamuna with monumental gates and layers of earlier settlements.', history: 'The fort was developed by Humayun and Sher Shah Suri in the sixteenth century on a site traditionally associated with Indraprastha, the legendary capital of the Mahabharata.', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=85' },
          { name: 'Agrasen ki Baoli', type: 'Stepwell', note: 'A dramatic stone stepwell hidden among the streets near Connaught Place.', history: 'Tradition attributes the original stepwell to the legendary king Agrasen; the visible structure was rebuilt in the fourteenth century during the Tughlaq period.', image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=85' },
          { name: 'Raj Ghat', type: 'Memorial', note: 'A quiet black-marble memorial marking the cremation place of Mahatma Gandhi.', history: 'The memorial was established after Gandhi’s cremation on 31 January 1948. Its open-to-sky design is centred on his final words, “Hey Ram”.', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=85' },
          { name: 'Chandni Chowk', type: 'Historic market', note: 'A centuries-old market district of spice lanes, food stalls, havelis and busy bazaars.', history: 'Planned in the seventeenth century by Jahanara Begum, Chandni Chowk formed the commercial spine of Shahjahanabad and connected the Red Fort with the city gates.', image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=85' },
          { name: 'Connaught Place', type: 'Commercial district', note: 'A central Georgian-style circular market district with cafés, luxury retail and city nightlife.', history: 'Built in the 1930s as New Delhi’s commercial heart, Connaught Place remains one of the city’s primary heritage and business spaces.', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=85' },
          { name: 'Gurudwara Bangla Sahib', type: 'Sikh shrine', note: 'A large gurdwara with a serene sarovar and an active langar serving free meals.', history: 'The shrine was built around a historic haveli associated with the eighth Sikh Guru, Har Krishan, and remains one of Delhi’s most visited religious sites.', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=85' },
          { name: 'Akshardham Temple', type: 'Temple complex', note: 'A grand Hindu temple and cultural complex with carved stonework, gardens and musical fountain shows.', history: 'Opened in 2005, Akshardham is one of Delhi’s most prominent modern spiritual and cultural landmarks, drawing millions of visitors every year.', image: 'https://images.unsplash.com/photo-1576485290814-1c72aa4d0d3e?auto=format&fit=crop&w=1200&q=85' },
        ],
        food: [
          { name: 'Chole Bhature', note: 'Spiced chickpeas served with deep-fried bhatura, a classic Old Delhi breakfast.' },
          { name: 'Nihari', note: 'Slow-cooked meat stew traditionally eaten with naan in the old city.' },
          { name: 'Daulat ki Chaat', note: 'A delicate seasonal milk foam sweet, especially associated with winter in Chandni Chowk.' },
          { name: 'Parathas', note: 'Stuffed flatbreads served with pickles and curries at the famous Paranthe Wali Gali.' },
          { name: 'Aloo Tikki', note: 'Crisp potato patties served with chutneys, a beloved street-food favourite across the city.' },
          { name: 'Jalebi', note: 'Crisp, syrup-soaked spirals that are especially popular during festivals and evening snacks.' },
          { name: 'Butter Chicken', note: 'A rich North Indian favourite that became a Delhi restaurant staple across the capital.' },
        ],
        restaurants: [
          { name: 'Karim’s', cuisine: 'Mughlai & kebabs', rating: 4.4, reviews: 18400, area: 'Jama Masjid' },
          { name: 'Paranthe Wali Gali', cuisine: 'Stuffed parathas', rating: 4.2, reviews: 8900, area: 'Chandni Chowk' },
          { name: 'Indian Accent', cuisine: 'Modern Indian', rating: 4.6, reviews: 5200, area: 'The Lodhi' },
          { name: 'Bukhara', cuisine: 'North Indian & tandoor', rating: 4.7, reviews: 7400, area: 'ITC Maurya' },
          { name: 'Gulati', cuisine: 'Traditional Indian fine dining', rating: 4.5, reviews: 6100, area: 'M-Block, Greater Kailash' },
        ],
      },
    ],
  },
]

export const LOCAL_MARKETS = {
  delhi: [
    { name: 'Chandni Chowk', item: 'Spices and dry fruits', note: 'Old Delhi’s historic market is known for Khari Baoli spice shops and street food.' },
    { name: 'Dilli Haat', item: 'Indian handicrafts', note: 'A curated open-air market where artisans sell textiles, pottery and regional crafts.' },
    { name: 'Khan Market', item: 'Books and specialty foods', note: 'A compact modern market with independent bookstores, bakeries and gourmet shops.' },
    { name: 'Sarojini Nagar', item: 'Fashion and streetwear', note: 'A popular market for affordable clothing, bags, accessories and export surplus shopping.' },
    { name: 'Janpath Market', item: 'Handicrafts and souvenirs', note: 'A bustling market for Indian textiles, jewellery, bohemian bags and small gifts.' },
    { name: 'Palika Bazaar', item: 'Accessories and electronics', note: 'A busy underground shopping hub for gadgets, fashion accessories and bargain buys.' },
  ],
}

// --- Data access layer -----------------------------------------------------
// Replace the bodies of these functions with real fetch() calls to your backend.
// Every page in this app calls these functions and awaits a Promise, so the
// switch from mock data to a live API requires no changes outside this file.

export async function getStates() {
  return STATES.map(({ id, name, tagline }) => ({ id, name, tagline }))
}

export async function getCitiesByState(stateId) {
  const state = STATES.find((s) => s.id === stateId)
  return state ? state.cities : []
}

export async function getCity(cityId) {
  for (const state of STATES) {
    const city = state.cities.find((c) => c.id === cityId)
    if (city) return { ...city, localMarkets: LOCAL_MARKETS[city.id] || [] }
  }
  return null
}

export async function getAllCities() {
  return STATES.flatMap((s) => s.cities)
}
