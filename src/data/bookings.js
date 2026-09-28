// Local persistence for bookings made in this browser, keyed by user email.
// Stands in for a real backend table joining users to hotel/transport
// booking references. Replace with a real API (e.g. GET/POST /api/bookings)
// once your hotel and travel apps can write back to a shared database —
// the shape of each entry below is a reasonable starting schema for that.

const KEY = 'bharat_atlas_bookings'

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

function writeAll(bookings) {
  localStorage.setItem(KEY, JSON.stringify(bookings))
}

export function addBooking(entry) {
  const bookings = readAll()
  bookings.unshift({ ...entry, savedAt: new Date().toISOString() })
  writeAll(bookings)
}

export function getBookingsForUser(email) {
  return readAll().filter((b) => b.userEmail === email)
}
