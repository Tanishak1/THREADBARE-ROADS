# Bharat Atlas — SIH26204 Tourism Platform

A complete React prototype for the "Student Innovation" problem statement:
a solution to boost tourism, hotels, and travel. Built as a full set of
connected pages sharing one login and one booking history.

## Pages

- **Explore** (`/`, `/city/:cityId`) — states → cities → history, why it's
  famous, attractions, local food, and nearest restaurants with ratings.
  Includes a search box and state filter. Public, no login required.
- **Stay** (`/stay`) — hotel search & booking. Requires login.
- **Move** (`/move`) — local transport search & booking. Requires login.
- **My bookings** (`/bookings`) — everything booked through Stay and Move,
  saved per account. Requires login.
- **Login** (`/login`) / **Sign up** (`/signup`) — shared auth for Stay,
  Move and My bookings. After logging in, you're sent back to whichever
  page you came from.
- **About** (`/about`) — plain-language description of the project for
  judges/reviewers.
- **404** — any unmatched route shows a branded not-found page instead of
  a blank screen.

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Run the itinerary API

The FastAPI service lives in `backend/` and expects PostgreSQL with the
`vector` extension enabled. From the project root:

```bash
python -m venv .venv
.venv\\Scripts\\activate
pip install -r backend/requirements.txt
copy backend/.env.example .env
uvicorn backend.main:app --reload --port 8000
```

Set `DATABASE_URL` and `GROQ_API_KEY` in `.env`. The service creates the
`local_places` table on startup; populate it with monument and vendor records
whose `embedding` values are 384-dimensional vectors generated with the same
embedding model configured by `EMBEDDING_MODEL`. The React dev server proxies
`/api` requests to this service.

Vendor authentication uses `POST /api/vendor/register` and
`POST /api/vendor/login`. Set a long random `JWT_SECRET_KEY` in `.env`; never
commit the real secret. Both endpoints accept `phone_number`, and registration
also accepts `password`, `business_name`, and `business_type`. Successful
responses include a bearer `access_token` and vendor profile.

Authenticated vendors can create listings with `POST /api/vendor/listings` by
sending `Authorization: Bearer <access_token>`. The JSON body accepts `title`,
`listing_type` (`room`, `local_product`, `food`, or `experience`),
`description`, `price`, `location`, and optional `is_active`. The saved response
includes the authenticated `vendor_id`.

The itinerary endpoint accepts:

```json
{
  "destination": "Jaipur",
  "days": 3,
  "budget": "moderate",
  "accommodation": "budget_hotel",
  "transport": "local_auto_rickshaw",
  "interests": ["History", "Food"]
}
```

## Where to plug in your real systems

Everything is isolated behind a few functions so you can swap mock logic
for real API calls without touching the UI:

1. **City/state content** — `src/data/india.js`. The functions at the
   bottom (`getStates`, `getCitiesByState`, `getCity`, `getAllCities`) are
   what every page calls. Replace their bodies with `fetch()` calls to
   your backend, and add a real reviews source (e.g. Google Places API)
   for the restaurant ratings.

2. **Hotel app connection** — `src/pages/HotelBooking.jsx`, functions
   `searchHotels()` and `bookHotel()` at the top of the file. Point these
   at your hotel app's real endpoints.

3. **Travel/transport app connection** — `src/pages/Transport.jsx`,
   functions `searchTransport()` and `bookTransport()`. Same pattern.

4. **Auth** — `src/context/AuthContext.jsx`, the `login()` and `signup()`
   functions. Replace the fake user object with a real call to your auth
   service, and store the returned JWT instead of a plain object. Every
   page reads login state via `useAuth()`, so this is the only file to
   change.

5. **Bookings history** — `src/data/bookings.js` currently persists to
   the browser's `localStorage`, keyed by the logged-in user's email.
   Replace `addBooking()`/`getBookingsForUser()` with real API calls once
   your hotel and travel apps can write to a shared bookings table.

## Design notes

Colour and type choices are set in `tailwind.config.js` (deep indigo +
marigold + vermillion, Fraunces for display type, Work Sans for body/UI).
The rating badges are styled like passport stamps (`RatingStamp.jsx`) and
sections are separated with hairline "ledger" rules instead of card
shadows — a deliberate travel-journal look rather than a generic SaaS
template. Navigation collapses to a mobile menu below the `md` breakpoint.

## Suggested next steps for your SIH submission

- Swap mock data for a real database (MongoDB/Postgres) once your team
  decides on a schema — the shapes in `india.js` and `bookings.js` are a
  good starting schema.
- Add category filters on Explore (heritage, food, adventure, hill
  station).
- Add photos once you have a content/image pipeline — city cards and the
  city detail hero are laid out to take an image without restructuring.
- Consider server-side rendering or static generation for the Explore
  pages for better SEO, since tourists will search Google directly for
  "things to do in [city]".
