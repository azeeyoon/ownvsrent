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
| 2026-02-13 | Added Table of Contents to blog posts (H2 headings only), updated skill with blog format guidelines |
| 2026-02-10 | Added blog image support: featured images, OG/Twitter meta tags, `/fetch-blog-image` skill |
| 2026-02-09 | Updated CLAUDE.md to reflect actual Vite + React Router architecture |
| 2026-02-09 | Added SEO enhancements to blog pages (canonical URLs, Open Graph, BreadcrumbList schema, enhanced Article schema) |
| 2026-02-09 | Created `/seo-blog-post` Claude skill for generating SEO-optimized blog posts (~/.claude/skills/seo-blog-post/) |
| 2026-02-09 | Fixed mobile responsiveness (overflow-x-hidden, responsive AdUnit) |
| 2026-02-09 | Added blog section with 6 initial posts |
| 2026-02-09 | Set up AdSense integration (VITE_ADSENSE_ID, display slot: 1442070296, in-article slot: 9767282879) |
| 2026-02-08 | Created 26 city-specific landing pages with SEO content |
| 2026-02-08 | Set up Reddit monitoring guide (reddit-monitor/SETUP.md) — awaiting API approval |

### Pending Tasks
- Reddit API approval (then upgrade monitoring to automated)
- AdSense activation (currently "Getting ready")
- Generate more blog posts using `/seo-blog-post` + `/publish-blog-post` workflow
- Add frontend tests (Vitest configured but no test files yet)
- Build UI for sensitivity analysis and Monte Carlo (backend endpoints ready)

### Claude Skills for Blog Workflow
1. `/seo-blog-post "topic"` - Generates SEO-optimized content, saves to `frontend/src/data/.blog-draft.json`
2. `/fetch-blog-image "slug" "search terms"` - Downloads featured image from Unsplash, saves to `frontend/public/blog/{slug}/featured.jpg`
3. `/publish-blog-post` - Validates draft, adds to blogPosts.ts, builds, commits, deploys, and verifies

### Blog Image Support
- Featured images stored in `frontend/public/blog/{slug}/featured.jpg`
- Images are 1200x630px (OG image format)
- BlogPost interface has optional `featuredImage` field
- BlogPostPage renders hero image and includes og:image/twitter:image meta tags
- BlogIndexPage shows thumbnails with category-colored placeholder fallbacks
- Uses react-markdown with remark-gfm for inline image support in content

### Blog Post Format (2026 Modern Design)

Blog posts are rendered in `BlogPostPage.tsx` using ReactMarkdown with custom styled components.

**Automatic Features:**
- **Table of Contents**: Auto-generated from H2 headings (shows if 3+ headings)
- **Anchor IDs**: H2/H3 headings get slugified IDs for deep linking
- **Smooth scrolling**: TOC links scroll smoothly with `scroll-mt-20` offset

**Markdown Rendering (custom components in `createMarkdownComponents()`):**

| Element | Tailwind Classes |
|---------|------------------|
| H2 | `text-2xl md:text-3xl font-bold text-gray-900 mt-14 mb-6 tracking-tight scroll-mt-20` |
| H3 | `text-xl md:text-2xl font-semibold text-gray-900 mt-10 mb-4 scroll-mt-20` |
| p | `text-gray-700 text-lg leading-[1.8] my-6` |
| ul/li | Blue dot bullet (`w-2 h-2 bg-blue-500 rounded-full`), `gap-3` |
| blockquote | Blue left border, gradient bg `from-blue-50`, rounded-r-xl, italic |
| a | `text-blue-600 hover:text-blue-700 underline decoration-blue-200` |
| table | Rounded border, shadow-sm, hover row highlight |
| img | `rounded-2xl shadow-lg`, figcaption from alt text |
| hr | Gradient fade line `via-gray-300`, `my-12` |
| code | `bg-gray-100 text-gray-800 px-2 py-1 rounded-md font-mono border` |

