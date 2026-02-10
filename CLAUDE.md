# CLAUDE.md — ownvsrent.io

## Session Continuity Rules

**IMPORTANT:** Update this file whenever significant operations are performed to preserve context for future Claude Code sessions.

### What to Document
- New features added or modified
- Configuration changes (env vars, build settings)
- New dependencies or tools installed
- SEO/content updates
- Bug fixes and their solutions
- Pending tasks or known issues

### Recent Updates Log

| Date | Change |
|------|--------|
| 2026-02-09 | Added SEO enhancements to blog pages (canonical URLs, Open Graph, BreadcrumbList schema, enhanced Article schema) |
| 2026-02-09 | Created `/seo-blog-post` Claude skill for generating SEO-optimized blog posts (~/.claude/skills/seo-blog-post/) |
| 2026-02-09 | Fixed mobile responsiveness (overflow-x-hidden, responsive AdUnit) |
| 2026-02-09 | Added blog section with 5 initial posts |
| 2026-02-09 | Set up AdSense integration (VITE_ADSENSE_ID, display slot: 1442070296, in-article slot: 9767282879) |
| 2026-02-08 | Created 26 city-specific landing pages with SEO content |
| 2026-02-08 | Set up Reddit monitoring guide (reddit-monitor/SETUP.md) — awaiting API approval |

### Pending Tasks
- Reddit API approval (then upgrade monitoring to automated)
- AdSense activation (currently "Getting ready")
- Generate more blog posts using `/seo-blog-post` skill

---

## Project Overview

A free, client-side rent vs. buy financial calculator targeting Google AdSense monetization. The site helps users make an informed rent-vs-buy decision with transparent math, sensitivity analysis, and no bias toward either option.

**Read the full PRD:** `PRD.md` in the project root contains the complete product specification, competitive analysis, calculation formulas, and launch roadmap. Refer to it for any product questions.

---

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

## Tech Stack (Original)

- **Framework:** Next.js 14+ with App Router (static export via `next export`)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Testing:** Vitest
- **Hosting target:** Cloudflare Pages (static)
- **Package manager:** npm

---

## Architecture

### Core Principle: Engine ≠ UI

The calculation engine in `src/engine/` is **pure TypeScript with zero React or DOM dependencies**. It must be importable and testable without any browser environment. All React/UI code lives in `src/components/` and `src/hooks/`.

### Directory Layout

```
src/
  app/              → Next.js App Router pages (layout, page, metadata)
  components/
    calculator/     → Input panel components (SliderInput, RentInputs, BuyInputs, etc.)
    results/        → Output display (Verdict, MonthlyCostBars, YearlyTable)
    charts/         → Recharts wrappers (WealthOverTime, TornadoChart, etc.)
    features/       → Cross-cutting (ScenarioCompare, ShareExport, AdUnit)
    content/        → Static content sections (Methodology, FAQ, Glossary)
    ui/             → Shared primitives (Accordion, Card, Tabs, Button)
  engine/           → Pure calculation logic (NO React imports allowed here)
  hooks/            → React hooks (useCalculator, useUrlState, useExport)
  data/             → Static data files (cities.json)
tests/
  engine/           → Unit tests for calculation engine
  components/       → Component tests
```

---

## Calculation Engine (`src/engine/`)

### File Responsibilities

| File | Purpose |
|------|---------|
| `types.ts` | All TypeScript interfaces: `CalculatorInputs`, `MonthlySnapshot`, `YearlySnapshot`, `CalculatorResults`, `SensitivityResult` |
| `defaults.ts` | Default input values, constants (standard deductions, SALT caps, capital gains exemptions) |
| `calculator.ts` | Main entry point — takes `CalculatorInputs`, returns `CalculatorResults`. Orchestrates all sub-modules |
| `amortization.ts` | Mortgage amortization schedule (month-by-month principal, interest, balance) |
| `taxes.ts` | Tax deduction logic: SALT cap (2025-2029 OBBBA $40K, 2030+ $10K), mortgage interest deduction ($750K cap), PMI deductibility (2026+), standard vs. itemized comparison |
| `renting.ts` | Renting cash flows: rent escalation, insurance, investment portfolio growth |
| `buying.ts` | Buying cash flows: PITI, HOA, maintenance, PMI (auto-remove at 80% LTV) |
| `wealth.ts` | Net wealth comparison at sale: home equity, selling costs, capital gains tax (with $250K/$500K exemption), investment portfolio liquidation |
| `sensitivity.ts` | Tornado chart data: varies each key input ±delta, measures impact on net benefit |
| `montecarlo.ts` | 1,000-sim Monte Carlo: Normal distributions for appreciation, returns, rent growth, inflation |
| `formatters.ts` | Currency formatting, percentage formatting, compact number display |

