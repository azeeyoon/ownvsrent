# Project Scaffolding Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Scaffold the backend (FastAPI + UV) and frontend (Vite + React) projects with proper structure, dependencies, and initial configuration.

**Architecture:** Monorepo with two separate projects: `backend/` (Python 3.12, FastAPI, UV) and `frontend/` (Vite, React, TypeScript, Tailwind). Each project is independently buildable and testable.

**Tech Stack:** Python 3.12, FastAPI, UV, Pydantic, pytest | Vite, React 18, TypeScript, Tailwind CSS, Recharts

---

## Task 1: Initialize Backend with UV

**Files:**
- Create: `backend/pyproject.toml`
- Create: `backend/.python-version`
- Create: `backend/README.md`

**Step 1: Create backend directory and initialize UV project**

Run:
```bash
cd /Users/jun/jun/side\ projects/ownvsrent
mkdir -p backend
cd backend
uv init --name ownvsrent --python 3.12
```

Expected: Creates `pyproject.toml`, `.python-version`, and basic structure

**Step 2: Update pyproject.toml with dependencies**

Replace `backend/pyproject.toml` with:

```toml
[project]
name = "ownvsrent"
version = "0.1.0"
description = "Rent vs Buy calculator API"
readme = "README.md"
requires-python = ">=3.12"
dependencies = [
    "fastapi>=0.115.0",
    "uvicorn[standard]>=0.34.0",
    "pydantic>=2.10.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.0.0",
    "pytest-cov>=4.1.0",
    "httpx>=0.27.0",
    "ruff>=0.8.0",
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.hatch.build.targets.wheel]
packages = ["src/ownvsrent"]

[tool.ruff]
line-length = 100
target-version = "py312"

[tool.ruff.lint]
select = ["E", "F", "I", "UP"]

[tool.pytest.ini_options]
testpaths = ["tests"]
pythonpath = ["src"]
```

**Step 3: Install dependencies**

Run:
```bash
cd /Users/jun/jun/side\ projects/ownvsrent/backend
uv sync --all-extras
```

Expected: Creates `uv.lock` and `.venv/`

**Step 4: Commit**

```bash
cd /Users/jun/jun/side\ projects/ownvsrent
git add backend/
git commit -m "feat(backend): initialize UV project with FastAPI dependencies"
```

---

## Task 2: Create Backend Source Structure

**Files:**
- Create: `backend/src/ownvsrent/__init__.py`
- Create: `backend/src/ownvsrent/main.py`
- Create: `backend/src/ownvsrent/api/__init__.py`
- Create: `backend/src/ownvsrent/api/routes.py`
- Create: `backend/src/ownvsrent/engine/__init__.py`

**Step 1: Create directory structure**

Run:
```bash
cd /Users/jun/jun/side\ projects/ownvsrent/backend
mkdir -p src/ownvsrent/api
mkdir -p src/ownvsrent/engine
```

**Step 2: Create `backend/src/ownvsrent/__init__.py`**

```python
"""ownvsrent - Rent vs Buy calculator API."""

__version__ = "0.1.0"
```

**Step 3: Create `backend/src/ownvsrent/main.py`**

```python
"""FastAPI application entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from ownvsrent.api.routes import router

app = FastAPI(
    title="ownvsrent API",
    description="Rent vs Buy calculator API",
    version="0.1.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
```

**Step 4: Create `backend/src/ownvsrent/api/__init__.py`**

```python
"""API routes package."""
```

**Step 5: Create `backend/src/ownvsrent/api/routes.py`**

```python
"""API route definitions."""

from fastapi import APIRouter

router = APIRouter()


@router.post("/calculate")
async def calculate():
    """Calculate rent vs buy comparison."""
    return {"message": "Not implemented yet"}


@router.post("/sensitivity")
async def sensitivity():
    """Calculate sensitivity analysis."""
    return {"message": "Not implemented yet"}


@router.post("/montecarlo")
async def montecarlo():
    """Run Monte Carlo simulation."""
    return {"message": "Not implemented yet"}
```

