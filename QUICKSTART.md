# LearnKart Quick Start Guide

## Getting Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
npm run db:push
npm run db:seed
```

### 3. Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000

## Sample Login Credentials

After seeding, you can create a new account via the Register page.

## Key Features to Test

1. **Browse Courses** - Visit the home page and courses page
2. **View Course Details** - Click on any course to see videos and tests
3. **Register/Login** - Create an account or login
4. **Enroll in Free Course** - Enroll in the Python course (it's free!)
5. **Watch Videos** - Navigate to the learning page and watch course videos
6. **Take Tests** - Complete quizzes with instant feedback
7. **Check Dashboard** - View your learning statistics
8. **Dark Mode** - Toggle between light and dark themes

## Sample Courses Included

1. **Python Bootcamp** (Free) - 10 videos, 2 tests
2. **MERN Stack** ($79.99) - 10 videos, 2 tests
3. **Data Science** ($89.99) - 10 videos, 2 tests

## Project Structure

```
src/
├── app/                    # Next.js pages
│   ├── api/               # API routes
│   ├── courses/           # Course pages
│   ├── dashboard/         # User dashboard
│   ├── login/             # Login page
│   ├── register/          # Register page
│   └── my-courses/        # Enrolled courses
├── components/            # Reusable components
└── lib/                   # Utilities
```

## Common Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:seed` - Reseed database

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Prisma ORM
- NextAuth.js
- SQLite

## Next Steps

1. Customize the courses in `prisma/seed.ts`
2. Add your own branding and colors
3. Integrate Stripe for payments
4. Deploy to Vercel or your preferred platform

For detailed documentation, see README.md
