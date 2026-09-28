# THREADBARE ROADS — SIH 26204 Tourism Platform

> **One platform to discover India, plan smarter trips, connect with local businesses, and keep travel services together.**

THREADBARE ROADS is a Smart India Hackathon prototype for **SIH Problem Statement 26204** in the tourism, hospitality and travel domain. It combines destination discovery, AI-assisted itinerary planning, accommodation, local transport, traveller accounts and a vendor ecosystem in one experience.

## Why this project

Travellers often switch between separate apps for destination research, itinerary planning, stays and local transport, while small local vendors struggle to become visible in the same digital journey. THREADBARE ROADS is designed as a unified layer between the traveller and the local tourism ecosystem.

## Current prototype

| Module | What works |
| --- | --- |
| Explore India | State/city discovery, history, attractions, food and local recommendations |
| AI Trip Planner | Destination, duration, budget, accommodation, transport and interest-based itinerary request |
| Stay | Hotel discovery/booking prototype behind traveller authentication |
| Move | Local transport discovery/booking prototype behind traveller authentication |
| Traveller Account | Sign up, login and protected routes |
| My Bookings | Unified traveller booking history |
| Vendor Portal | Vendor registration/login, JWT authentication and listing management |
| Map Experience | Google Maps integration for itinerary/location presentation |
| Backend | FastAPI APIs, PostgreSQL/pgvector-ready retrieval and structured AI itinerary generation |

## SIH value proposition

- **Unified tourism journey:** discovery → planning → stay → movement → bookings.
- **Local-first ecosystem:** vendors can register and publish rooms, food, products and experiences.
- **AI-assisted planning:** the backend supports retrieval-grounded, structured day-wise itineraries.
- **Scalable architecture:** React frontend and FastAPI backend are separated and can be deployed independently.
- **India-focused experience:** city stories, culture, food and local mobility are first-class parts of the trip.

## Architecture

```text
Traveller / Vendor
       |
       v
React + Vite + Tailwind
       |
       | REST / JSON
       v
FastAPI Backend
  |        |         |
  |        |         +--> JWT Auth + Vendor Listings
  |        +------------> Groq LLM (structured itinerary)
  +---------------------> PostgreSQL + pgvector / local tourism context

Optional integrations:
Google Maps API • Bhashini-compatible transcription endpoint
```

More detail: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## Tech stack

**Frontend:** React 18, Vite, React Router, Tailwind CSS, Google Maps React API  
**Backend:** Python, FastAPI, SQLAlchemy, Pydantic  
**AI/RAG:** LangChain, Groq, Hugging Face embeddings, pgvector  
**Security:** JWT bearer authentication, password hashing  
**Database:** PostgreSQL + pgvector for the complete retrieval setup.

## Routes

`/` Explore • `/city/:cityId` City details • `/plan` AI planner • `/stay` Stay • `/move` Transport • `/bookings` Bookings • `/login` & `/signup` Traveller auth • `/vendor` Vendor login • `/vendor/register` Vendor onboarding • `/vendor/dashboard` Vendor dashboard • `/about` Project story

## Quick start — frontend

Requirements: Node.js 18+.

```bash
git clone https://github.com/Tanishak1/THREADBARE-ROADS.git
cd THREADBARE-ROADS
npm install
npm run dev
```

Production check:

```bash
npm run build
npm run preview
```

Copy `.env.example` to `.env` and set `VITE_GOOGLE_MAPS_API_KEY` if maps are required.

## Quick start — backend

Requirements: Python 3.10+ and PostgreSQL with pgvector for the complete itinerary retrieval flow.

```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --port 8000
```

Create a root `.env` using `backend/.env.example`. Health check: `GET /health`. During development Vite proxies `/api` to `http://localhost:8000`.

## Environment

Never commit real secrets.

| Variable | Purpose |
| --- | --- |
| `VITE_GOOGLE_MAPS_API_KEY` | Frontend Google Maps |
| `DATABASE_URL` | Backend database connection |
| `GROQ_API_KEY` | AI itinerary generation |
| `JWT_SECRET_KEY` | Authentication token signing |
| `FRONTEND_ORIGIN` | Allowed frontend origin for CORS |
| `EMBEDDING_MODEL` | Retrieval embedding model |
| `BHASHINI_TRANSCRIBE_URL` / `BHASHINI_API_KEY` | Optional transcription integration |

## SIH judge demo

Use [SIH_DEMO.md](SIH_DEMO.md) for the rehearsed 3-minute flow. It deliberately separates the working prototype from integrations requiring external credentials/data, so the team can demonstrate confidently without overclaiming.

## API highlights

Vendor registration/login and authenticated listings, traveller authentication, itinerary generation, and `GET /health`. FastAPI interactive documentation is available at `/docs` while the backend is running.

## Deployment

The repository includes `vercel.json` for Vite SPA routing. Deploy the frontend on Vercel and FastAPI separately on a Python-capable service. Set `FRONTEND_ORIGIN` to the deployed frontend origin and configure the production API routing/base URL.

GitHub Actions runs a frontend production build on pushes and pull requests to catch broken builds before the demo.

## Before submission

- [ ] `npm run build` passes.
- [ ] Backend `/health` returns `{"status":"ok"}`.
- [ ] Required environment variables are configured.
- [ ] Traveller login → protected route flow is tested.
- [ ] AI planner is tested with configured backend/data.
- [ ] Vendor registration/login/listing flow is tested.
- [ ] One complete judge demo path is rehearsed.
- [ ] README, PPT, live URL and repository use **THREADBARE ROADS** consistently.

## Project status

**SIH prototype — active development.** Some content and booking flows are prototype/mock-backed by design. External services and production data sources can be swapped behind the existing interfaces.

---

Built for Smart India Hackathon • **THREADBARE ROADS**
