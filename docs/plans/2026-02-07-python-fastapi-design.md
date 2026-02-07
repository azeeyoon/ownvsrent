# Design: ownvsrent.io — Python + FastAPI Architecture

**Date:** 2026-02-07
**Status:** Approved

## Summary

Rent vs. buy calculator with Python/FastAPI backend and React frontend, departing from the original Next.js spec to use a Python-first approach.

---

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Backend framework | FastAPI + Python 3.12 | User preference, UV package manager |
| Frontend framework | Vite + React | Fast dev server, static output, modern tooling |
| Calculation engine | Python only (server-side) | Single source of truth, easier to test |
| Backend hosting | AWS EC2 (t3.micro) | Low latency, no cold starts, simple to debug |
| Frontend hosting | AWS S3 + CloudFront | Static hosting with global CDN |
| Package manager | UV (backend), npm (frontend) | User preference |

---

## Project Structure

```
ownvsrent/
├── backend/
│   ├── pyproject.toml          # UV/Python deps
│   ├── src/
│   │   └── ownvsrent/
│   │       ├── __init__.py
│   │       ├── main.py         # FastAPI app entry
│   │       ├── api/
│   │       │   ├── __init__.py
│   │       │   └── routes.py   # /calculate, /sensitivity, /montecarlo
│   │       ├── engine/         # Pure calculation logic (no FastAPI deps)
│   │       │   ├── __init__.py
│   │       │   ├── types.py    # Pydantic models for inputs/outputs
│   │       │   ├── defaults.py # Constants with citations
│   │       │   ├── calculator.py
│   │       │   ├── amortization.py
│   │       │   ├── taxes.py
│   │       │   ├── renting.py
│   │       │   ├── buying.py
│   │       │   ├── wealth.py
│   │       │   ├── sensitivity.py
│   │       │   └── montecarlo.py
│   │       └── formatters.py
│   └── tests/
│       └── engine/             # Unit tests for calculations
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   └── api/                # API client for backend calls
│   └── public/
├── infrastructure/             # AWS deployment scripts (later)
├── docs/
│   └── plans/
├── CLAUDE.md
└── PRD.md
```

---

## API Endpoints

### `POST /api/calculate`

Primary endpoint called on every input change (debounced 200ms on frontend).

**Request body:** All calculator inputs (matches `CalculatorInputs` from CLAUDE.md)

**Response:**
```json
{
  "verdict": "buy | rent | toss-up",
  "breakEvenYear": 6,
  "netBenefitAtHorizon": 45230.50,
  "renterWealthAtHorizon": 312000.00,
  "buyerWealthAtHorizon": 357230.50,
  "monthlySnapshots": [],
  "yearlySnapshots": [],
  "monthlyRent": 2500,
  "monthlyOwnershipCost": 3200,
  "itemizationBeneficial": false,
  "pmiRemovedMonth": 84
}
```

### `POST /api/sensitivity`

Returns tornado chart data — varies each key input ±delta.

### `POST /api/montecarlo`

Runs 1,000 simulations with randomized appreciation, returns, rent growth.

---

## Frontend Architecture

```
frontend/src/
├── main.tsx                    # React entry point
├── App.tsx                     # Layout + routing
├── api/
│   └── client.ts               # Axios/fetch wrapper for backend calls
├── hooks/
│   ├── useCalculator.ts        # Manages inputs, debounces API calls
│   └── useUrlState.ts          # Syncs inputs to URL query params
├── components/
│   ├── calculator/
│   │   ├── SliderInput.tsx     # Slider + text input combo
│   │   ├── RentInputs.tsx
│   │   ├── BuyInputs.tsx
│   │   ├── FinancialInputs.tsx
│   │   └── InputSection.tsx    # Collapsible accordion wrapper
│   ├── results/
│   │   ├── Verdict.tsx         # Hero card: "Renting saves you $X"
│   │   ├── MonthlyCostBars.tsx
│   │   ├── ResultTabs.tsx
│   │   └── YearlyTable.tsx
│   └── charts/
│       ├── WealthOverTime.tsx
│       ├── CostBreakdown.tsx
│       ├── TornadoChart.tsx
│       └── MonteCarloChart.tsx
└── styles/
    └── index.css               # Tailwind imports
```

**Key behaviors:**
- `useCalculator` debounces at 200ms, calls `/api/calculate` on input change
- `useUrlState` syncs all inputs to URL for shareable links
- Charts use Recharts
- Tailwind for styling, mobile-first responsive design

---

## Calculation Engine

### Month-by-Month Simulation

The engine iterates monthly (not annually) for accuracy:
- Amortization with running principal/interest split
- PMI removal when `loan_balance / current_home_value <= 0.80`
- Tax benefit = `max(0, (itemized - standard_deduction) * marginal_rate)`
- Both sides invest surpluses for fair comparison

### Critical Rules

1. **PMI removal** — Uses current appraised value (with appreciation)
2. **SALT cap** — $40K (2025-2029), $10K (2030+), with phase-out for high earners
3. **Capital gains exemption** — $250K single / $500K married
4. **Mortgage interest cap** — Deductible on first $750K only
5. **PMI deductibility** — Starting 2026 (OBBBA)

### Pydantic Validation

All inputs validated:
- Rates: 0-1 (decimals)
- Prices: positive
- Loan term: [10, 15, 20, 25, 30]

---

## Testing Strategy

### Backend (pytest)

```
backend/tests/
├── engine/
│   ├── test_amortization.py    # Verify against known values
│   ├── test_taxes.py           # SALT caps, itemized vs standard
│   ├── test_pmi.py             # Auto-removal at 80% LTV
│   ├── test_calculator.py      # Full integration scenarios
│   └── test_edge_cases.py      # 0% down, 100% down, negative appreciation
└── api/
    └── test_routes.py          # Endpoint validation
```

### Frontend (Vitest + React Testing Library)

- Input components render and sync slider/text
- URL params populate inputs on load
- API error handling

---

## Deployment

### Backend (EC2)

- **Instance:** t3.micro (free tier)
- **Process manager:** systemd running uvicorn
- **Reverse proxy:** Nginx for SSL termination
- **SSL:** Let's Encrypt via Certbot
- **Domain:** api.ownvsrent.io

### Frontend (S3 + CloudFront)

- **S3 bucket:** Static hosting for Vite build
- **CloudFront:** CDN with HTTPS
- **Domain:** ownvsrent.io

### Environment Variables

```bash
# Backend
CORS_ORIGINS=https://ownvsrent.io
ENV=production

# Frontend
VITE_API_URL=https://api.ownvsrent.io
VITE_ADSENSE_ID=ca-pub-XXXXXXXXXX
```

---

## Migration Path: EC2 → Lambda

When traffic grows or cost optimization is needed:
1. Add Mangum adapter to FastAPI
2. Package with SAM or CDK
3. Deploy to Lambda + API Gateway
4. Update DNS for api.ownvsrent.io
5. Terminate EC2

The engine code requires no changes — only the hosting wrapper.

---

## Next Steps

1. Scaffold backend with UV + FastAPI
2. Scaffold frontend with Vite + React
3. Implement calculation engine with tests
4. Build UI components
5. Connect frontend to backend
6. Deploy to AWS
