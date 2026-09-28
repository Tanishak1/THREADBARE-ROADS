# System Architecture

## Overview

THREADBARE ROADS uses a separated frontend/backend architecture so tourism content, booking providers and AI services can evolve independently.

```text
                         +----------------------+
                         | Traveller / Vendor   |
                         +----------+-----------+
                                    |
                                    v
+----------------------------------------------------------------+
| React + Vite Frontend                                          |
| Explore | City | AI Planner | Stay | Move | Bookings | Vendor |
+------------------------------+---------------------------------+
                               |
                               | REST / JSON
                               v
+----------------------------------------------------------------+
| FastAPI                                                        |
| Health | Customer Auth | Vendor Auth | Listings | Itinerary    |
+-----------+----------------------+-----------------------------+
            |                      |
            v                      v
+----------------------+   +-------------------------------------+
| PostgreSQL/pgvector  |   | AI pipeline                         |
| users, vendors,      |   | embeddings -> retrieved context -> |
| listings, local      |   | structured LLM itinerary           |
| tourism context      |   +-------------------------------------+
+----------------------+

Optional external UI/service integrations:
Google Maps • Bhashini-compatible transcription
```

## Frontend

React Router defines public and protected traveller routes. Shared authentication state is provided through `AuthContext`. The UI separates destination discovery from transactional flows while preserving a single navigation experience.

## Backend

FastAPI provides typed request/response contracts with Pydantic. SQLAlchemy handles persistence. JWT bearer tokens protect authenticated vendor/customer operations, and passwords are stored as hashes rather than plaintext.

## AI itinerary flow

1. The traveller submits destination, days, budget, accommodation, transport and interests.
2. The backend embeds the query.
3. Relevant local tourism records are retrieved from pgvector.
4. Retrieved context and user constraints are passed to the language model.
5. The model is constrained to a structured itinerary schema.
6. The frontend renders the returned plan and map-oriented experience.

This design reduces reliance on free-form model output and gives the application a clear point where curated/verified local data can be introduced.

## Data and integration boundaries

The prototype intentionally keeps external systems behind replaceable boundaries. Hotel/transport providers, reviews, maps and language services can be integrated without redesigning the whole frontend.

## Security baseline

- Secrets come from environment variables.
- JWT signing requires a configured secret.
- Authentication tokens use expiry times.
- Passwords are hashed.
- CORS is scoped through `FRONTEND_ORIGIN`.
- Production deployments should add rate limiting, audit logging, HTTPS-only cookies/token strategy as appropriate, database migrations and secret rotation.
