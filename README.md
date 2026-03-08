# MindPolis

MindPolis is a high-end civic intelligence platform designed to map, visualize, and analyze human political cognition. Unlike "buzzfeed-style" political quizzes, MindPolis uses verified psychometric methodologies (like the Moral Foundations Theory) mixed with dynamic scoring architecture to deliver a premium, reflective, and gamified experience without compromising academic seriousness.

## Philosophy
To measure the unmeasurable. We believe political identity is not a static point on a 2D compass, but a multidimensional topography of moral intuitions, material interests, and cultural priors.

## Technical Stack
- **Framework:** Next.js (App Router)
- **Monorepo:** Turborepo
- **Database:** PostgreSQL (via Prisma ORM)
- **Authentication:** NextAuth.js (Role-based access)
- **Styling:** Tailwind CSS (Strict design tokens, no Tailwind UI defaults)
- **Scoring Engine:** Python microservice (expected architecture) with a robust TypeScript fallback client.
- **Visualizations:** Recharts (Radar/Polygon mapping)

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Copy `.env.example` to `.env` and set your `DATABASE_URL` and `NEXTAUTH_SECRET`.

3. **Database Setup:**
   ```bash
   npx prisma db push
   # Seed the database with the 40-question compass and 36-question MFQ matrices
   npx tsx apps/web/prisma/seed-compass.ts
   npx tsx apps/web/prisma/seed-mft.ts
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## Internal Services
- **Client App:** Main Next.js application at `apps/web`
- **Scoring Service:** Python service at `apps/scoring-service` (Mock mode is enabled in active development if unreachable).

## Architecture Highlights
* **Progressive Disclosure:** Academic layers (MFT, Schwartz Values) are hidden behind "Learn More" toggles to maintain a clean UI while remaining rigorous.
* **Cognitive Signifiers:** Gamification mechanics built on introspection and rarity rather than XP points.
* **Frictionless Sharing:** Secure hash routing (`/r/[hash]`) mapped to generated OG images for Twitter/X virality.

## License
Proprietary. All rights reserved by Ashavid / MindPolis.
