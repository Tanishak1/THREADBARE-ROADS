import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const redirectTo = location.state?.from?.pathname || '/'

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError('Enter your email and password.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-night px-6">
      <div className="w-full max-w-sm">
        <p className="text-marigold text-sm font-medium text-center mb-2">THREADBARE ROADS</p>
        <h1 className="font-display text-3xl text-paper text-center mb-8">
          Log in to book
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-paper/70 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-paper text-ink border border-paper/20 focus:border-marigold outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-paper/70 mb-1">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-paper text-ink border border-paper/20 focus:border-marigold outline-none"
              placeholder="••••••••"
            />
            <label className="mt-2 flex items-center gap-2 text-xs text-paper/60">
              <input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} />
              Show password
            </label>
          </div>

          {error && (
            <p className="text-vermillion text-sm bg-paper/95 px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-marigold text-night font-semibold py-2.5 hover:bg-marigold-dark transition-colors disabled:opacity-60"
          >
            {submitting ? 'Signing you in...' : 'Log in'}
          </button>
        </form>

        <p className="text-paper/50 text-xs text-center mt-6">
          Sign in to manage your stays, transport, and saved bookings.
        </p>

        <p className="text-center mt-4 text-paper/60 text-sm">
          New here?{' '}
          <Link to="/signup" state={location.state} className="text-marigold hover:underline">
            Create an account
          </Link>
        </p>
        <p className="text-center mt-4 text-paper/60 text-sm">
          Are you a local vendor?{' '}
          <Link to="/vendor" className="text-marigold hover:underline">
            Sign in for vendors
          </Link>
        </p>
        <p className="text-center mt-2">
          <Link to="/" className="text-paper/60 text-sm hover:text-marigold">
            ← Back to Explore without logging in
          </Link>
        </p>
      </div>
    </div>
  )
}
