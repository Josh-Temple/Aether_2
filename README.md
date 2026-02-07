# Aether Weather PWA

Minimal, mobile-first weather PWA built with Next.js App Router and TypeScript. The UI emphasizes visual condition themes and minimal text.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Create a `.env.local` file with:

```
WEATHERAPI_KEY=your_key_here
```

WeatherAPI requests are made server-side via Next.js Route Handlers.

## Deploy to Vercel

1. Push the repository to GitHub.
2. Create a new Vercel project and import the repo.
3. Add the `WEATHERAPI_KEY` environment variable in Vercel project settings.
4. Deploy.

## Behavior notes

- **Location switching:** Tap the city name to open the location menu. Switching is only via the menu (no swipe switching).
- **Details drawer gesture:** Swipe left on the main screen to open the right-side details drawer. Swipe right on the drawer or tap outside to close.
- **Caching:** Weather data is cached per location for 10 minutes in localStorage. Fresh cache avoids refetching.
- **Offline fallback:** If a request fails, the app shows the last cached data and an `Offline` indicator. If no cache exists, it shows `No data`.
- **Saved locations:** Up to 3 saved locations are stored locally with manual up/down reordering.

## Project structure

- `app/api/weather/*` — server proxy for WeatherAPI search/current endpoints.
- `lib/normalize.ts` — condition normalization to 6 categories.
- `lib/storage.ts` — localStorage persistence for locations, settings, cache.
- `components/*` — UI components (drawer, menu, visuals).