**Step 6: Create `backend/src/ownvsrent/engine/__init__.py`**

```python
"""Calculation engine package.

This package contains pure calculation logic with no FastAPI dependencies.
All modules here must be importable and testable without any web framework.
"""
```

**Step 7: Verify the app runs**

Run:
```bash
cd /Users/jun/jun/side\ projects/ownvsrent/backend
uv run uvicorn ownvsrent.main:app --reload --port 8000
```

Expected: Server starts at http://localhost:8000, health check at /health returns `{"status": "healthy"}`

Press Ctrl+C to stop.

**Step 8: Commit**

```bash
cd /Users/jun/jun/side\ projects/ownvsrent
git add backend/
git commit -m "feat(backend): add FastAPI app structure with stub routes"
```

---

## Task 3: Create Backend Test Structure

**Files:**
- Create: `backend/tests/__init__.py`
- Create: `backend/tests/conftest.py`
- Create: `backend/tests/test_health.py`
- Create: `backend/tests/engine/__init__.py`

**Step 1: Create test directories**

Run:
```bash
cd /Users/jun/jun/side\ projects/ownvsrent/backend
mkdir -p tests/engine
```

**Step 2: Create `backend/tests/__init__.py`**

```python
"""Test package."""
```

**Step 3: Create `backend/tests/conftest.py`**

```python
"""Pytest configuration and fixtures."""

import pytest
from fastapi.testclient import TestClient

from ownvsrent.main import app


@pytest.fixture
def client():
    """Create a test client for the FastAPI app."""
    return TestClient(app)
```

**Step 4: Create `backend/tests/test_health.py`**

```python
"""Health check endpoint tests."""


def test_health_check(client):
    """Health endpoint should return healthy status."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_calculate_stub(client):
    """Calculate endpoint should return stub response."""
    response = client.post("/api/calculate")
    assert response.status_code == 200
    assert "message" in response.json()
```

**Step 5: Create `backend/tests/engine/__init__.py`**

```python
"""Engine tests package."""
```

**Step 6: Run tests**

Run:
```bash
cd /Users/jun/jun/side\ projects/ownvsrent/backend
uv run pytest -v
```

Expected: 2 tests pass

**Step 7: Commit**

```bash
cd /Users/jun/jun/side\ projects/ownvsrent
git add backend/
git commit -m "feat(backend): add pytest setup with health check test"
```

---

## Task 4: Initialize Frontend with Vite

**Files:**
- Create: `frontend/` (via Vite scaffolding)

**Step 1: Create Vite React TypeScript project**

Run:
```bash
cd /Users/jun/jun/side\ projects/ownvsrent
npm create vite@latest frontend -- --template react-ts
```

Expected: Creates `frontend/` with React + TypeScript template

**Step 2: Install dependencies**

Run:
```bash
cd /Users/jun/jun/side\ projects/ownvsrent/frontend
npm install
```

Expected: Installs dependencies, creates `node_modules/`

**Step 3: Verify it runs**

Run:
```bash
cd /Users/jun/jun/side\ projects/ownvsrent/frontend
npm run dev
```

Expected: Dev server starts at http://localhost:5173

Press Ctrl+C to stop.

**Step 4: Commit**

```bash
cd /Users/jun/jun/side\ projects/ownvsrent
git add frontend/
git commit -m "feat(frontend): initialize Vite + React + TypeScript project"
```

---

## Task 5: Add Tailwind CSS to Frontend

**Files:**
- Modify: `frontend/package.json`
- Create: `frontend/tailwind.config.js`
- Create: `frontend/postcss.config.js`
- Modify: `frontend/src/index.css`

**Step 1: Install Tailwind and dependencies**

