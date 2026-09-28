import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const sampleRooms = [
  {
    id: 'sample-deluxe',
    title: 'Deluxe Garden Room',
    description: 'A quiet king room opening onto the courtyard, with breakfast for two.',
    price: 4200,
    weekend_price: 4800,
    tax_percent: 12,
    room_count: 8,
    available_count: 5,
    max_guests: 2,
    size_sqm: 28,
    amenities: ['King bed', 'Breakfast', 'Garden view', 'Wi-Fi'],
    image_url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=900&q=80',
    location: 'Jaipur',
    is_active: true,
  },
  {
    id: 'sample-heritage',
    title: 'Heritage Suite',
    description: 'A spacious suite with restored details, a sitting room, and a private balcony.',
    price: 7600,
    weekend_price: 8400,
    tax_percent: 12,
    room_count: 3,
    available_count: 1,
    max_guests: 3,
    size_sqm: 46,
    amenities: ['King bed', 'Balcony', 'Breakfast', 'Bathtub'],
    image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
    location: 'Jaipur',
    is_active: true,
  },
  {
    id: 'sample-family',
    title: 'Family Courtyard Room',
    description: 'Flexible twin beds and a sofa bed for families travelling together.',
    price: 5900,
    weekend_price: 6500,
    tax_percent: 12,
    room_count: 5,
    available_count: 4,
    max_guests: 4,
    size_sqm: 38,
    amenities: ['Twin beds', 'Sofa bed', 'Breakfast', 'Wi-Fi'],
    image_url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80',
    location: 'Jaipur',
    is_active: true,
  },
]

const emptyForm = {
  title: '',
  description: '',
  price: '',
  weekend_price: '',
  tax_percent: '12',
  room_count: '1',
  available_count: '1',
  max_guests: '2',
  size_sqm: '',
  amenities: '',
  image_url: '',
  location: '',
}

