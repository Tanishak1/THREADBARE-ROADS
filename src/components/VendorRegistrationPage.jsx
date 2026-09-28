import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function VendorRegistrationPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    phone_number: '',
    password: '',
    business_name: '',
    business_type: 'hotel',
    city: '',
    confirm_password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (form.phone_number.replace(/\D/g, '').length < 7) {
      setError('Enter a valid phone number.')
      return
    }
    if (form.password.length < 8) {
      setError('Use at least 8 characters for your password.')
      return
    }
    if (form.password !== form.confirm_password) {
      setError('Your passwords do not match.')
      return
    }
    setLoading(true)
    setError('')
    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => controller.abort(), 8000)

    try {
      const response = await fetch('/api/vendor/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: form.phone_number,
          password: form.password,
          business_name: form.business_name,
          business_type: form.business_type,
          city: form.city,
        }),
        signal: controller.signal,
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed. Please try again.')
      }

      localStorage.setItem('vendor_access_token', data.access_token)
      if (data.vendor) localStorage.setItem('vendor_profile', JSON.stringify(data.vendor))
      navigate('/vendor/dashboard', { replace: true })
    } catch (requestError) {
      setError(
        requestError.name === 'AbortError'
          ? 'The account service is not responding. Start the backend and try again.'
          : requestError.message || 'Registration failed. Please try again.'
      )
    } finally {
      window.clearTimeout(timeoutId)
      setLoading(false)
    }
  }

  return (
    <section className="min-h-[calc(100vh-8rem)] bg-night px-6 py-14 text-paper">
      <div className="mx-auto w-full max-w-lg">
        <p className="mb-2 text-sm font-medium text-marigold">Vendor portal</p>
        <h1 className="font-display text-4xl">Create your vendor account</h1>
        <p className="mt-3 text-paper/70">
          Register your hotel, homestay, food business, or local experience.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="business-name" className="mb-1.5 block text-sm text-paper/75">
              Business Name
            </label>
            <input
              id="business-name"
              name="business_name"
              required
              value={form.business_name}
              onChange={updateField}
              placeholder="e.g. Sunrise Heritage Hotel"
              className="w-full border border-paper/25 bg-paper px-3 py-3 text-ink outline-none focus:border-marigold"
            />
          </div>

          <div>
            <label htmlFor="business-type" className="mb-1.5 block text-sm text-paper/75">
              Business Type
            </label>
            <select
              id="business-type"
              name="business_type"
              value={form.business_type}
              onChange={updateField}
              className="w-full border border-paper/25 bg-paper px-3 py-3 text-ink outline-none focus:border-marigold"
            >
              <option value="hotel">Hotel</option>
              <option value="homestay">Homestay</option>
              <option value="restaurant">Restaurant</option>
              <option value="local_artisan">Local Artisan</option>
              <option value="experience">Local Experience</option>
            </select>
          </div>

          <div>
            <label htmlFor="vendor-city" className="mb-1.5 block text-sm text-paper/75">
              Property City
            </label>
            <input
              id="vendor-city"
              name="city"
              required
              value={form.city}
              onChange={updateField}
              placeholder="e.g. Delhi"
              className="w-full border border-paper/25 bg-paper px-3 py-3 text-ink outline-none focus:border-marigold"
            />
            <p className="mt-1.5 text-xs text-paper/50">Tourists will find your rooms when they search this city.</p>
          </div>

          <div>
            <label htmlFor="registration-phone" className="mb-1.5 block text-sm text-paper/75">
              Phone Number
            </label>
            <input
              id="registration-phone"
              name="phone_number"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              value={form.phone_number}
              onChange={updateField}
              placeholder="e.g. +91 98765 43210"
              className="w-full border border-paper/25 bg-paper px-3 py-3 text-ink outline-none focus:border-marigold"
            />
          </div>

          <div>
            <label htmlFor="registration-password" className="mb-1.5 block text-sm text-paper/75">
              Password
            </label>
            <input
              id="registration-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              minLength="8"
              required
              value={form.password}
              onChange={updateField}
              placeholder="At least 8 characters"
              className="w-full border border-paper/25 bg-paper px-3 py-3 text-ink outline-none focus:border-marigold"
            />
          </div>

          <div>
            <label htmlFor="registration-confirm-password" className="mb-1.5 block text-sm text-paper/75">
              Confirm Password
            </label>
            <input
              id="registration-confirm-password"
              name="confirm_password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              minLength="8"
              required
              value={form.confirm_password}
              onChange={updateField}
              placeholder="Repeat your password"
              className="w-full border border-paper/25 bg-paper px-3 py-3 text-ink outline-none focus:border-marigold"
            />
            <label className="mt-2 flex items-center gap-2 text-xs text-paper/60">
              <input type="checkbox" checked={showPassword} onChange={(event) => setShowPassword(event.target.checked)} />
              Show passwords
            </label>
          </div>

          {error && (
            <p role="alert" className="border border-vermillion/50 bg-paper px-3 py-2.5 text-sm text-vermillion">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-marigold py-3 font-semibold text-night transition-colors hover:bg-marigold-dark disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create vendor account'}
          </button>
        </form>

        <p className="mt-6 text-sm text-paper/60">
          Already registered?{' '}
          <Link to="/vendor" className="text-marigold hover:underline">
            Sign in as a vendor
          </Link>
        </p>
      </div>
    </section>
  )
}