Run:
```bash
cd /Users/jun/jun/side\ projects/ownvsrent/frontend
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Expected: Creates `tailwind.config.js` and `postcss.config.js`

**Step 2: Update `frontend/tailwind.config.js`**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // From PRD color palette
        primary: '#1a2332',      // Deep navy
        'accent-buy': '#d4a843', // Warm amber/gold
        'accent-rent': '#2da88e', // Cool teal
        warning: '#c0392b',      // Muted red
      },
    },
  },
  plugins: [],
}
```

**Step 3: Replace `frontend/src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-gray-50 text-gray-900;
}
```

**Step 4: Update `frontend/src/App.tsx` to verify Tailwind works**

```tsx
function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-white p-6">
        <h1 className="text-3xl font-bold">ownvsrent.io</h1>
        <p className="text-gray-300">The rent vs. buy calculator that doesn't lie to you.</p>
      </header>
      <main className="container mx-auto p-6">
        <p className="text-lg">Calculator coming soon...</p>
      </main>
    </div>
  )
}

export default App
```

**Step 5: Verify Tailwind works**

Run:
```bash
cd /Users/jun/jun/side\ projects/ownvsrent/frontend
npm run dev
```

Expected: Page shows styled header with navy background

Press Ctrl+C to stop.

**Step 6: Commit**

```bash
cd /Users/jun/jun/side\ projects/ownvsrent
git add frontend/
git commit -m "feat(frontend): add Tailwind CSS with project color palette"
```

---

## Task 6: Add Recharts and API Client to Frontend

**Files:**
- Modify: `frontend/package.json`
- Create: `frontend/src/api/client.ts`

**Step 1: Install Recharts and Axios**

Run:
```bash
cd /Users/jun/jun/side\ projects/ownvsrent/frontend
npm install recharts axios
npm install -D @types/recharts
```

**Step 2: Create `frontend/src/api/client.ts`**

```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Placeholder types - will be expanded when engine is built
export interface CalculatorInputs {
  // Renting
  monthlyRent: number;
  annualRentIncrease: number;
  renterInsurance: number;
  // Buying
  purchasePrice: number;
  downPaymentPercent: number;
  mortgageRate: number;
  loanTermYears: number;
  propertyTaxRate: number;
  homeInsuranceRate: number;
  hoaMonthly: number;
  maintenanceRate: number;
  pmiRate: number;
  buyerClosingCostsPercent: number;
  sellingCostsPercent: number;
  // Financial
  holdingPeriodYears: number;
  annualAppreciation: number;
  annualInvestmentReturn: number;
  marginalTaxRate: number;
  filingStatus: 'single' | 'married';
}

export interface CalculatorResults {
  verdict: 'buy' | 'rent' | 'toss-up';
  breakEvenYear: number | null;
  netBenefitAtHorizon: number;
  renterWealthAtHorizon: number;
  buyerWealthAtHorizon: number;
}

export async function calculate(inputs: CalculatorInputs): Promise<CalculatorResults> {
  const response = await api.post<CalculatorResults>('/calculate', inputs);
  return response.data;
}
```

**Step 3: Create api directory**

Run:
```bash
mkdir -p /Users/jun/jun/side\ projects/ownvsrent/frontend/src/api
```

Then create the file from Step 2.

**Step 4: Commit**

```bash
cd /Users/jun/jun/side\ projects/ownvsrent
git add frontend/
git commit -m "feat(frontend): add Recharts, Axios, and API client stub"
```

---

## Task 7: Create Frontend Directory Structure

**Files:**
- Create: `frontend/src/components/calculator/.gitkeep`
- Create: `frontend/src/components/results/.gitkeep`
- Create: `frontend/src/components/charts/.gitkeep`
- Create: `frontend/src/components/ui/.gitkeep`
- Create: `frontend/src/hooks/.gitkeep`

**Step 1: Create component directories**

Run:
```bash
cd /Users/jun/jun/side\ projects/ownvsrent/frontend/src
mkdir -p components/calculator
mkdir -p components/results
mkdir -p components/charts
mkdir -p components/ui
mkdir -p hooks
touch components/calculator/.gitkeep
touch components/results/.gitkeep
touch components/charts/.gitkeep
touch components/ui/.gitkeep
touch hooks/.gitkeep
```