**Content Writing Guidelines:**
1. Use **4-6 H2 headings** for main sections (appear in TOC)
2. Use H3 sparingly for subsections (won't appear in TOC)
3. Keep paragraphs to **2-4 sentences** for readability
4. Use **blockquotes** for key takeaways or callouts
5. Include **tables** for comparisons (rent vs buy, pros/cons)
6. Add **horizontal rules** (`---`) to separate major topic shifts
7. Always include a **CTA linking to calculator** (`/`)

---

## Project Overview

A free rent vs. buy financial calculator targeting Google AdSense monetization. The site helps users make an informed rent-vs-buy decision with transparent math, sensitivity analysis, and no bias toward either option.

**Read the full PRD:** `PRD.md` in the project root contains the complete product specification, competitive analysis, calculation formulas, and launch roadmap. Refer to it for any product questions.

---

## Tech Stack

- **Backend:** Python 3.12, FastAPI, Pydantic, UV package manager
- **Frontend:** Vite, React 19, TypeScript (strict), Tailwind CSS, Recharts
- **Routing:** React Router DOM 7
- **Testing:** pytest (backend), Vitest (frontend)
- **Deployment:** AWS EC2 (backend API), S3 + CloudFront (frontend static)
- **Infrastructure:** Terraform (EC2, S3, CloudFront, Route53, ACM)

See `docs/plans/2026-02-07-python-fastapi-design.md` for architecture details.

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
# Backend (13 test files covering engine logic)
cd backend
uv run pytest -v

# Frontend (Vitest configured, tests pending)
cd frontend
npm test
```

---

## Architecture

### Core Principle: Engine ≠ UI

The calculation engine lives in `backend/src/ownvsrent/engine/` as **pure Python with no web framework dependencies**. It must be importable and testable without any HTTP context. The FastAPI layer in `api/routes.py` simply wraps the engine.

The frontend in `frontend/src/` is a React SPA that calls the backend API.

### Directory Layout

```
backend/
  src/ownvsrent/
    main.py             → FastAPI app entry point
    api/
      routes.py         → 3 endpoints: /calculate, /sensitivity, /montecarlo
    engine/             → Pure calculation logic (1,759 LOC)
      calculator.py     → Main orchestrator (month-by-month simulation)
      amortization.py   → Mortgage P&I schedule
      taxes.py          → SALT, mortgage interest, PMI deductions
      buying.py         → Home costs: PITI, HOA, maintenance, PMI
      renting.py        → Rent escalation, portfolio growth
      wealth.py         → Final net wealth, selling costs, cap gains
      sensitivity.py    → Tornado chart analysis
      montecarlo.py     → 1,000-sim Monte Carlo
      types.py          → Pydantic models
      defaults.py       → Constants with citations
  tests/                → 13 test files

frontend/
  src/
    pages/              → 9 pages (HomePage, GuidePage, FaqPage, CityPage, BlogPostPage, etc.)
    components/         → 19 components (flat structure)
      Calculator.tsx    → Main calculator with scenario comparison
      InputPanel.tsx    → All input fields in accordions
      VerdictCard.tsx   → Result verdict display
      WealthChart.tsx   → Wealth over time chart
      SliderInput.tsx   → Dual slider + text input
      AdUnit.tsx        → Google AdSense wrapper
      Layout.tsx        → Page layout with nav/footer
    hooks/              → useCalculator, useScenarioCompare, useUrlState
    lib/                → API client, defaults, formatters
    data/               → cities.ts (26 cities), blogPosts.ts (6 posts)
    content/            → Methodology and guide content sections
    router.tsx          → React Router configuration
  public/               → sitemap.xml, favicon, og-image
    blog/               → Featured images for blog posts (per-slug directories)

infrastructure/         → Terraform for AWS (EC2, S3, CloudFront, Route53)
docs/plans/             → 14 design/implementation documents
reddit-monitor/         → Reddit monitoring setup (awaiting API approval)
```

---

## Calculation Engine (`backend/src/ownvsrent/engine/`)

### File Responsibilities

| File | Lines | Purpose |
|------|-------|---------|
| `calculator.py` | 362 | Main entry point — takes inputs, returns results. Orchestrates all sub-modules |
| `amortization.py` | 136 | Mortgage amortization schedule (month-by-month principal, interest, balance) |
| `taxes.py` | 192 | Tax deduction logic: SALT cap (2025-2029 OBBBA $40K, 2030+ $10K), mortgage interest deduction ($750K cap), PMI deductibility (2026+), standard vs. itemized comparison |
| `renting.py` | 123 | Renting cash flows: rent escalation, insurance, investment portfolio growth |
| `buying.py` | 212 | Buying cash flows: PITI, HOA, maintenance, PMI (auto-remove at 80% LTV) |
| `wealth.py` | 158 | Net wealth comparison at sale: home equity, selling costs, capital gains tax (with $250K/$500K exemption), investment portfolio liquidation |
| `sensitivity.py` | 111 | Tornado chart data: varies each key input ±delta, measures impact on net benefit |
| `montecarlo.py` | 119 | 1,000-sim Monte Carlo: Normal distributions for appreciation, returns, rent growth |
| `types.py` | 137 | Pydantic models: CalculatorInputs, MonthlySnapshot, YearlySnapshot, CalculatorResults, SensitivityResult, MonteCarloResult |
| `defaults.py` | 144 | Default input values, constants with citations (OBBBA 2025 law, tax rates) |

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/calculate` | POST | Main calculation — returns verdict, snapshots, breakeven |
| `/api/sensitivity` | POST | Tornado chart data — varies each input ±delta |
| `/api/montecarlo` | POST | 1,000 Monte Carlo simulations |

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

---

## Component Guidelines

### Input Components

- Every numeric input uses `SliderInput.tsx` — a compound component with synchronized slider + text field.
- Slider for exploration (drag), text for precision (type exact value).
- All inputs fire `onChange` which feeds into the `useCalculator` hook.
- `useCalculator` debounces at 200ms and calls the backend API on every change. No "Calculate" button.
- Inputs are organized into collapsible accordion sections: "Renting", "Buying", "Advanced" (collapsed by default), "Tax & Financial" (collapsed by default).

### Results Components

- `VerdictCard.tsx` — Large card at top of results. Shows plain-English verdict, net benefit amount, breakeven year. Color-coded: green = buy wins, blue = rent wins.
- `WealthChart.tsx` — Line chart showing wealth over time for renter vs buyer.
- `YearlyTable.tsx` — Table with year-by-year data.

### Chart Components

All charts use Recharts. Follow these conventions:
- Use `ResponsiveContainer` for all charts.
- Color palette: Rent line = `#3B82F6` (blue), Buy line = `#10B981` (green).
- Stacked bar colors: Principal = `#10B981` (green), Interest = `#EF4444` (red), PropTax = `#F59E0B` (amber), Insurance = `#8B5CF6` (purple), Maintenance = `#6B7280` (gray), HOA = `#EC4899` (pink), PMI = `#F97316` (orange).
- Include tooltips on hover showing exact values formatted as currency.

### URL State

All input values sync to URL query parameters via `useUrlState.ts`. This enables shareable URLs. Parameter names are short but readable:
```
?rent=2000&ri=3&price=400000&down=20&rate=6.8&term=30
&ptax=1.2&ins=0.5&hoa=0&maint=1.5&pmi=0.5
&close=3&sell=6&stay=7&appr=3&inv=7
&ftax=22&stax=0&file=single&cg=15
```

---

## SEO & Content

### Every page has:
- `<title>` and `<meta description>` via React Helmet or inline
- Open Graph tags for social sharing
- JSON-LD structured data (FAQPage, WebApplication, Article, BreadcrumbList schemas)
- Canonical URLs

### Content pages:
- `/methodology` — "How This Calculator Works" (1,500+ words)
- `/guide` — "The Complete Rent vs Buy Guide 2026" (3,000+ words)
- `/faq` — 15+ questions with FAQ schema (2,000+ words)
- `/cities/:slug` — 26 city-specific pages with local defaults
- `/blog` — 6 SEO-optimized blog posts

### AdSense setup:
- `AdUnit.tsx` wraps `<ins class="adsbygoogle">` elements
- Ad script loaded in `index.html`
- Publisher ID: `ca-pub-5942799668034142` (via `VITE_ADSENSE_ID`)
- Display slot: `1442070296`, In-article slot: `9767282879`
- Never render ads inside the calculator interaction area

---

## Testing Strategy

### Backend Engine Tests (Priority: HIGH)

The calculation engine must be heavily tested. Financial calculations cannot have bugs — users make life decisions based on these numbers.

```bash
cd backend
uv run pytest -v
```

**13 test files cover:**
- Amortization accuracy (monthly payments, total interest, final balance)
- PMI removal timing (LTV hits 80% considering appreciation)
- Tax deductions (standard vs itemized, SALT cap, mortgage interest cap, PMI deductibility)
- Breakeven calculation
- Capital gains exemption ($250K/$500K)
- Edge cases (100% down, 0% down, negative appreciation, short/long holds)
- Sensitivity analysis (tornado chart data)
- Monte Carlo simulations

### Frontend Tests (Priority: MEDIUM)

Vitest is configured but test files are not yet written. Tests should cover:
- Input panel renders all fields
- Slider and text input stay synchronized
- URL params populate inputs on page load
- Accordion sections expand/collapse

---

## Code Style & Conventions

### Backend (Python)
- **Type hints everywhere** — All functions typed with Pydantic models
- **Pure functions** in `engine/` — No side effects, no global state. Input → Output.
- **Naming:** snake_case for variables/functions, PascalCase for classes
- **No magic numbers** — All constants in `defaults.py` with comments citing the law

### Frontend (TypeScript/React)
- **TypeScript strict mode** — No `any`, no implicit returns, all functions typed.
- **React components** — Functional components only. Use hooks for state.
- **Naming:** camelCase for variables/functions, PascalCase for components/types, SCREAMING_CASE for constants.
- **File naming:** PascalCase for components (`SliderInput.tsx`), camelCase for utils (`formatters.ts`).
- **Imports:** Relative imports (no alias configured).
- **Comments** — Comment the *why*, not the *what*.

---

## Environment Variables

### Backend
```env
# No env vars required for local development
# Production CORS configured in main.py
```

### Frontend
```env
# .env (development)
VITE_API_URL=http://localhost:8000

# .env.production
VITE_API_URL=https://api.ownvsrent.io
VITE_ADSENSE_ID=ca-pub-5942799668034142
```

---

## Build & Deploy

```bash
# Frontend development
cd frontend
npm run dev

# Frontend build (outputs to dist/)
npm run build

# Frontend tests
npm test

# Backend development
cd backend
uv run uvicorn ownvsrent.main:app --reload --port 8000

# Backend tests
uv run pytest -v
```

### Deployment
- **Frontend:** `dist/` deployed to S3, served via CloudFront CDN
- **Backend:** EC2 instance running Uvicorn behind nginx
- **Infrastructure:** Managed via Terraform in `infrastructure/`

---

## Key Reminders

1. **Engine purity** — `backend/src/ownvsrent/engine/` must never import from FastAPI or any web framework. It should work in pytest without HTTP.

2. **Accuracy over speed** — Use month-by-month simulation, not annual shortcuts. Users trust this tool for major financial decisions.

3. **Tax law is current** — The OBBBA (signed July 4, 2025) changed SALT caps and PMI deductibility. Our calculator reflects 2026+ law.

4. **No bias** — Do not default to assumptions that favor buying. Use nationally representative midpoints. If the math says rent, say rent.

5. **Show your work** — Every assumption is visible to the user. Every formula is explained in the methodology section. Transparency is our competitive advantage.

6. **Mobile-first** — More than half of traffic will be mobile. Test responsive layout at 375px width.

7. **Performance** — Keep bundle size small. Charts lazy-loaded below fold.
