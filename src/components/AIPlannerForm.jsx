import { useState } from 'react'

const budgetOptions = [
  { value: 'budget', label: 'Budget-friendly' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'luxury', label: 'Luxury' },
]

const accommodationOptions = [
  { value: 'local_homestay', label: 'Local Homestay' },
  { value: 'budget_hotel', label: 'Budget Hotel' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'hostel', label: 'Hostel' },
]

const transportOptions = [
  { value: 'local_auto_rickshaw', label: 'Local Auto/Rickshaw' },
  { value: 'cab', label: 'Cab' },
  { value: 'public_transit', label: 'Public Transit' },
  { value: 'walking', label: 'Walking' },
]

const interestOptions = ['History', 'Food', 'Handlooms']

export default function AIPlannerForm() {
  const [destination, setDestination] = useState('')
  const [days, setDays] = useState('')
  const [budget, setBudget] = useState('moderate')
  const [accommodationPreference, setAccommodationPreference] = useState('local_homestay')
  const [transportMode, setTransportMode] = useState('local_auto_rickshaw')
  const [interests, setInterests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [itinerary, setItinerary] = useState(null)

  function toggleInterest(interest) {
    setInterests((currentInterests) =>
      currentInterests.includes(interest)
        ? currentInterests.filter((item) => item !== interest)
        : [...currentInterests, interest]
    )
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setItinerary(null)

    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination,
          days: Number(days),
          budget,
          accommodation: accommodationPreference,
          transport: transportMode,
          interests,
        }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data.detail || 'We could not generate your itinerary. Please try again.')
      }

      setItinerary(data)
    } catch (requestError) {
      setError(requestError.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-paper text-ink">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="text-vermillion text-sm font-medium mb-2">Plan your journey</p>
          <h2 className="font-display text-3xl text-night">Build an itinerary with AI</h2>
          <p className="text-ink/60 mt-2">
            Tell us what kind of trip you want, and we will shape the days around you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label htmlFor="planner-destination" className="block text-sm text-ink/70 mb-1.5">
                Destination
              </label>
              <input
                id="planner-destination"
                required
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                placeholder="e.g. Jaipur"
                className="w-full px-3 py-2.5 border border-ink/20 focus:border-night outline-none bg-white"
              />
            </div>
            <div>
              <label htmlFor="planner-days" className="block text-sm text-ink/70 mb-1.5">
                Number of Days
              </label>
              <input
                id="planner-days"
                type="number"
                min="1"
                max="30"
                required
                value={days}
                onChange={(event) => setDays(event.target.value)}
                placeholder="e.g. 5"
                className="w-full px-3 py-2.5 border border-ink/20 focus:border-night outline-none bg-white"
              />
            </div>

            <div>
              <label htmlFor="planner-budget" className="block text-sm text-ink/70 mb-1.5">
                Budget
              </label>
              <select
                id="planner-budget"
                value={budget}
                onChange={(event) => setBudget(event.target.value)}
                className="w-full px-3 py-2.5 border border-ink/20 focus:border-night outline-none bg-white"
              >
                {budgetOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="planner-accommodation" className="block text-sm text-ink/70 mb-1.5">
                Accommodation Preference
              </label>
              <select
                id="planner-accommodation"
                value={accommodationPreference}
                onChange={(event) => setAccommodationPreference(event.target.value)}
                className="w-full px-3 py-2.5 border border-ink/20 focus:border-night outline-none bg-white"
              >
                {accommodationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="planner-transport" className="block text-sm text-ink/70 mb-1.5">
                Preferred Mode of Transport
              </label>
              <select
                id="planner-transport"
                value={transportMode}
                onChange={(event) => setTransportMode(event.target.value)}
                className="w-full px-3 py-2.5 border border-ink/20 focus:border-night outline-none bg-white"
              >
                {transportOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <fieldset>
            <legend className="block text-sm text-ink/70 mb-2">Interests</legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {interestOptions.map((interest) => {
                const selected = interests.includes(interest)
                return (
                  <label
                    key={interest}
                    className={`flex items-center gap-2 border px-3 py-2.5 cursor-pointer transition-colors ${
                      selected
                        ? 'border-night bg-night text-paper'
                        : 'border-ink/20 bg-white hover:border-night'
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={interest}
                      checked={selected}
                      onChange={() => toggleInterest(interest)}
                      className="h-4 w-4 accent-marigold"
                    />
                    <span className="text-sm">{interest}</span>
                  </label>
                )
              })}
            </div>
          </fieldset>

          {error && (
            <p role="alert" className="text-vermillion text-sm border border-vermillion/30 bg-white px-3 py-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-vermillion text-paper font-semibold py-3 hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading && (
              <span
                aria-hidden="true"
                className="h-4 w-4 rounded-full border-2 border-paper/40 border-t-paper animate-spin"
              />
            )}
            {loading ? 'Generating itinerary...' : 'Generate AI Itinerary'}
          </button>
        </form>

        {itinerary && (
          <div className="mt-8 border-2 border-teal p-5" aria-live="polite">
            <h3 className="font-display text-2xl text-night">Your itinerary</h3>
            <pre className="mt-3 whitespace-pre-wrap break-words text-sm text-ink/80 font-body">
              {JSON.stringify(itinerary, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </section>
  )
}