export default function VendorDashboard() {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState(sampleRooms)
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const profile = (() => {
    try {
      return JSON.parse(localStorage.getItem('vendor_profile') || 'null')
    } catch {
      return null
    }
  })()

  useEffect(() => {
    if (!localStorage.getItem('vendor_access_token')) {
      navigate('/vendor', { replace: true })
      return
    }
    loadRooms()
  }, [navigate])

  async function loadRooms() {
    const token = localStorage.getItem('vendor_access_token')
    try {
      const response = await fetch('/api/vendor/listings', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.status === 401) {
        localStorage.removeItem('vendor_access_token')
        localStorage.removeItem('vendor_profile')
        navigate('/vendor', { replace: true })
        return
      }
      if (!response.ok) throw new Error('Room inventory could not be loaded.')
      const data = await response.json()
      if (data.length) setRooms(data)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function saveRoom(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')
    const payload = {
      title: form.title,
      listing_type: 'room',
      description: form.description,
      price: Number(form.price),
      weekend_price: Number(form.weekend_price || form.price),
      tax_percent: Number(form.tax_percent),
      room_count: Number(form.room_count),
      available_count: Number(form.available_count),
      max_guests: Number(form.max_guests),
      size_sqm: Number(form.size_sqm || 0),
      amenities: form.amenities.split(',').map((amenity) => amenity.trim()).filter(Boolean),
      image_url: form.image_url || null,
      location: form.location || profile?.city || '',
      is_active: true,
    }

    try {
      const response = await fetch('/api/vendor/listings', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('vendor_access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.detail || 'Room type could not be saved.')
      setRooms((current) => [data, ...current.filter((room) => !String(room.id).startsWith('sample-'))])
      setForm(emptyForm)
      setShowForm(false)
      setMessage(`${data.title} is now in your room inventory.`)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  async function updateAvailability(room, nextCount) {
    if (nextCount < 0 || nextCount > room.room_count) return
    if (String(room.id).startsWith('sample-')) {
      setRooms((current) => current.map((item) => item.id === room.id ? { ...item, available_count: nextCount } : item))
      return
    }
    setError('')
    try {
      const response = await fetch(`/api/vendor/listings/${room.id}/availability`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('vendor_access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ available_count: nextCount }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.detail || 'Availability could not be updated.')
      setRooms((current) => current.map((item) => item.id === room.id ? data : item))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function deleteRoom(room) {
    if (!window.confirm(`Delete ${room.title} from your room inventory?`)) return
    if (String(room.id).startsWith('sample-')) {
      setRooms((current) => current.filter((item) => item.id !== room.id))
      return
    }
    setError('')
    try {
      const response = await fetch(`/api/vendor/listings/${room.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('vendor_access_token')}` },
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.detail || 'Room type could not be deleted.')
      setRooms((current) => current.filter((item) => item.id !== room.id))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  function logout() {
    localStorage.removeItem('vendor_access_token')
    localStorage.removeItem('vendor_profile')
    navigate('/vendor', { replace: true })
  }

  const totalRooms = rooms.reduce((sum, room) => sum + room.room_count, 0)\n  const availableRooms = rooms.reduce((sum, room) => sum + room.available_count, 0)\n  const occupiedRooms = Math.max(totalRooms - availableRooms, 0)\n  const occupancy = totalRooms ? Math.round((occupiedRooms / totalRooms) * 100) : 0
  const averageRate = rooms.length
    ? Math.round(rooms.reduce((sum, room) => sum + room.price, 0) / rooms.length)
    : 0

  return (
    <section className="min-h-[calc(100vh-8rem)] bg-paper px-5 py-8 text-ink sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col justify-between gap-5 border-b-2 border-night pb-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-vermillion">THREADBARE Local / Vendor Console</p>
            <h1 className="mt-1 font-display text-4xl text-night sm:text-5xl">{profile?.business_name || 'Your hotel'}</h1>
            <p className="mt-2 text-ink/60">{profile?.city || 'Set your property city'} · Rooms, rates, and availability for your guests.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="border border-teal px-3 py-2 text-xs font-semibold uppercase tracking-wider text-teal">Open for bookings</span>
            <button type="button" onClick={logout} className="border border-night px-4 py-2 text-sm font-semibold text-night hover:bg-night hover:text-paper">Log out</button>
          </div>
        </header>

        <div className="mt-7 grid gap-px bg-night/15 sm:grid-cols-2 xl:grid-cols-4">
          <div className="bg-white p-5"><p className="text-xs uppercase tracking-wider text-ink/55">Room types</p><p className="mt-2 font-display text-4xl text-night">{rooms.length}</p><p className="mt-1 text-sm text-ink/55">Across your property</p></div>
          <div className="bg-white p-5"><p className="text-xs uppercase tracking-wider text-ink/55">Total inventory</p><p className="mt-2 font-display text-4xl text-night">{totalRooms}</p><p className="mt-1 text-sm text-ink/55">Rooms to sell</p></div>
          <div className="bg-white p-5"><p className="text-xs uppercase tracking-wider text-ink/55">Average nightly rate</p><p className="mt-2 font-display text-4xl text-night">Rs {averageRate.toLocaleString('en-IN')}</p><p className="mt-1 text-sm text-ink/55">Before taxes</p></div>
          <div className="bg-night p-5 text-paper"><p className="text-xs uppercase tracking-wider text-paper/60">Current occupancy</p><p className="mt-2 font-display text-4xl text-marigold">{occupancy}%</p><p className="mt-1 text-sm text-paper/60">{occupiedRooms} of {totalRooms} rooms occupied</p></div>
        </div>

        {(message || error) && <p role={error ? 'alert' : 'status'} className={`mt-5 border px-4 py-3 text-sm ${error ? 'border-vermillion/40 bg-vermillion/5 text-vermillion' : 'border-teal/40 bg-teal/5 text-teal'}`}>{error || message}</p>}

        <div className="mt-10 flex flex-col justify-between gap-4 border-b border-night/20 pb-4 sm:flex-row sm:items-end">
          <div><p className="text-sm font-medium text-vermillion">Sellable inventory</p><h2 className="mt-1 font-display text-3xl text-night">Room types & rates</h2></div>
          <button type="button" onClick={() => { setShowForm((current) => !current); setError('') }} className="bg-marigold px-5 py-3 text-sm font-semibold text-night hover:bg-marigold-dark">{showForm ? 'Close room editor' : '+ Add room type'}</button>
        </div>

        {showForm && <form onSubmit={saveRoom} className="mt-6 border-2 border-night bg-white p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wider text-teal">New inventory</p><h3 className="mt-1 font-display text-2xl text-night">Add a room type</h3></div><span className="text-xs text-ink/50">All rates in INR / night</span></div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="text-sm font-medium">Room name<input name="title" required value={form.title} onChange={updateField} placeholder="e.g. Poolside King Room" className="mt-1.5 w-full border border-ink/20 bg-paper px-3 py-3 outline-none focus:border-marigold" /></label>
            <label className="text-sm font-medium">Photo URL<input name="image_url" type="url" value={form.image_url} onChange={updateField} placeholder="https://..." className="mt-1.5 w-full border border-ink/20 bg-paper px-3 py-3 outline-none focus:border-marigold" /></label>
            <label className="text-sm font-medium md:col-span-2">Guest-facing description<textarea name="description" required minLength="5" value={form.description} onChange={updateField} placeholder="What makes this room worth booking?" rows="2" className="mt-1.5 w-full resize-y border border-ink/20 bg-paper px-3 py-3 outline-none focus:border-marigold" /></label>
            <label className="text-sm font-medium">Weekday rate<input name="price" required type="number" min="1" value={form.price} onChange={updateField} placeholder="4200" className="mt-1.5 w-full border border-ink/20 bg-paper px-3 py-3 outline-none focus:border-marigold" /></label>
            <label className="text-sm font-medium">Weekend rate<input name="weekend_price" required type="number" min="1" value={form.weekend_price} onChange={updateField} placeholder="4800" className="mt-1.5 w-full border border-ink/20 bg-paper px-3 py-3 outline-none focus:border-marigold" /></label>
            <label className="text-sm font-medium">Rooms of this type<input name="room_count" required type="number" min="1" value={form.room_count} onChange={updateField} className="mt-1.5 w-full border border-ink/20 bg-paper px-3 py-3 outline-none focus:border-marigold" /></label>
            <label className="text-sm font-medium">Available now<input name="available_count" required type="number" min="0" max={form.room_count || undefined} value={form.available_count} onChange={updateField} className="mt-1.5 w-full border border-ink/20 bg-paper px-3 py-3 outline-none focus:border-marigold" /></label>
            <label className="text-sm font-medium">Max guests<input name="max_guests" required type="number" min="1" value={form.max_guests} onChange={updateField} className="mt-1.5 w-full border border-ink/20 bg-paper px-3 py-3 outline-none focus:border-marigold" /></label>
            <label className="text-sm font-medium">Property city<input name="location" required value={form.location || profile?.city || ''} onChange={updateField} placeholder="e.g. Delhi" className="mt-1.5 w-full border border-ink/20 bg-paper px-3 py-3 outline-none focus:border-marigold" /></label>
            <label className="text-sm font-medium">Room size (sq m)<input name="size_sqm" type="number" min="0" value={form.size_sqm} onChange={updateField} placeholder="32" className="mt-1.5 w-full border border-ink/20 bg-paper px-3 py-3 outline-none focus:border-marigold" /></label>
            <label className="text-sm font-medium">Tax rate (%)<input name="tax_percent" type="number" min="0" max="100" value={form.tax_percent} onChange={updateField} className="mt-1.5 w-full border border-ink/20 bg-paper px-3 py-3 outline-none focus:border-marigold" /></label>
            <label className="text-sm font-medium md:col-span-2">Amenities <span className="font-normal text-ink/50">comma separated</span><input name="amenities" value={form.amenities} onChange={updateField} placeholder="Breakfast, Balcony, Wi-Fi, Bathtub" className="mt-1.5 w-full border border-ink/20 bg-paper px-3 py-3 outline-none focus:border-marigold" /></label>
          </div>
          <button type="submit" disabled={saving} className="mt-6 w-full bg-night py-3 font-semibold text-paper hover:bg-night-light disabled:opacity-60">{saving ? 'Saving room type...' : 'Save room type'}</button>
        </form>}

        <div className="mt-6 space-y-4">
          {loading ? <p className="border border-ink/15 bg-white p-8 text-center text-ink/60">Loading your inventory...</p> : rooms.map((room) => <article key={room.id} className="grid overflow-hidden border border-ink/15 bg-white lg:grid-cols-[230px_1fr_auto]">
            <img src={room.image_url} alt="" className="h-48 w-full object-cover lg:h-full" />
            <div className="p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wider text-vermillion">{room.room_count} rooms / {room.is_active ? 'Live' : 'Paused'}</p><h3 className="mt-1 font-display text-2xl text-night">{room.title}</h3></div><span className="border border-teal/30 bg-teal/5 px-2.5 py-1 text-xs font-semibold text-teal">{room.max_guests} guests max</span></div><p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/65">{room.description}</p><div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-ink/60">{room.size_sqm > 0 && <span>{room.size_sqm} sq m</span>}{room.amenities.map((amenity) => <span key={amenity}>{amenity}</span>)}</div></div>
            <div className="flex min-w-48 flex-col justify-between border-t border-ink/10 bg-paper/60 p-5 lg:border-l lg:border-t-0"><div><p className="text-xs uppercase tracking-wider text-ink/50">From / night</p><p className="mt-1 font-display text-3xl text-night">Rs {Number(room.price).toLocaleString('en-IN')}</p><p className="mt-1 text-xs text-ink/55">Rs {Number(room.weekend_price).toLocaleString('en-IN')} weekends + {room.tax_percent}% tax</p></div><div className="mt-5"><p className="text-xs font-semibold uppercase tracking-wider text-teal">Available now</p><div className="mt-2 flex items-center gap-2"><button type="button" aria-label={`Decrease ${room.title} availability`} disabled={room.available_count === 0} onClick={() => updateAvailability(room, room.available_count - 1)} className="h-8 w-8 border border-night text-lg text-night hover:bg-night hover:text-paper disabled:cursor-not-allowed disabled:opacity-30">-</button><span className="min-w-10 text-center font-semibold text-night">{room.available_count}/{room.room_count}</span><button type="button" aria-label={`Increase ${room.title} availability`} disabled={room.available_count >= room.room_count} onClick={() => updateAvailability(room, room.available_count + 1)} className="h-8 w-8 border border-night text-lg text-night hover:bg-night hover:text-paper disabled:cursor-not-allowed disabled:opacity-30">+</button><span className="ml-1 text-xs text-ink/50">sellable</span></div></div><button type="button" onClick={() => deleteRoom(room)} className="mt-5 border border-vermillion/50 px-3 py-2 text-xs font-semibold text-vermillion hover:bg-vermillion hover:text-paper">Delete room type</button></div>
          </article>)}
        </div>
        <p className="mt-8 border-t border-night/15 pt-4 text-xs text-ink/50">Room rates are displayed before taxes. Keep photos bright and guest-facing, and review availability before publishing a new room type.</p>
      </div>
    </section>
  )
}