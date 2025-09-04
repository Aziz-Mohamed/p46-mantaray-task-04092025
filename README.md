# EventBook - React Native Event Booking App

A modern React Native application built with Expo for browsing and registering for events.

## Features

- 🔐 **User Authentication** - Sign up and login with secure token storage
- 📱 **Event Listings** - Browse events with search functionality
- 📄 **Event Details** - View detailed event information and register
- 👤 **User Dashboard** - Manage your registered events
- 🎨 **Modern UI** - Clean, responsive design with loading states
- ⚡ **Performance** - Optimized with TanStack Query for caching and background updates

## Tech Stack

- **React Native** with Expo
- **Expo Router** for file-based navigation
- **TanStack Query** for API state management
- **React Context** for authentication state
- **React Hook Form** with Zod validation
- **TypeScript** for type safety
- **Expo SecureStore** for secure token storage

## Project Structure

```
app/                    # Expo Router pages
├── (auth)/            # Authentication screens
├── (tabs)/            # Main app tabs
├── event/[id].tsx     # Dynamic event details
└── _layout.tsx        # Root layout

src/
├── components/        # Reusable UI components
├── hooks/            # Custom hooks for data fetching
├── services/         # API services
├── providers/        # Context providers
├── utils/            # Helper functions
├── constants/        # App constants & configuration
└── types/           # TypeScript interfaces
```

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure MockAPI:**
   - Create a project at [mockapi.io](https://mockapi.io)
   - Update the `API_BASE_URL` in `src/constants/index.ts`
   - Create the following endpoints:
     - `/auth/login` - POST
     - `/auth/signup` - POST
     - `/users` - GET, POST
     - `/events` - GET, GET/:id
     - `/registrations` - GET, POST, DELETE/:id

3. **Run the app:**
   ```bash
   npm start
   ```

4. **Run on device/simulator:**
   ```bash
   npm run ios     # iOS Simulator
   npm run android # Android Emulator
   npm run web     # Web browser
   ```

## API Endpoints

The app expects the following MockAPI structure:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration

### Events
- `GET /events` - List all events (with pagination)
- `GET /events/:id` - Get event details

### Registrations
- `GET /registrations?userId=:userId` - Get user registrations
- `POST /registrations` - Register for an event
- `DELETE /registrations/:id` - Cancel registration

## Key Features Implementation

### Authentication Flow
- Secure token storage with Expo SecureStore
- Automatic token refresh
- Protected routes with authentication checks

### Event Management
- Infinite scroll pagination
- Search functionality
- Real-time availability updates
- Registration status tracking

### State Management
- TanStack Query for server state
- React Context for authentication
- Optimistic updates for better UX

### Error Handling
- Global error boundaries
- User-friendly error messages
- Retry mechanisms for failed requests

## Development Notes

- All components are fully typed with TypeScript
- Form validation using Zod schemas
- Responsive design for various screen sizes
- Loading states and skeleton screens
- Pull-to-refresh functionality
- Deep linking support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