**Step 2: Commit**

```bash
cd /Users/jun/jun/side\ projects/ownvsrent
git add frontend/
git commit -m "feat(frontend): add component directory structure"
```

---

## Task 8: Add .gitignore and Update CLAUDE.md

**Files:**
- Create: `backend/.gitignore`
- Create: `frontend/.gitignore`
- Modify: `CLAUDE.md`

**Step 1: Create `backend/.gitignore`**

```gitignore
# Python
__pycache__/
*.py[cod]
*$py.class
.venv/
.env

# UV
.python-version

# Testing
.pytest_cache/
.coverage
htmlcov/

# IDE
.idea/
.vscode/
*.swp
```

**Step 2: Create `frontend/.gitignore`**

```gitignore
# Dependencies
node_modules/

# Build
dist/
dist-ssr/

# Environment
.env
.env.local
.env.*.local

# IDE
.idea/
.vscode/
*.swp

# Logs
*.log
npm-debug.log*
```

**Step 3: Update CLAUDE.md with new tech stack**

Add a section at the top of CLAUDE.md after "## Project Overview":

```markdown
## Tech Stack (Updated)

> **Note:** This project uses Python + FastAPI instead of Next.js. See `docs/plans/2026-02-07-python-fastapi-design.md` for architecture details.

- **Backend:** Python 3.12, FastAPI, Pydantic, UV
- **Frontend:** Vite, React 18, TypeScript, Tailwind CSS, Recharts
- **Testing:** pytest (backend), Vitest (frontend)
- **Deployment:** AWS EC2 (backend), S3 + CloudFront (frontend)

### Running Locally

```bash
# Backend
cd backend
uv sync --all-extras
uv run uvicorn ownvsrent.main:app --reload --port 8000

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

### Running Tests

```bash
# Backend
cd backend
uv run pytest -v

# Frontend
cd frontend
npm test
```

---
```

**Step 4: Commit**

```bash
cd /Users/jun/jun/side\ projects/ownvsrent
git add .
git commit -m "chore: add gitignore files and update CLAUDE.md with new tech stack"
```

---

## Task 9: Final Verification

**Step 1: Start backend**

Run:
```bash
cd /Users/jun/jun/side\ projects/ownvsrent/backend
uv run uvicorn ownvsrent.main:app --reload --port 8000
```

Keep running in background.

**Step 2: Start frontend (new terminal)**

Run:
```bash
cd /Users/jun/jun/side\ projects/ownvsrent/frontend
npm run dev
```

**Step 3: Verify both are running**

- Backend health: http://localhost:8000/health should return `{"status": "healthy"}`
- Frontend: http://localhost:5173 should show styled header
- API docs: http://localhost:8000/docs should show Swagger UI

**Step 4: Run all tests**

```bash
cd /Users/jun/jun/side\ projects/ownvsrent/backend
uv run pytest -v
```

Expected: All tests pass

**Step 5: Stop servers and final commit if any changes**

Press Ctrl+C on both terminals.

---

## Summary

After completing all tasks, you will have:

```
ownvsrent/
├── backend/
│   ├── pyproject.toml
│   ├── uv.lock
│   ├── .gitignore
│   ├── src/ownvsrent/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── routes.py
│   │   └── engine/
│   │       └── __init__.py
│   └── tests/
│       ├── __init__.py
│       ├── conftest.py
│       ├── test_health.py
│       └── engine/
│           └── __init__.py
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── .gitignore
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       ├── api/
│       │   └── client.ts
│       ├── components/
│       │   ├── calculator/
│       │   ├── results/
│       │   ├── charts/
│       │   └── ui/
│       └── hooks/
├── docs/plans/
├── CLAUDE.md (updated)
└── PRD.md
```

Both projects are ready for feature development.
