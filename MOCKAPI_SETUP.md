# MockAPI Setup Guide

This guide will help you set up MockAPI endpoints for the EventBook app.

## 1. Create MockAPI Project

1. Go to [mockapi.io](https://mockapi.io)
2. Sign up or log in
3. Create a new project
4. Copy your project URL (e.g., `https://YOUR_PROJECT_ID.mockapi.io/api/v1`)

## 2. Update API Configuration

Update the `API_BASE_URL` in `src/constants/index.ts`:

```typescript
export const API_BASE_URL = 'https://YOUR_PROJECT_ID.mockapi.io/api/v1';
```

## 3. Create Required Endpoints

### Authentication Endpoints

#### POST /auth/login
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "user": {
    "id": "1",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://via.placeholder.com/150",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /auth/signup
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "Jane Doe"
}
```

Response: Same as login

### User Endpoints

#### GET /users
Returns list of users

#### GET /users/profile
Returns current user profile (requires Authorization header)

### Event Endpoints

#### GET /events
Query parameters:
- `page` (number): Page number
- `limit` (number): Items per page
- `search` (string): Search query

Response:
```json
{
  "data": [
    {
      "id": "1",
      "title": "React Native Workshop",
      "description": "Learn React Native from scratch with hands-on projects.",
      "date": "2024-02-15",
      "time": "10:00",
      "location": "Tech Hub, San Francisco",
      "price": 99,
      "image": "https://via.placeholder.com/400x200",
      "capacity": 50,
      "availableSpots": 25,
      "speakers": [
        {
          "id": "1",
          "name": "John Smith",
          "title": "Senior React Native Developer",
          "bio": "John has 5+ years of experience in mobile development.",
          "avatar": "https://via.placeholder.com/100"
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

#### GET /events/:id
Returns single event details

### Registration Endpoints

#### GET /registrations?userId=:userId
Returns user's registrations

#### POST /registrations
```json
{
  "eventId": "1"
}
```

Response:
```json
{
  "id": "1",
  "userId": "1",
  "eventId": "1",
  "registeredAt": "2024-01-15T10:00:00.000Z",
  "status": "confirmed"
}
```

#### DELETE /registrations/:id
Cancels a registration

## 4. Sample Data

### Sample Events
```json
[
  {
    "id": "1",
    "title": "React Native Workshop",
    "description": "Learn React Native from scratch with hands-on projects. Perfect for beginners and intermediate developers.",
    "date": "2024-02-15",
    "time": "10:00",
    "location": "Tech Hub, San Francisco",
    "price": 99,
    "image": "https://via.placeholder.com/400x200/007AFF/FFFFFF?text=React+Native",
    "capacity": 50,
    "availableSpots": 25,
    "speakers": [
      {
        "id": "1",
        "name": "John Smith",
        "title": "Senior React Native Developer",
        "bio": "John has 5+ years of experience in mobile development and has worked on apps with millions of users.",
        "avatar": "https://via.placeholder.com/100"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "2",
    "title": "JavaScript Fundamentals",
    "description": "Master the fundamentals of JavaScript programming language.",
    "date": "2024-02-20",
    "time": "14:00",
    "location": "Online Event",
    "price": 0,
    "image": "https://via.placeholder.com/400x200/34C759/FFFFFF?text=JavaScript",
    "capacity": 100,
    "availableSpots": 75,
    "speakers": [
      {
        "id": "2",
        "name": "Sarah Johnson",
        "title": "JavaScript Expert",
        "bio": "Sarah is a JavaScript expert with 8+ years of experience.",
        "avatar": "https://via.placeholder.com/100"
      }
    ],
    "createdAt": "2024-01-02T00:00:00.000Z"
  },
  {
    "id": "3",
    "title": "UI/UX Design Masterclass",
    "description": "Learn modern UI/UX design principles and tools.",
    "date": "2024-02-25",
    "time": "09:00",
    "location": "Design Studio, New York",
    "price": 149,
    "image": "https://via.placeholder.com/400x200/FF9500/FFFFFF?text=UI+UX",
    "capacity": 30,
    "availableSpots": 5,
    "speakers": [
      {
        "id": "3",
        "name": "Mike Chen",
        "title": "Lead UX Designer",
        "bio": "Mike is a lead UX designer at a top tech company.",
        "avatar": "https://via.placeholder.com/100"
      }
    ],
    "createdAt": "2024-01-03T00:00:00.000Z"
  }
]
```

### Sample Users
```json
[
  {
    "id": "1",
    "email": "john@example.com",
    "name": "John Doe",
    "avatar": "https://via.placeholder.com/150",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "2",
    "email": "jane@example.com",
    "name": "Jane Smith",
    "avatar": "https://via.placeholder.com/150",
    "createdAt": "2024-01-02T00:00:00.000Z"
  }
]
```

## 5. Testing the Setup

1. Start the app: `npm start`
2. Test login with: `john@example.com` / `password123`
3. Browse events and test registration
4. Check dashboard for registered events

## 6. Troubleshooting

- Ensure CORS is enabled in MockAPI settings
- Check that all endpoints return the expected data structure
- Verify the API_BASE_URL is correctly set
- Check browser console for any network errors

## 7. Production Considerations

For production deployment:
- Replace MockAPI with a real backend
- Implement proper authentication with JWT
- Add input validation and sanitization
- Implement rate limiting
- Add proper error handling and logging