### Critical Calculation Rules

1. **Month-by-month loop** — Do NOT use annual approximations. The engine iterates monthly for accuracy (amortization, PMI removal timing, investment compounding).

2. **PMI auto-removal** — PMI stops when `currentBalance / currentHomeValue <= 0.80`. Use current appraised value (with appreciation), not original purchase price.

3. **Tax benefit = only EXCESS of itemized over standard** — This is the #1 mistake in competing calculators. If itemized deductions < standard deduction, mortgage interest deduction provides ZERO benefit. We must model this correctly:
   ```
   taxBenefit = max(0, (itemizedTotal - standardDeduction) * marginalRate)
   ```

4. **SALT cap (current law):**
   - 2025–2029: $40,000 ($20,000 MFS), with 1% annual inflation adjustment
   - Phase-out: 30% reduction of cap for MAGI > $500K, floor of $10K
   - 2030+: reverts to $10,000

5. **PMI deductibility** — Starting tax year 2026, PMI premiums treated as deductible mortgage interest (OBBBA). Phase-out: AGI $100K–$110K.

6. **Mortgage interest cap** — Deductible on first $750K of acquisition debt only. If loan > $750K, prorate.

7. **Standard deduction values (2025 base, adjust for inflation each year):**
   - Single: $15,750
   - Married Filing Jointly: $31,500

8. **Capital gains exemption on home sale** — $250K single / $500K married. Only gains above exemption are taxed.

9. **Renter invests the difference** — The renter's portfolio starts with (downPayment + closingCosts) on month 0, plus any monthly savings when rent < total ownership cost.

10. **Both sides invest surpluses** — If buying is cheaper in a given month, the buyer invests the difference too. Fair comparison requires this symmetry.

### Type Interfaces

```typescript
interface CalculatorInputs {
  // Renting
  monthlyRent: number;
  annualRentIncrease: number;      // decimal, e.g., 0.03
  renterInsurance: number;         // monthly
  securityDeposit: number;         // months of rent
  brokerFee: number;               // decimal, one-time

  // Buying
  purchasePrice: number;
  downPaymentPercent: number;      // decimal, e.g., 0.20
  mortgageRate: number;            // decimal annual, e.g., 0.068
  loanTermYears: number;           // 10, 15, 20, 25, 30
  propertyTaxRate: number;         // decimal annual
  homeInsuranceRate: number;       // decimal annual, % of home value
  hoaMonthly: number;
  maintenanceRate: number;         // decimal annual, % of home value
  pmiRate: number;                 // decimal annual
  buyerClosingCostsPercent: number;// decimal, % of loan
  sellingCostsPercent: number;     // decimal, % of sale price

  // Financial
  holdingPeriodYears: number;
  annualAppreciation: number;      // decimal
  annualInvestmentReturn: number;  // decimal
  annualInflation: number;         // decimal
  marginalTaxRate: number;         // decimal (federal)
  stateTaxRate: number;            // decimal
  filingStatus: 'single' | 'married';
  capitalGainsTaxRate: number;     // decimal
}

interface MonthlySnapshot {
  month: number;
  // Renting
  rent: number;
  renterInsurance: number;
  totalRentCost: number;
  renterPortfolio: number;
  // Buying
  mortgagePayment: number;
  principal: number;
  interest: number;
  propertyTax: number;
  homeInsurance: number;
  maintenance: number;
  hoa: number;
  pmi: number;
  totalBuyCost: number;
  loanBalance: number;
  homeValue: number;
  homeEquity: number;
  buyerPortfolio: number;
}

interface YearlySnapshot {
  year: number;
  totalRentPaid: number;          // cumulative
  totalBuyCostPaid: number;       // cumulative
  homeEquity: number;
  renterPortfolio: number;
  buyerPortfolio: number;
  taxBenefit: number;             // that year's benefit
  renterWealth: number;           // net, after tax on investment gains
  buyerWealth: number;            // net, after selling costs + taxes
  netBenefit: number;             // buyer - renter (positive = buy wins)
}

interface CalculatorResults {
  verdict: 'buy' | 'rent' | 'toss-up';
  breakEvenYear: number | null;   // null if never breaks even in 30 yrs
  netBenefitAtHorizon: number;    // positive = buy wins
  renterWealthAtHorizon: number;
  buyerWealthAtHorizon: number;
  monthlySnapshots: MonthlySnapshot[];
  yearlySnapshots: YearlySnapshot[];
  // First month stats for display
  monthlyRent: number;
  monthlyOwnershipCost: number;   // total PITI + HOA + maint + PMI
  monthlyMortgagePayment: number;
  itemizationBeneficial: boolean; // whether itemizing beats standard deduction in year 1
  pmiRemovedMonth: number | null; // month when PMI drops off
}

interface SensitivityResult {
  variable: string;
  label: string;
  lowValue: number;
  highValue: number;
  lowOutcome: number;             // netBenefit at low value
  highOutcome: number;            // netBenefit at high value
  baseOutcome: number;            // netBenefit at user's value
  impact: number;                 // highOutcome - lowOutcome (absolute spread)
}

interface MonteCarloResult {
  simulations: number;
  buyWinsPct: number;
  median: number;
  p10: number;
  p90: number;
  distribution: number[];         // array of netBenefit values
}
```

