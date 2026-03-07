# ============================================================================
# MindPolis: scoring-service/Dockerfile
# Version: 1.0.0 — 2026-03-07
# Why: Production Docker image for the Python scoring microservice.
#      Multi-stage build to keep the final image minimal and secure.
#      This service is NOT public-facing — only reachable from the
#      Next.js API server via an internal Docker network.
# ============================================================================

# ─────────────────────────────────────────────
# Stage 1: Dependency builder
# ─────────────────────────────────────────────
FROM python:3.11-slim AS builder

WORKDIR /build

# Install system deps for numpy/scipy compilation
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies into a virtual environment
COPY requirements.txt .
RUN python -m venv /venv && \
    /venv/bin/pip install --upgrade pip && \
    /venv/bin/pip install --no-cache-dir -r requirements.txt


# ─────────────────────────────────────────────
# Stage 2: Production image
# ─────────────────────────────────────────────
FROM python:3.11-slim AS production

WORKDIR /app

# Copy only the virtual environment — not the build tools
COPY --from=builder /venv /venv

# Copy application source
COPY app/ ./app/

# Use venv Python
ENV PATH="/venv/bin:$PATH"
ENV PYTHONUNBUFFERED=1
ENV ENV=production

# Expose internal port only — not mapped to host in production
EXPOSE 8000

# Run with uvicorn — single worker in container (scale via replicas)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
