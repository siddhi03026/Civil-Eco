# API Integration Guide

Base URL:
- `http://localhost:5000/api`

Auth header:
- `Authorization: Bearer <token>`

Content types:
- Normal requests: `application/json`
- Issue create with image: `multipart/form-data`

## 1) Auth

### POST /auth/register
Request body:
```json
{
  "name": "Aman Kumar",
  "email": "aman@example.com",
  "mobile": "9876543210",
  "city": "Lucknow",
  "state": "Uttar Pradesh",
  "country": "India",
  "areaType": "urban",
  "password": "secret123"
}
```
Response: token + user object.

### POST /auth/login
Request body:
```json
{
  "email": "aman@example.com",
  "password": "secret123"
}
```
Response: token + user object.

## 2) Issues

### POST /issues
Auth required.
Use `FormData` fields:
- `description`
- `issueType`
- `severity` (`low|medium|high`)
- `latitude`
- `longitude`
- `image` (optional file)

### GET /issues
Auth + admin only. Returns all issues.

### GET /issues/user
Auth required. Returns logged-in user issues.

### PUT /issues/:id/status
Auth + admin only.
```json
{ "status": "resolved" }
```

### POST /issues/:id/respond
Auth required. (admin or issue owner)
```json
{
  "text": "We have assigned a team.",
  "voice": false
}
```

### GET /issues/map
Auth required.
Returns markers:
```json
{
  "success": true,
  "markers": [
    { "latitude": 26.84, "longitude": 80.94, "severity": "high", "status": "pending" }
  ]
}
```

## 3) Challenges

### GET /challenges
Auth required.

### POST /challenges/complete
Auth required.
```json
{ "challengeId": "<challenge_id>" }
```

## 4) Profile & Settings

### GET /user/profile
Auth required.

### PUT /user/update
Auth required.
```json
{
  "name": "Aman",
  "mobile": "9999999999",
  "city": "Lucknow",
  "state": "Uttar Pradesh",
  "country": "India",
  "areaType": "urban",
  "settings": {
    "language": "Hindi",
    "voiceEnabled": true,
    "notifications": true
  }
}
```

## 5) Dashboard

### GET /dashboard
Auth required.
- Admin gets `totalUsers` too.

## 6) AI Chat (Groq)

### POST /chat
Auth required.
```json
{
  "message": "How to manage wet waste at home?",
  "language": "English"
}
```
Returns short reply.

## 7) Admin

### GET /admin/users
Auth + admin only.

### GET /admin/issues
Auth + admin only.

## Frontend quick fetch example

```ts
const res = await fetch("http://localhost:5000/api/dashboard", {
  headers: { Authorization: `Bearer ${token}` }
});
const data = await res.json();
```

## Startup

Backend:
- `cd backend`
- `npm run dev`

Important:
- First registered account becomes `admin` automatically.
- Set real values in `backend/.env` for production.
