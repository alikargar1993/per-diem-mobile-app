# Per Diem Mobile

React Native app for browsing multi-location menus powered by the [per-diem-backend](../per-diem-backend) API (Square sandbox catalog proxy).

Boilerplate follows the same architecture as [AutomatedProdNewsFeed](https://github.com/alikargar1993/AutomatedProdNewsFeed): feature-based folders, Redux Toolkit, React Navigation (tabs + stack), axios API client, AsyncStorage persistence, and shared UI primitives.

## Features (planned)

| Feature | Backend endpoint | Status |
|---------|------------------|--------|
| Location switcher | `GET /api/locations` | Boilerplate ready |
| Menu by location | `GET /api/menu?locationId&at` | Boilerplate ready |
| Item detail | `GET /api/items/:itemId` | Boilerplate ready |
| Search | `GET /api/search?locationId&q&at` | Boilerplate ready |
| Favorites | Local (AsyncStorage) | Boilerplate ready |
| Offline banner | NetInfo | Implemented |
| Light / dark theme | System + persisted preference | Implemented |

## Tech stack

- **React Native 0.85.3** with TypeScript
- **React Navigation 7** — bottom tabs + native stack
- **Redux Toolkit** — locations, menu, search, favorites state
- **axios** — HTTP client with auth headers and error mapping
- **AsyncStorage** — favorites and selected location persistence
- **NetInfo** — offline detection banner
- **react-native-svg** — tab icons

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

1. Copy `.env.example` values into `src/shared/config/env.ts`:

```ts
export const API_BASE_URL = 'http://localhost:3001';
export const API_GENERAL_TOKEN = 'your_api_general_token';
```

2. For a physical device, use your machine's LAN IP instead of `localhost`.
3. Ensure `CORS_ORIGINS` on the backend includes your dev origin if needed.

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
│   │   ├── locations/          # Location list + selected location
│   │   ├── menu/               # Menu list, item detail, API client
│   │   ├── search/             # Menu search
│   │   └── favorites/          # Saved items
│   └── shared/
│       ├── api/                # axios client + error types
│       ├── components/ui/      # AppText, AppScreen, AppButton, …
│       ├── config/             # API base URL + token
│       ├── storage/            # AsyncStorage helpers
│       ├── store/              # Redux store + typed hooks
│       ├── theme/              # Colors + ThemeContext
│       └── types/              # Backend DTO mirrors
├── assets/svg/                 # Tab icons
└── __tests__/
```

## Next steps

1. Wire Redux thunks to `menuApi` (`loadMenu`, `loadItem`, `searchMenu`)
2. Build menu list UI with categories, images, and prices
3. Add location picker and pull-to-refresh
4. Implement search input with debounce
5. Connect favorites to menu items