---

## Component Guidelines

### Input Components

- Every numeric input uses `SliderInput.tsx` — a compound component with synchronized slider + text field.
- Slider for exploration (drag), text for precision (type exact value).
- All inputs fire `onChange` which feeds into the `useCalculator` hook.
- `useCalculator` debounces at 200ms and re-runs the engine on every change. No "Calculate" button.
- Inputs are organized into collapsible accordion sections: "Renting", "Buying", "Advanced" (collapsed by default), "Tax & Financial" (collapsed by default).

### Results Components

- `Verdict.tsx` — Large card at top of results. Shows plain-English verdict, net benefit amount, breakeven year. Color-coded: green = buy wins, blue = rent wins.
- `MonthlyCostBars.tsx` — Two horizontal stacked bars (rent vs own) showing monthly cost breakdown.
- `ResultTabs.tsx` — Tabbed container for charts: Wealth | Costs | Sensitivity | Monte Carlo.
- `YearlyTable.tsx` — Expandable/collapsible table with year-by-year data.

### Chart Components

All charts use Recharts. Follow these conventions:
- Use `ResponsiveContainer` for all charts.
- Color palette: Rent line = `#3B82F6` (blue), Buy line = `#10B981` (green).
- Stacked bar colors: Principal = `#10B981` (green), Interest = `#EF4444` (red), PropTax = `#F59E0B` (amber), Insurance = `#8B5CF6` (purple), Maintenance = `#6B7280` (gray), HOA = `#EC4899` (pink), PMI = `#F97316` (orange).
- Include tooltips on hover showing exact values formatted as currency.
- Charts must have accessible alternative: a data table below or `aria-label` description.

### URL State

All input values sync to URL query parameters via `useUrlState.ts`. This enables shareable URLs. Parameter names should be short but readable:
```
?rent=2000&ri=3&price=400000&down=20&rate=6.8&term=30
&ptax=1.2&ins=0.5&hoa=0&maint=1.5&pmi=0.5
&close=3&sell=6&stay=7&appr=3&inv=7&infl=2.5
&ftax=22&stax=0&file=single&cg=15
```

---

## SEO & Content Requirements

### Every page needs:
- Proper `<title>` and `<meta description>` via Next.js metadata
- Open Graph tags for social sharing
- JSON-LD structured data (FAQPage schema on FAQ page, WebApplication schema on calculator page)

### Content pages (for AdSense approval):
- `/methodology` — "How This Calculator Works" (1,500+ words)
- `/guide` — "The Complete Rent vs Buy Guide 2026" (3,000+ words)
- `/faq` — 15+ questions with FAQ schema (2,000+ words)
- `/cities/[slug]` — City-specific pages with local defaults from `cities.json`

