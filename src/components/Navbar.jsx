import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/', label: 'Explore', end: true },
  { to: '/stay', label: 'Stay' },
  { to: '/move', label: 'Move' },
  { to: '/plan', label: 'Plan' },
  { to: '/talk', label: 'Talk' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-night text-paper">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <NavLink to="/" className="font-display text-xl tracking-tight" onClick={() => setOpen(false)}>
          THREADBARE ROADS
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-marigold' : 'text-paper/70 hover:text-paper'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {user && (
            <NavLink
              to="/bookings"
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-marigold' : 'text-paper/70 hover:text-paper'
                }`
              }
            >
              My bookings
            </NavLink>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-paper/70">{user.name}</span>
              <button
                onClick={logout}
                className="text-sm px-3 py-1.5 border border-paper/30 hover:border-marigold hover:text-marigold transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className="text-sm px-4 py-1.5 bg-marigold text-night font-semibold hover:bg-marigold-dark transition-colors"
            >
              Log in
            </NavLink>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 -mr-2"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="block w-6 h-0.5 bg-paper mb-1.5" />
          <span className="block w-6 h-0.5 bg-paper mb-1.5" />
          <span className="block w-6 h-0.5 bg-paper" />
        </button>
      </div>

      {/* Mobile nav panel */}
      {open && (
        <div className="md:hidden border-t border-paper/10 px-6 py-4 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-2 py-2 text-sm font-medium ${
                  isActive ? 'text-marigold' : 'text-paper/80'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {user && (
            <NavLink to="/bookings" onClick={() => setOpen(false)} className="block px-2 py-2 text-sm font-medium text-paper/80">
              My bookings
            </NavLink>
          )}
          <div className="pt-3 border-t border-paper/10 mt-3">
            {user ? (
              <button
                onClick={() => { logout(); setOpen(false) }}
                className="text-sm px-3 py-1.5 border border-paper/30 hover:border-marigold hover:text-marigold transition-colors"
              >
                Log out ({user.name})
              </button>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setOpen(false)}
                className="inline-block text-sm px-4 py-1.5 bg-marigold text-night font-semibold"
              >
                Log in
              </NavLink>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
