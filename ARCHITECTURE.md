# ============================================================================
# MindPolis — System Architecture Document
# Version: 1.0.0 — 2026-03-07
# Why: Master reference for all architectural decisions, service boundaries,
#      data flows, and design rationale for the MindPolis platform.
# Env / Identity: Documentation — read by engineers, architects, researchers
# ============================================================================

# MindPolis — System Architecture

## 1. Platform Overview

MindPolis is a research-grade political cognition assessment platform.
It measures ideological tendencies, moral foundations, and cognitive consistency
across millions of users, and feeds into a data science pipeline for academic research.

---

## 2. High-Level Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                                  │
│    Next.js 14 (App Router)  ·  React  ·  TypeScript  ·  TailwindCSS   │
│    ShadCN UI  ·  Recharts  ·  NextAuth session                        │
└──────────────────────────────┬─────────────────────────────────────────┘
                               │ HTTPS
┌──────────────────────────────▼─────────────────────────────────────────┐
│                        NEXT.JS API LAYER                               │
│  /api/auth  ·  /api/assessments  ·  /api/results  ·  /api/admin       │
│  NextAuth  ·  Node.js Runtime  ·  Prisma ORM  ·  Zod validation       │
└──────────────┬────────────────────────────────────┬────────────────────┘
               │ Prisma (pg TCP)                    │ HTTP/REST (internal)
┌──────────────▼──────────────┐      ┌──────────────▼─────────────────────┐
│       PostgreSQL DB          │      │    Python Scoring Microservice      │
│  Neon / Supabase             │      │    FastAPI  ·  NumPy  ·  SciPy     │
│  Prisma migrations           │      │    scikit-learn  ·  Docker          │
│                              │      │    /score  /cluster  /ml/predict    │
└──────────────────────────────┘      └────────────────────────────────────┘
```

---

## 3. Service Boundaries

| Service | Owner | Responsibility |
|---|---|---|
| Next.js Frontend | React / TypeScript | UI, routing, SSR, session display |
| Next.js API Routes | Node.js | Business logic, auth, DB orchestration |
| Python FastAPI | Python | Scoring algorithms, ML inference, research exports |
| PostgreSQL | Prisma | Single source of truth for all state |

---

## 4. Data Flow — User Input to Score

```
User answers question
        │
        ▼
[Frontend] POST /api/assessments/submit
        │
        ▼
[Next.js API] Validate payload (Zod) → persist raw responses to DB
        │
        ▼
[Next.js API] POST http://scoring-service/score  { responses: [...] }
        │
        ▼
[Python FastAPI] Normalize responses → compute dimension vectors
                → apply scoring model → return ScoreResult JSON
        │
        ▼
[Next.js API] Persist ScoreResult to DB → return to client
        │
        ▼
[Frontend] Render results via Recharts visualizations
```

---

## 5. Monorepo Structure

See FOLDER_STRUCTURE.md

---

## 6. Scalability Strategy

- **DB**: Connection pooling via PgBouncer / Neon serverless driver
- **API**: Vercel Edge Functions for auth-less read routes
- **Scoring Service**: Horizontal scaling via Docker Compose / Kubernetes
- **Caching**: Redis for frequently accessed result summaries (future phase)
- **Queue**: BullMQ (Node) → scoring requests for async processing at scale
- **Research Export**: Anonymized bulk exports via Python pandas pipeline

---

## 7. Security Boundaries

- All scoring payloads validated server-side (Zod + Pydantic)
- Python service is NOT publicly accessible — only reachable from Next.js API
- PII (email, name) stored separately from assessment response data
- Research data exports contain no PII — only anonymized participant IDs
- Row-level security on PostgreSQL for multi-tenant research studies

---

## 8. Future ML Expansion Points

- `/ml/cluster` — K-means / DBSCAN ideological clustering
- `/ml/predict` — Fine-tuned BERT for open-text political sentiment
- `/ml/anomaly` — Detect response inconsistency (quality filtering)
- Model registry: MLflow or W&B integration hook in Python service

---
