# APUCircle

APUCircle is a full-stack student-life platform for Ritsumeikan Asia Pacific University. It gives students a year-round way to discover clubs by interest, request membership, see joined-club announcements and events, and interact through lightweight announcement reactions. Club leaders manage their own club spaces, while university staff use a separate admin portal for verification, approvals, and analytics.

## Tech Stack

- React + Vite frontend
- Tailwind CSS with custom APUCircle theme variables
- Node.js + Express backend
- MongoDB Atlas with Mongoose
- JWT access and refresh tokens in httpOnly cookies
- bcrypt password hashing
- Nodemailer email verification
- Cloudinary-ready image configuration

## Setup

```bash
npm install
cp .env.example .env
```

Fill `.env` with MongoDB Atlas, JWT, staff seed, and optional email/Cloudinary values. There is no local MongoDB fallback.

Generate strong JWT secrets:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## Environment Variables

Required for normal backend startup:

- `MONGODB_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CLIENT_URL`

Required for seeding:

- `STAFF_SEED_EMAIL`
- `STAFF_SEED_PASSWORD`

Optional:

- `MONGODB_DB_NAME`
- `ACCESS_TOKEN_EXPIRY`
- `REFRESH_TOKEN_EXPIRY`
- `CLOUDINARY_*`
- `EMAIL_*`
- `SEED_STUDENT_PASSWORD`
- `VITE_API_URL`

When SMTP variables are missing in development, registration prints the verification link in the server console.

## Development

```bash
npm run seed
npm run dev
```

Frontend: `http://localhost:3000`

Backend API: `http://localhost:5000/api`

Staff portal: `http://localhost:3000/staff/login`

## Production

```bash
npm run build
npm run start
```

Set `NODE_ENV=production`, use HTTPS, configure `CLIENT_URL` to the deployed frontend origin, and provide real email credentials so verification emails can be sent.

## Seed Data

`npm run seed` creates:

- one staff account from `STAFF_SEED_EMAIL` and `STAFF_SEED_PASSWORD`
- three verified student accounts
- five APU-relevant clubs
- active, quiet, and inactive activity states through backdated announcements
- sample events, members, join requests, and one pending leader application

If `SEED_STUDENT_PASSWORD` is omitted, the seed script generates one sample-student password and prints it once.

## Main API Areas

- `/api/auth`: register, verify, login, staff login, logout, refresh
- `/api/users`: profile, joined clubs, password change, leader applications
- `/api/clubs`: public directory, profile, staff create/archive, join flow
- `/api/clubs/:clubId/announcements`: member announcements and reactions
- `/api/clubs/:clubId/events`: member events
- `/api/dashboard`: recommendations, trending clubs, joined-club events
- `/api/notifications`: notification inbox and read state
- `/api/staff`: clubs, users, applications, analytics, platform announcements

## Validation And Security Notes

- Student registration requires `@apu.ac.jp`.
- Passwords require at least 8 characters, one uppercase letter, and one number.
- Auth endpoints are rate-limited.
- CORS only allows `CLIENT_URL`.
- All protected backend routes use JWT auth and role/scoped club middleware.
- Staff cannot access private club announcement/event routes through staff APIs.
