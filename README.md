# Per Diem Mobile

React Native app for browsing multi-location menus powered by the [per-diem-backend](../per-diem-backend) API (Square sandbox catalog proxy).

Architecture follows [AutomatedProdNewsFeed](https://github.com/alikargar1993/AutomatedProdNewsFeed): feature-based folders, Redux Toolkit, React Navigation (tabs + stack), axios API client, AsyncStorage persistence, and shared UI primitives.

## Features

| Feature | Backend endpoint | Status |
|---------|------------------|--------|
| Location switcher | `GET /api/locations` | Done |
| Menu by location | `GET /api/menu?locationId&at` | Done |
| Item detail + add to cart | `GET /api/items/:itemId` | Done |
| Search | `GET /api/search?locationId&q&at` | Done |
| Cart (local) | AsyncStorage | Done |
| Offline cache | NetInfo + cached menu/locations/categories | Done |
| Meal-period + day-of-week menu | `at` query param + availability banner | Done |
| Light / dark theme | System + persisted preference | Done |

## Tech stack

- **React Native 0.85.3** with TypeScript
- **React Navigation 7** — bottom tabs + native stack
- **Redux Toolkit** — locations, categories, menu, search, cart
- **axios** — HTTP client with auth headers and error mapping
- **AsyncStorage** — cart, selected location, and offline menu cache
- **NetInfo** — offline detection and reconnect refresh
- **react-native-dotenv** — `.env` for API URL and token (not committed)

## Requirements

- Node.js `>= 22.11.0`
- Yarn
- React Native dev environment ([setup guide](https://reactnative.dev/docs/set-up-your-environment))
- Running [per-diem-backend](../per-diem-backend) on port `3001`

## Installation

```sh
cd PerDiem
yarn install
cd ios && bundle install && bundle exec pod install && cd ..
```

## Configuration

1. Copy the environment template and set your backend token (must match `API_GENERAL_TOKEN` on the server):

   ```sh
   cp .env.example .env
   ```

   | Variable | Description |
   | -------- | ----------- |
   | `API_BASE_URL` | Backend URL (default `http://localhost:3001`) |
   | `API_GENERAL_TOKEN` | Bearer token for `/api` routes (min 16 chars) |

2. For a physical device, use your machine's LAN IP in `API_BASE_URL` instead of `localhost`.
3. Ensure `CORS_ORIGINS` on the backend includes your dev origin if needed.
4. **Restart Metro** after changing `.env` (Babel inlines values at build time).

Never commit `.env` — it is gitignored. Use `.env.example` as the template only.

## Run

```sh
yarn start
# separate terminal
yarn ios
# or
yarn android
```

## Tests

```sh
yarn test
CI=true yarn test --watchman=false   # CI / no Watchman
```

## Project structure

```
PerDiem/
├── src/
│   ├── app/                    # App shell, providers, navigation
│   ├── features/
│   │   ├── cart/               # Local cart + persistence
│   │   ├── categories/         # Category filter chips
│   │   ├── locations/          # Location list + selected location
│   │   ├── menu/               # Menu list, item detail, API client
│   │   └── search/             # Menu search
│   └── shared/
│       ├── api/                # axios client + error types
│       ├── components/ui/      # AppText, AppScreen, AppButton, …
│       ├── config/             # Reads API settings from @env
│       ├── storage/            # AsyncStorage helpers
│       ├── store/              # Redux store + typed hooks
│       ├── theme/              # Colors + ThemeContext
│       └── types/              # Backend DTO mirrors
├── assets/svg/                 # Tab icons
└── __tests__/
```

## Availability

The app sends the device clock as `at` (ISO 8601) on menu, search, and item requests. The backend filters variations by:

- **Meal period** — Square custom attribute `Availability` (breakfast / lunch / dinner windows in location timezone)
- **Day of week** — Square custom attribute `AvailableDays` (weekday / weekend selections)

The menu screen shows the active day and meal periods in a banner (e.g. `Monday · Lunch`).

## Related docs

- Backend setup and API: [per-diem-backend/README.md](../per-diem-backend/README.md)
- Take-home requirements: [perdiem-fullstack-coding-challenge.txt](../per-diem-backend/perdiem-fullstack-coding-challenge.txt)
