# Travel Basket

Travel Basket is a full-stack travel-package showcase and administration experience. It currently uses a seeded in-memory store so the package data can later be replaced with a database implementation without changing the API contract.

## Project structure

- `frontend/` — React + Vite traveller and admin interfaces.
- `backend/` — Node.js + Express REST API, routes, seed data, and in-memory package store.

## Features

- Search and filter packages by destination, travel style, and discounted budget.
- Save/unsave package shortlists in the browser using `localStorage`.
- Package detail overlay with itinerary highlights, group size, availability, price, and discount.
- Admin portal (`#admin`) for creating and editing journeys, categories, availability, discounts, and featured status.
- Seeded, in-memory backend API with a health endpoint for easy future database integration.

## Run locally

```bash
npm install
npm --prefix frontend install
npm --prefix backend install
npm run dev
```

The frontend runs at the Vite URL (normally `http://localhost:5173`) and the API at `http://localhost:3001`.

To run separately:

```bash
npm run frontend
npm run server
```

## Routes

- Traveller homepage: `/#discover`
- Saved basket: `/#saved`
- Admin portal: `/#admin`

## API

- `GET /api/health`
- `GET /api/packages`
- `GET /api/packages/:id`
- `POST /api/admin/packages`
- `PUT /api/admin/packages/:id`
