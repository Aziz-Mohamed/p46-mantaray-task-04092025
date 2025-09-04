# EventBook — React Native (Expo) Event Booking App

A modern React Native application built with Expo for browsing and registering for events.

### Features

- 🔐 **User Authentication**: Sign up and login with secure token storage
- 📱 **Event Listings**: Browse events with search functionality
- 📄 **Event Details**: View detailed event information and register
- 👤 **User Dashboard**: Manage your registered events
- 🎨 **Modern UI**: Clean, responsive design with loading states
- ⚡ **Performance**: Optimized with TanStack Query for caching and background updates

### Tech Stack

- **React Native** with Expo
- **Expo Router** for file-based navigation
- **TanStack Query** for API state management
- **Context API** for authentication state
- **React Hook Form** with Zod validation
- **TypeScript** for type safety
- **Expo SecureStore** for secure token storage

---

## Prerequisites

- Node.js 18+ and npm
- Xcode (for iOS) or Android Studio (for Android)
- Expo CLI (optional, `npx expo` is used by scripts)

Verify versions:

```bash
node -v
npm -v
```

## Quick Start

```bash
# 1) Install dependencies
npm install

# 2) Configure API base URL (MockAPI or your backend)
#    Edit src/constants/index.ts and set API_BASE_URL

# 3) Start the Expo dev server
npm start

# 4) Launch a target
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Web browser
```

## Configuration

- API base URL is defined in `src/constants/index.ts` as `API_BASE_URL`.
- For MockAPI setup details and sample schemas, see `MOCKAPI_SETUP.md`.

If you use MockAPI, create these resources (or equivalent in your backend):

- `/auth/login` (POST)
- `/auth/signup` (POST)
- `/users` (GET, POST)
- `/events` (GET, GET/:id)
- `/registrations` (GET, POST, DELETE/:id)

## Scripts

```bash
npm start    # Expo dev server
npm run ios  # Open iOS Simulator and run
npm run android # Open Android Emulator and run
npm run web  # Run in the browser
```

## Project Structure

```
app/                    # Expo Router pages
├── (auth)/             # Authentication screens
├── (tabs)/             # Main app tabs
├── event/[id].tsx      # Dynamic event details
└── _layout.tsx         # Root layout

src/
├── components/         # Reusable UI components
├── hooks/              # Custom hooks for data fetching
├── services/           # API services
├── providers/          # Context providers
├── utils/              # Helper functions
├── constants/          # App constants & configuration
└── types/              # TypeScript interfaces
```

## API Overview

The app expects these endpoints (adjust to your backend as needed):

### Authentication
- `POST /auth/login` — user login
- `POST /auth/signup` — user registration

### Events
- `GET /events` — list events (supports pagination)
- `GET /events/:id` — event details

### Registrations
- `GET /registrations?userId=:userId` — user registrations
- `POST /registrations` — register for an event
- `DELETE /registrations/:id` — cancel registration

## Implementation Notes

### Authentication
- Secure token storage with Expo SecureStore
- Protected routes with auth checks

### Data & State
- TanStack Query for server state and caching
- Optimistic updates where appropriate

### Error Handling
- Centralized API client with retry and timeouts
- User-friendly error messages

## Troubleshooting

- iOS simulator not launching: Open Xcode once, ensure a simulator is installed.
- Android emulator not found: Open Android Studio and start an AVD before `npm run android`.
- Network errors: Confirm `API_BASE_URL` is reachable and CORS rules allow your platform.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License — see LICENSE for details
