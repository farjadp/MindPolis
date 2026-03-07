# ============================================================================
# MindPolis — Monorepo Folder Structure
# Version: 1.0.0 — 2026-03-07
# Why: Canonical reference for project layout decisions.
#      Modular by domain to support team scaling and future ML expansion.
# Env / Identity: Documentation
# ============================================================================

```
mindpolis/
│
├── apps/
│   ├── web/                          # Next.js 14 App Router frontend
│   │   ├── app/
│   │   │   ├── layout.tsx            # Root layout — fonts, providers, theme
│   │   │   ├── page.tsx              # Landing page — platform intro & CTA
│   │   │   │
│   │   │   ├── (auth)/               # Auth route group — no shared nav
│   │   │   │   ├── login/page.tsx    # Sign-in page (NextAuth)
│   │   │   │   └── register/page.tsx # Registration page
│   │   │   │
│   │   │   ├── (dashboard)/          # Authenticated route group
│   │   │   │   ├── layout.tsx        # Dashboard shell — sidebar + topbar
│   │   │   │   ├── dashboard/page.tsx         # User home — overview stats
│   │   │   │   ├── assessment/
│   │   │   │   │   ├── page.tsx               # Assessment catalog
│   │   │   │   │   └── [assessmentId]/
│   │   │   │   │       ├── page.tsx           # Assessment intro screen
│   │   │   │   │       └── take/page.tsx      # Active question flow
│   │   │   │   ├── results/
│   │   │   │   │   ├── page.tsx               # All past results list
│   │   │   │   │   └── [resultId]/page.tsx    # Individual result detail
│   │   │   │   └── profile/page.tsx           # User profile & settings
│   │   │   │
│   │   │   ├── (admin)/              # Admin-only route group
│   │   │   │   ├── layout.tsx        # Admin shell
│   │   │   │   ├── admin/page.tsx    # Admin dashboard
│   │   │   │   ├── admin/users/page.tsx       # User management
│   │   │   │   ├── admin/assessments/page.tsx # Assessment CRUD
│   │   │   │   └── admin/research/page.tsx    # Research data exports
│   │   │   │
│   │   │   └── api/                  # Next.js API Routes (Node.js)
│   │   │       ├── auth/
│   │   │       │   └── [...nextauth]/route.ts  # NextAuth handler
│   │   │       ├── assessments/
│   │   │       │   ├── route.ts               # GET all, POST create
│   │   │       │   ├── [id]/route.ts          # GET one, PATCH, DELETE
│   │   │       │   └── submit/route.ts        # POST — submit responses
│   │   │       ├── results/
│   │   │       │   ├── route.ts               # GET user results
│   │   │       │   └── [id]/route.ts          # GET single result
│   │   │       ├── admin/
│   │   │       │   ├── users/route.ts         # Admin user list
│   │   │       │   └── export/route.ts        # Research data export
│   │   │       └── health/route.ts            # Health check endpoint
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                   # ShadCN generated components
│   │   │   ├── layout/               # Sidebar, Topbar, MobileNav
│   │   │   ├── assessment/           # QuestionCard, ProgressBar, Timer
│   │   │   ├── results/              # RadarChart, DimensionBar, ScoreBadge
│   │   │   └── admin/                # DataTable, ExportButton, UserRow
│   │   │
│   │   ├── lib/
│   │   │   ├── auth.ts               # NextAuth config & session helpers
│   │   │   ├── db.ts                 # Prisma client singleton
│   │   │   ├── scoring-client.ts     # HTTP client → Python scoring service
│   │   │   ├── validations/          # Zod schemas for all API inputs
│   │   │   └── utils.ts              # Shared utility functions
│   │   │
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── store/                    # Zustand — assessment session state
│   │   ├── types/                    # Global TypeScript types
│   │   ├── public/                   # Static assets
│   │   ├── .env.local                # Environment variables (gitignored)
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   └── tsconfig.json
│   │
│   └── scoring-service/              # Python FastAPI microservice
│       ├── app/
│       │   ├── main.py               # FastAPI app entrypoint
│       │   ├── routers/
│       │   │   ├── score.py          # POST /score — main scoring endpoint
│       │   │   ├── cluster.py        # POST /cluster — ideological clustering
│       │   │   └── ml.py             # POST /ml/predict — ML inference
│       │   ├── models/
│       │   │   ├── request.py        # Pydantic request schemas
│       │   │   └── response.py       # Pydantic response schemas
│       │   ├── engines/
│       │   │   ├── political_compass.py  # Left/Right & Auth/Lib axes
│       │   │   ├── moral_foundations.py  # MFT scoring (Haidt)
│       │   │   ├── cognitive_style.py    # NFC, cognitive consistency
│       │   │   └── normalization.py      # Vector normalization utils
│       │   └── config.py             # Service configuration
│       ├── tests/
│       ├── Dockerfile
│       ├── requirements.txt
│       └── .env
│
├── packages/
│   ├── db/                           # Shared Prisma schema & migrations
│   │   ├── prisma/
│   │   │   ├── schema.prisma         # Master database schema
│   │   │   └── migrations/           # All migration history
│   │   ├── src/
│   │   │   └── index.ts              # Re-exports Prisma client & types
│   │   └── package.json
│   │
│   └── shared-types/                 # Shared TypeScript interfaces
│       ├── src/
│       │   ├── assessment.ts         # Assessment & question types
│       │   ├── scoring.ts            # Score result types
│       │   └── user.ts               # User profile types
│       └── package.json
│
├── docker/
│   ├── docker-compose.yml            # Local dev: postgres + scoring service
│   └── scoring-service.Dockerfile    # Production scoring service image
│
├── scripts/
│   ├── seed.ts                       # DB seed — initial assessments & questions
│   └── export-research.ts            # CLI tool for research data export
│
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Test + lint on PR
│       └── deploy.yml                # Deploy web to Vercel, service to Docker
│
├── package.json                      # Root workspace config (pnpm/turborepo)
├── turbo.json                        # Turborepo pipeline config
└── README.md
```
