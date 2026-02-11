# LearnKart - E-Learning Platform

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19.2-2D3748)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC)](https://tailwindcss.com/)

A full-featured e-learning platform built with Next.js 16, featuring video courses, interactive tests, live class announcements with statistics, and secure authentication.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Database Schema](#database-schema)
- [Security](#security)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Features

### Core Features

- 🎓 **Course Management** - Browse, search, and enroll in courses with video lectures
- 📹 **Video Player** - Custom video player with progress tracking and speed controls
- 📝 **Interactive Tests** - Multiple-choice quizzes with instant feedback
- 🔐 **User Authentication** - Secure login/register with JWT sessions
- 🔑 **Password Reset** - Forgot password flow with email-based token verification
- 📢 **Live Class Announcements** - Schedule and display live classes by category
- 📊 **Event Statistics** - Track enrollments, attendance, and certifications for past events
- 🌙 **Dark Mode** - Full dark mode support with smooth transitions
- 📱 **Responsive Design** - Mobile-first design with Tailwind CSS

### Security Features

- 🛡️ **Rate Limiting** - Protect auth endpoints from brute force attacks
- ✅ **Input Validation** - Zod schemas for all user inputs
- 🔒 **Password Hashing** - bcrypt with 10 salt rounds
- 🍪 **Secure Sessions** - HttpOnly, Secure, SameSite cookies
- 🔐 **CSRF Protection** - Built-in with NextAuth.js
- 💉 **SQL Injection Prevention** - Prisma parameterized queries

## Architecture

### System Architecture

```mermaid
graph TB
    subgraph Client[Client Layer]
        Browser[Next.js React App<br/>Browser]
        SSR[Server Components<br/>SSR]
    end

    subgraph API[API Layer]
        AuthAPI[Auth API<br/>/api/auth/*]
        CoursesAPI[Courses API<br/>/api/courses/*]
        RateLimit[Rate Limiter<br/>In-Memory]
    end

    subgraph Services[Service Layer]
        NextAuth[NextAuth.js<br/>JWT Strategy]
        Email[Email Service<br/>Nodemailer]
        Validation[Validation<br/>Zod]
    end

    subgraph Data[Data Layer]
        Prisma[Prisma ORM]
        DB[(SQLite DB<br/>dev.db)]
    end

    Browser --> SSR
    SSR --> AuthAPI
    SSR --> CoursesAPI
    AuthAPI --> RateLimit
    CoursesAPI --> RateLimit
    AuthAPI --> NextAuth
    AuthAPI --> Email
    AuthAPI --> Validation
    CoursesAPI --> Validation
    NextAuth --> Prisma
    Email --> Prisma
    Prisma --> DB

    style Client fill:#e1f5ff
    style API fill:#fff4e1
    style Services fill:#f0e1ff
    style Data fill:#e1ffe1
```

### Data Flow - User Authentication

```mermaid
sequenceDiagram
    actor User
    participant UI as Next.js UI
    participant API as Auth API
    participant RL as Rate Limiter
    participant Val as Validator
    participant Auth as NextAuth
    participant DB as Database

    User->>UI: Submit Login Form
    UI->>API: POST /api/auth/signin
    API->>RL: Check Rate Limit
    alt Rate Limit Exceeded
        RL-->>API: 429 Too Many Requests
        API-->>UI: Error Response
        UI-->>User: Show Error
    else Within Limit
        RL-->>API: Allow Request
        API->>Val: Validate Input (Zod)
        Val-->>API: Valid
        API->>Auth: Authorize User
        Auth->>DB: Query User by Email
        DB-->>Auth: User Record
        Auth->>Auth: Compare Password (bcrypt)
        alt Password Valid
            Auth-->>API: JWT Token
            API-->>UI: Set Cookie (HttpOnly, Secure)
            UI-->>User: Redirect to Dashboard
        else Password Invalid
            Auth-->>API: Unauthorized
            API-->>UI: Error Response
            UI-->>User: Show Error
        end
    end
```

### Database Schema

```mermaid
erDiagram
    User ||--o{ Course : creates
    User ||--o{ Enrollment : enrolls
    User ||--o{ PasswordReset : requests
    Course ||--o{ Enrollment : has
    Course ||--o{ Lecture : contains
    Course ||--o{ LiveClass : schedules
    Lecture ||--o{ Test : has

    User {
        string id PK
        string email UK
        string password
        string name
        datetime createdAt
    }

    Course {
        string id PK
        string title
        string slug UK
        string description
        float price
        string thumbnail
        string authorId FK
        int certified
        datetime createdAt
    }

    Enrollment {
        string id PK
        string userId FK
        string courseId FK
        float progress
        datetime enrolledAt
    }

    Lecture {
        string id PK
        string title
        string videoUrl
        int duration
        string courseId FK
        string testData
        int order
    }

    Test {
        string id PK
        string lectureId FK
        json questions
    }

    LiveClass {
        string id PK
        string title
        string description
        string courseId FK
        datetime scheduledAt
        int duration
        string meetingUrl
        string status
        string instructor
        int attendees
    }

    PasswordReset {
        string id PK
        string userId FK
        string token UK
        datetime expiresAt
        boolean used
        datetime createdAt
    }
```

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19.2.3** - Server Components + Client Components
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Lucide React** - Icon library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **NextAuth.js 4** - Authentication with JWT
- **Prisma 5.22.0** - Type-safe ORM
- **Zod** - Schema validation
- **bcryptjs** - Password hashing

### Database
- **SQLite** - Development database
- **PostgreSQL** - Recommended for production

### Email
- **Nodemailer** - Email delivery service
- Supports Gmail, SendGrid, or any SMTP provider

## Getting Started

### Prerequisites

- Node.js 20.9.0 or higher
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd learnkart
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this-in-production

# Stripe (Optional - not implemented yet)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Email (Optional - shows URL in console if not configured)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=LearnKart <noreply@learnkart.com>
```

4. **Initialize the database**
```bash
npx prisma db push
npm run db:seed
```

5. **Start the development server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

### Test Credentials

After seeding, you can log in with:
- **Email:** john@example.com
- **Password:** password123

Other test users: jane@example.com, alice@example.com (same password)

## Database Schema

### Models

#### User
Stores user account information with secure password hashing.

#### Course
Course catalog with title, description, pricing, and author information.

#### Enrollment
Tracks user enrollments in courses with progress percentage.

#### Lecture
Video lectures within courses, ordered sequentially with test data.

#### Test
Interactive quizzes associated with lectures, stored as JSON.

#### LiveClass
Live class announcements with scheduling, meeting URLs, and attendance tracking.

#### PasswordReset
Secure password reset tokens with expiration and one-time use enforcement.

### Database Commands

```bash
# Apply schema changes
npx prisma db push

# Open Prisma Studio (GUI)
npx prisma studio

# Seed database
npm run db:seed

# Generate Prisma Client
npx prisma generate

# Reset database (destructive)
npx prisma db push --force-reset
```

## Security

### Authentication & Authorization

- **Password Security:** bcrypt hashing with 10 salt rounds
- **Session Management:** JWT tokens stored in HttpOnly cookies
- **Cookie Security:** Secure flag (HTTPS only), SameSite=Lax
- **Session Expiry:** 30 days maximum age

### Rate Limiting

Protected endpoints:
- `/api/auth/register` - 5 requests per 15 minutes
- `/api/auth/forgot-password` - 3 requests per 15 minutes
- `/api/auth/reset-password` - 5 requests per 15 minutes

### Input Validation

All API endpoints use Zod schemas:
- Email format validation
- Password strength (min 8 chars, letter + number)
- Name length (2-100 characters)
- Token format validation

### Security Best Practices

- CSRF protection via NextAuth
- SQL injection prevention via Prisma
- XSS prevention via React auto-escaping
- Server-side authorization checks
- Environment variables for secrets
- No secrets in git history

### Password Reset Flow

1. User requests reset via email
2. System generates secure 32-byte hex token
3. Token expires after 1 hour
4. Token is single-use only
5. Email sent with reset link (or shown in console in dev mode)
6. User resets password with valid token
7. Old sessions remain valid (future: invalidate on password change)

## API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123",
  "name": "John Doe"
}
```

**Rate Limit:** 5 requests / 15 minutes

**Response:** 201 Created
```json
{
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### POST `/api/auth/signin`
Sign in with email and password (via NextAuth).

#### POST `/api/auth/forgot-password`
Request password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Rate Limit:** 3 requests / 15 minutes

**Response:** 200 OK (always, to prevent email enumeration)
```json
{
  "message": "If an account exists, a reset email has been sent"
}
```

#### POST `/api/auth/reset-password`
Reset password with token.

**Request Body:**
```json
{
  "token": "abc123...",
  "password": "NewPassword123"
}
```

**Rate Limit:** 5 requests / 15 minutes

**Response:** 200 OK
```json
{
  "message": "Password reset successful"
}
```

### Course Endpoints

#### GET `/api/courses`
List all published courses (future endpoint).

#### GET `/api/courses/[slug]`
Get course details by slug.

#### POST `/api/courses/[id]/enroll`
Enroll in a course (requires authentication).

## Deployment

### Production Checklist

- [ ] Change `NEXTAUTH_SECRET` to a strong random value
- [ ] Set `NEXTAUTH_URL` to your production domain
- [ ] Use PostgreSQL instead of SQLite
- [ ] Configure email service (Gmail/SendGrid)
- [ ] Enable HTTPS (Secure cookies require it)
- [ ] Set up database backups
- [ ] Configure CDN for video assets
- [ ] Enable logging and monitoring
- [ ] Review and test rate limits
- [ ] Remove seed data in production

### Environment Variables (Production)

```env
DATABASE_URL=postgresql://user:password@host:5432/learnkart
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
EMAIL_SERVER_HOST=smtp.sendgrid.net
EMAIL_SERVER_USER=apikey
EMAIL_SERVER_PASSWORD=<sendgrid-api-key>
```

### Deployment Platforms

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
# ... add other variables
```

#### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Database Migration (SQLite → PostgreSQL)

1. Update `DATABASE_URL` in `.env`
2. Run migrations:
```bash
npx prisma db push
npx prisma db seed
```

## Project Structure

```
learnkart/
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── seed.ts             # Seed data
│   └── dev.db              # SQLite database (dev only)
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # API routes
│   │   │   └── auth/       # Auth endpoints
│   │   ├── courses/        # Course pages
│   │   ├── login/          # Login page
│   │   ├── register/       # Register page
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── components/         # React components
│   │   ├── navbar.tsx
│   │   ├── course-card.tsx
│   │   └── course-player.tsx
│   └── lib/                # Utilities
│       ├── auth.ts         # NextAuth config
│       ├── db.ts           # Prisma client
│       ├── email.ts        # Email service
│       ├── rate-limit.ts   # Rate limiter
│       └── validations.ts  # Zod schemas
├── public/                 # Static assets
├── .env                    # Environment variables
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

## Development

### Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

### Database Management

```bash
# View database in GUI
npx prisma studio

# Create migration (PostgreSQL only)
npx prisma migrate dev --name description

# Apply migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Known Issues

1. **Stripe Integration** - Payment flow is not implemented yet
2. **Course Progress** - Progress only saves in component state (lost on refresh)
3. **Email in Development** - Shows reset URL in console instead of sending email
4. **Announcements Pages** - Category pages not created yet

## Roadmap

- [ ] Complete live class announcements feature
- [ ] Implement Stripe payment integration
- [ ] Add course progress persistence
- [ ] Create admin dashboard for course management
- [ ] Add course reviews and ratings
- [ ] Implement certificate generation
- [ ] Add email notifications for live classes
- [ ] Create mobile app (React Native)

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.

---

Built with Next.js 16, React 19, TypeScript, Prisma, and Tailwind CSS.
