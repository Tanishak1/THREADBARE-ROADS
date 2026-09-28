# SIH Judge Demo — THREADBARE ROADS

This script is intentionally short and evidence-based. Demonstrate what is running; describe external integrations as integrations, not as completed production partnerships.

## 0:00–0:30 — Problem and solution

“Tour planning is fragmented across discovery, itinerary, stay and local transport, while small local vendors are often missing from the traveller's digital journey. THREADBARE ROADS brings these flows into one India-focused platform.”

Show the Explore landing page and navigation.

## 0:30–1:10 — Discover

Open a city. Show its story, attractions, food and local context. Explain that the experience is designed to move from inspiration to action without switching products.

## 1:10–1:50 — AI planner

Open **Plan**. Enter a destination, trip length, budget, accommodation preference, transport preference and interests.

Explain the technical differentiator: the FastAPI backend can retrieve local context using embeddings/pgvector and asks the language model for a structured day-wise itinerary. If external AI/database credentials are unavailable during judging, state that clearly and use a prepared local demo rather than claiming a live call.

## 1:50–2:20 — Stay + Move + bookings

Log in as a traveller. Open Stay and Move, then My Bookings. Emphasize the shared account and unified trip history.

## 2:20–2:45 — Local vendor inclusion

Open the Vendor flow. Show registration/login and the dashboard/listing experience. Explain that local rooms, products, food and experiences can enter the same tourism journey.

## 2:45–3:00 — Architecture and close

“React/Vite powers the traveller and vendor experience. FastAPI provides APIs and authentication. PostgreSQL/pgvector supports retrieval, and the AI layer produces structured itineraries. The architecture keeps external providers replaceable as the platform scales.”

Close with the core idea: **one journey for the traveller, one digital entry point for the local tourism ecosystem.**

## Demo safety checklist

1. Run `npm run build` before leaving for the venue.
2. Keep a local frontend build available.
3. Test `GET /health` on the backend.
4. Verify API keys are loaded from environment variables, never hard-coded.
5. Have one known-good destination ready for the AI planner.
6. Keep screenshots/video of the complete flow as a fallback for unreliable venue internet.
7. Do not describe mock booking data as a confirmed real-world booking partnership.
