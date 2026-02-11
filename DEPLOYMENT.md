# LearnKart Deployment Guide

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database schema is up to date
- [ ] Production build succeeds (`npm run build`)
- [ ] All features tested locally
- [ ] SSL/HTTPS configured (handled by hosting platform)

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

Vercel is the creators of Next.js and provides the best integration.

1. **Push to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Configure project settings

3. **Set Environment Variables**

   ```env
   DATABASE_URL=<your-production-database-url>
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=<generate-secure-random-string>
   STRIPE_SECRET_KEY=<your-stripe-key>
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<your-stripe-public-key>
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy

5. **Setup Database**
   - For production, use PostgreSQL instead of SQLite
   - Recommended: [Supabase](https://supabase.com) (free tier available)
   - Update `DATABASE_URL` in Vercel environment variables
   - Run migrations: `npx prisma db push`

### Option 2: Netlify

1. **Build Settings**

   ```
   Build command: npm run build
   Publish directory: .next
   ```

2. **Environment Variables**
   Add all environment variables in Netlify dashboard

3. **Deploy**
   - Connect GitHub repository
   - Configure build settings
   - Deploy

### Option 3: Railway

Railway provides database hosting as well.

1. **Create New Project**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"

2. **Add PostgreSQL Database**
   - Click "New" → "Database" → "PostgreSQL"
   - Copy the connection string

3. **Configure Environment Variables**
   - Add all environment variables
   - Use Railway's PostgreSQL connection string for `DATABASE_URL`

4. **Deploy**
   - Railway will automatically deploy on git push

### Option 4: AWS Amplify

1. **Connect Repository**
   - Go to AWS Amplify console
   - Connect your GitHub repository

2. **Build Settings**

   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - "**/*"
     cache:
       paths:
         - node_modules/**/*
   ```

3. **Environment Variables**
   - Add all environment variables in Amplify console

4. **Deploy**
   - Save and deploy

## Production Database Setup

### Using Supabase (Recommended)

1. **Create Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Wait for database to be provisioned

2. **Get Connection String**
   - Go to Settings → Database
   - Copy the connection string
   - Replace `[YOUR-PASSWORD]` with your database password

3. **Update Prisma Schema**

   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

4. **Push Schema**

   ```bash
   npx prisma db push
   ```

5. **Seed Database**
   ```bash
   npm run db:seed
   ```

### Using PlanetScale

1. **Create Database**
   - Go to [planetscale.com](https://planetscale.com)
   - Create new database

2. **Get Connection String**
   - Copy connection string from dashboard

3. **Update Prisma Schema**

   ```prisma
   datasource db {
     provider = "mysql"
     url      = env("DATABASE_URL")
     relationMode = "prisma"
   }
   ```

4. **Deploy**

## Environment Variables for Production

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# NextAuth
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="<generate-with: openssl rand -base64 32>"

# Stripe (Optional - for payments)
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
```

## Generate Secure Secret

To generate a secure `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

Or use this Node.js command:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Post-Deployment Steps

1. **Test Authentication**
   - Create a test account
   - Login and logout
   - Test protected routes

2. **Verify Database**
   - Check courses are visible
   - Test enrollment
   - Verify test submissions

3. **Performance Check**
   - Run Lighthouse audit
   - Check Core Web Vitals
   - Optimize images if needed

4. **Setup Custom Domain (Optional)**
   - Add custom domain in hosting platform
   - Configure DNS records
   - Enable SSL/HTTPS

5. **Setup Monitoring**
   - Enable error tracking (Sentry)
   - Setup analytics (Google Analytics, Plausible)
   - Configure uptime monitoring

## Troubleshooting

### Build Fails

- Check all environment variables are set
- Verify TypeScript compilation succeeds
- Check Prisma schema is valid

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check database is accessible from deployment platform
- Ensure SSL is enabled if required

### Authentication Not Working

- Verify `NEXTAUTH_URL` matches your domain
- Check `NEXTAUTH_SECRET` is set
- Ensure cookies are not blocked

## Scaling Considerations

For high-traffic deployments:

1. **Database**
   - Use connection pooling (PgBouncer)
   - Enable read replicas
   - Implement caching (Redis)

2. **File Storage**
   - Use CDN for static assets
   - Store videos on YouTube/Vimeo
   - Use S3 for file uploads

3. **Performance**
   - Enable Edge Functions
   - Implement ISR (Incremental Static Regeneration)
   - Add image optimization

## Support

For deployment issues, check:

- Next.js deployment docs: https://nextjs.org/docs/deployment
- Vercel docs: https://vercel.com/docs
- Prisma deployment: https://www.prisma.io/docs/guides/deployment

## Maintenance

Regular tasks:

- Update dependencies monthly
- Backup database weekly
- Monitor error logs
- Check security updates