### AdSense setup:
- `AdUnit.tsx` wraps `<ins class="adsbygoogle">` elements
- Ad script loaded in `layout.tsx` with `next/script` strategy="afterInteractive"
- Use `process.env.NEXT_PUBLIC_ADSENSE_ID` for the publisher ID
- Never render ads inside the calculator interaction area

---

## Testing Strategy

### Engine Tests (Priority: HIGH)

The calculation engine must be heavily tested. Financial calculations cannot have bugs — users make life decisions based on these numbers.

```bash
npx vitest run tests/engine/
```

**Required test cases:**

1. **Amortization accuracy** — Verify monthly payments, total interest, and final balance against known mortgage calculators (e.g., Bankrate).

2. **PMI removal** — Test that PMI stops at the correct month when LTV hits 80% (considering both principal paydown AND home appreciation).

3. **Tax deductions:**
   - Standard deduction wins (most common case)
   - Itemized wins (high mortgage + high SALT state)
   - SALT cap binding at $40K (2025-2029)
   - SALT cap at $10K (2030+)
   - Mortgage interest cap at $750K
   - PMI deductibility starting 2026

4. **Breakeven calculation** — Known scenario where buying wins at year 6, verify breakeven reports year 6.

5. **Renter invests difference** — Verify renter's portfolio includes down payment, closing costs, and monthly savings.

6. **Capital gains exemption** — Verify $250K/$500K exemption on home sale.

7. **Edge cases:**
   - 100% down payment (no mortgage)
   - 0% down (maximum PMI)
   - 0% appreciation (stagnant market)
   - Negative appreciation (declining market)
   - Very short hold (1 year)
   - Very long hold (30 years)

8. **Sensitivity analysis** — Verify tornado chart data changes directionally correct when varying each input.

9. **Monte Carlo** — Verify output has 1,000 simulations, mean is near deterministic result, distribution is reasonable.

### Component Tests (Priority: MEDIUM)

- Input panel renders all fields
- Slider and text input stay synchronized
- URL params populate inputs on page load
- Accordion sections expand/collapse

---

## Code Style & Conventions

- **TypeScript strict mode** — No `any`, no implicit returns, all functions typed.
- **Pure functions** in `engine/` — No side effects, no global state. Input → Output.
- **React components** — Functional components only. Use hooks for state.
- **Naming:** camelCase for variables/functions, PascalCase for components/types, SCREAMING_CASE for constants.
- **File naming:** PascalCase for components (`SliderInput.tsx`), camelCase for engine modules (`amortization.ts`).
- **Imports:** Absolute imports using `@/` alias mapped to `src/`.
- **No magic numbers** — All constants (standard deduction, SALT cap, exemptions) live in `defaults.ts` with clear names and comments citing the law or source.
- **Comments** — Comment the *why*, not the *what*. Financial formulas should have inline comments citing the source (IRS pub, tax code section).

---

## Environment Variables

```env
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXX    # Google AdSense publisher ID
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX              # Google Analytics (optional)
NEXT_PUBLIC_SITE_URL=https://ownvsrent.io # For canonical URLs and OG tags
```

---

## Build & Deploy

```bash
# Development
npm run dev

# Run tests
npm run test            # vitest
npm run test:watch      # vitest --watch

# Build for production (static export)
npm run build

# The output in `out/` is deployed to Cloudflare Pages
```

### Next.js Config for Static Export

```typescript
// next.config.ts
const config = {
  output: 'export',
  images: { unoptimized: true },  // No image optimization for static export
  trailingSlash: true,            // Better for static hosting
};
```

---

## Key Reminders

1. **Engine purity** — `src/engine/` must never import from React, Next.js, or any browser API. It should work in Node.js tests.

2. **Accuracy over speed** — Use month-by-month simulation, not annual shortcuts. Users trust this tool for major financial decisions.

3. **Tax law is current** — The OBBBA (signed July 4, 2025) changed SALT caps and PMI deductibility. Our calculator reflects 2026+ law.

4. **No bias** — Do not default to assumptions that favor buying. Use nationally representative midpoints. If the math says rent, say rent.

5. **Show your work** — Every assumption is visible to the user. Every formula is explained in the methodology section. Transparency is our competitive advantage.

6. **Mobile-first** — More than half of traffic will be mobile. Test responsive layout at 375px width.

7. **Performance** — Lighthouse score > 90. No heavy dependencies. Charts lazy-loaded below fold.
