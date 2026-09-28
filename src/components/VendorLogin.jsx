import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function VendorLogin() {
  const navigate = useNavigate()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('vendor_access_token')) {
      navigate('/vendor/dashboard', { replace: true })
    }
  }, [navigate])

  async function handleSubmit(event) {
    event.preventDefault()
    if (phoneNumber.replace(/\D/g, '').length < 7 || !password) {
      setError('Enter a valid phone number and password.')
      return
    }
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/vendor/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phoneNumber, password }),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.detail || 'Unable to sign in. Check your details and try again.')
      }
      if (!data.access_token) {
        throw new Error('The login service returned no access token.')
      }

      localStorage.setItem('vendor_access_token', data.access_token)
      if (data.vendor) localStorage.setItem('vendor_profile', JSON.stringify(data.vendor))
      navigate('/vendor/dashboard', { replace: true })
    } catch (requestError) {
      setError(requestError.message || 'Unable to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-[calc(100vh-8rem)] bg-night px-6 py-14 text-paper">
      <div className="mx-auto w-full max-w-md">
        <p className="mb-2 text-sm font-medium text-marigold">Vendor portal</p>
        <h1 className="font-display text-4xl">Welcome back</h1>
        <p className="mt-3 text-paper/70">
          Sign in to manage your local experiences, stays, and orders.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="vendor-phone" className="mb-1.5 block text-sm text-paper/75">
              Phone Number
            </label>
            <input
              id="vendor-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              placeholder="e.g. +91 98765 43210"
              className="w-full border border-paper/25 bg-paper px-3 py-3 text-ink outline-none focus:border-marigold"
            />
          </div>

          <div>
            <label htmlFor="vendor-password" className="mb-1.5 block text-sm text-paper/75">
              Password
            </label>
            <input
              id="vendor-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full border border-paper/25 bg-paper px-3 py-3 text-ink outline-none focus:border-marigold"
            />
            <label className="mt-2 flex items-center gap-2 text-xs text-paper/60">
              <input type="checkbox" checked={showPassword} onChange={(event) => setShowPassword(event.target.checked)} />
              Show password
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
            {loading ? 'Signing in...' : 'Sign in to Vendor Portal'}
          </button>
        </form>

        <p className="mt-6 text-sm text-paper/60">
          Need to register?{' '}
          <Link to="/vendor/register" className="text-marigold hover:underline">
            Create a vendor account
          </Link>
        </p>
      </div>
    </section>
  )
}