# Eco Harmony Backend

Production-ready backend API for sanitation awareness platform.

## Stack
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Groq API integration

## Setup
1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies:
   - `npm install`
3. Start in dev mode:
   - `npm run dev`

## API Base
- `http://localhost:5000/api`

## Main Routes
- `POST /auth/register`
- `POST /auth/login`
- `POST /issues`
- `GET /issues` (admin)
- `GET /issues/user`
- `PUT /issues/:id/status` (admin)
- `POST /issues/:id/respond`
- `GET /issues/map`
- `GET /challenges`
- `POST /challenges/complete`
- `GET /user/profile`
- `PUT /user/update`
- `GET /dashboard`
- `POST /chat`
- `GET /admin/users` (admin)
- `GET /admin/issues` (admin)

## Notes
- First registered user is auto-assigned `admin` role.
- Images upload to `/uploads` and are served statically.
- Daily challenges are auto-seeded at server startup.
