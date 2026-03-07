# ============================================================================
# MindPolis: API_ENDPOINTS.md
# Version: 1.0.0 — 2026-03-07
# Why: Complete reference for all API endpoints — Next.js API routes and
#      Python scoring service endpoints. Used by frontend developers,
#      researchers integrating the system, and QA engineers.
# ============================================================================

# MindPolis — API Endpoints Reference

---

## Next.js API Routes (`/api/...`)

### Auth
| Method | Path | Auth | Description |
|---|---|---|---|
| GET/POST | `/api/auth/[...nextauth]` | — | NextAuth handler — sign in/out/session |

---

### Assessments
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/assessments` | Public | List all active assessments (catalog) |
| POST | `/api/assessments` | ADMIN | Create new assessment |
| GET | `/api/assessments/:id` | User | Get single assessment + all questions |
| PATCH | `/api/assessments/:id` | ADMIN | Update assessment metadata |
| DELETE | `/api/assessments/:id` | ADMIN | Soft-delete assessment (sets isActive=false) |
| POST | `/api/assessments/submit` | User | **Main submit endpoint** — orchestrates scoring pipeline |

**Submit Payload:**
```json
{
  "assessmentId": "cuid",
  "submissionId": "cuid",
  "responses": [
    {
      "questionId": "cuid",
      "value": 4,
      "answeredAt": "2026-03-07T10:00:00Z",
      "latencyMs": 3200
    }
  ]
}
```

**Submit Response:**
```json
{
  "result": { "id": "...", "clusterLabel": "Libertarian-Left", ... },
  "scoreResult": {
    "dimensions": [
      { "key": "economic_axis", "value": -0.42, "interpretation": "Center-Left" }
    ],
    "summary": { "label": "Center-Left / Libertarian", "highlights": [...] }
  }
}
```

---

### Results
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/results?page=1&limit=20` | User | Paginated list of user's results |
| GET | `/api/results/:id` | User | Single result with full dimension scores |

---

### Admin
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/users` | ADMIN | Paginated user list |
| GET | `/api/admin/export` | ADMIN/RESEARCHER | Anonymized research data export (JSON/CSV) |

---

### System
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | Public | Stack health check (DB + scoring service) |

---

## Python Scoring Service (`http://scoring-service:8000/...`)

> **Internal only** — NOT reachable from the public internet.
> All calls go through Next.js API routes.

### Scoring
| Method | Path | Description |
|---|---|---|
| GET | `/health` | Service health probe |
| POST | `/score/` | Compute dimension scores from assessment responses |

**POST `/score/` Payload:**
```json
{
  "assessmentSlug": "political-compass",
  "assessmentVersion": "1.0",
  "modelVersion": "1.0.0",
  "responses": [
    {
      "questionId": "abc",
      "value": 4.0,
      "dimensionKeys": ["economic_axis"],
      "isReversed": false,
      "weight": 1.0
    }
  ]
}
```

**POST `/score/` Response:**
```json
{
  "assessmentSlug": "political-compass",
  "modelVersion": "1.0.0",
  "dimensions": [
    { "key": "economic_axis", "label": "Economic Axis", "value": -0.42, "interpretation": "Center-Left" },
    { "key": "social_axis",   "label": "Social Axis",   "value": -0.61, "interpretation": "Libertarian" }
  ],
  "scoresFlat": { "economic_axis": -0.42, "social_axis": -0.61 },
  "summary": {
    "label": "Center-Left / Libertarian",
    "interpretation": ["Economic Axis: Center-Left", "Social Axis: Libertarian"],
    "highlights": ["Strong Libertarian tendency on Social Axis"]
  },
  "computedAt": "2026-03-07T10:00:00Z"
}
```

### Clustering
| Method | Path | Description |
|---|---|---|
| POST | `/cluster/` | Assign participant to ideological cluster |

### ML Inference (v2 — stub in v1)
| Method | Path | Description |
|---|---|---|
| POST | `/ml/predict` | ML model inference (currently stub) |

---

## Error Format

All errors return a consistent shape:
```json
{
  "error": "Human-readable message",
  "issues": {}   // Zod validation details (422 only)
}
```

| Code | Meaning |
|---|---|
| 401 | Unauthenticated — missing or invalid session |
| 403 | Forbidden — insufficient role |
| 404 | Resource not found |
| 422 | Invalid input — see `issues` |
| 503 | Scoring service unavailable — raw data preserved |
