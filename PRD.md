# PRD: ownvsrent.io — Rent vs. Buy "Real Math" Calculator

## Product Overview

### Vision
A free, client-side rent vs. buy calculator that actually does the math right — addressing every shortcoming that Reddit, Bogleheads, and HackerNews communities have documented about existing tools from Zillow, NerdWallet, and others. The goal is to become the go-to "honest" calculator that treats users like intelligent adults, not lead-gen prospects for mortgage companies.

### One-Liner
**"The rent vs. buy calculator that doesn't lie to you."**

### Target URL
**ownvsrent.io**

### Monetization
Google AdSense — targeting real estate and personal finance keywords (CPC $15–30+). At 50k monthly visits, this niche can generate $2,000–5,000/month in ad revenue vs. a generic utility tool needing 500k+ visits for the same earnings.

---

## Problem Statement

### What existing calculators get wrong (Reddit-validated)

Every major rent vs. buy calculator has documented flaws that communities like r/personalfinance, r/RealEstate, and Bogleheads have complained about for years:

1. **Opportunity cost of down payment is ignored or underweighted.** A $100k down payment at 8% annual returns becomes ~$1M in 30 years. Most calculators either skip this entirely or bury it in "advanced settings" with a default of 0%.

2. **Maintenance costs are laughably low.** Zillow defaults to ~$100/month on a $500k home. Realistic long-term average is $800–1,200/month (1.5–3% of home value annually). Old housing stock, deferred maintenance, and major replacements (roof, HVAC, foundation) are never modeled.

3. **Appreciation is assumed at unrealistic rates.** Many calculators default to 5–7%. Historical real (inflation-adjusted) appreciation is closer to 0.2–1% nationally (per Robert Shiller). Nominal is ~3–4%. One percentage point changes the outcome by hundreds of thousands of dollars over 30 years.

4. **Tax benefits are overstated.** Post-2017 TCJA, only ~10% of filers itemize. Most calculators assume the user will itemize and deduct mortgage interest. The SALT cap ($10k) is also frequently ignored. Many homeowners get zero incremental tax benefit.

5. **Selling costs are hidden or minimized.** Real estate commissions (5–6%), closing costs (1–2%), and prep costs (1–3%) can eat 7–10% of sale price. On a $600k home that's $42k–60k gone from equity.

6. **Rent growth is undermodeled.** Some markets see 7–10% annual rent growth (Bay Area, Austin, Miami). Fixed 3% defaults miss the local reality entirely.

7. **PMI disappearance is not modeled.** Calculators that include PMI often keep it for the life of the loan instead of dropping it at 80% LTV.

8. **No scenario comparison.** Users can't easily see "what if appreciation is 2% instead of 4%?" or "what if I stay 5 years vs. 15 years?" side by side.

9. **Mortgage company bias.** Zillow, LendingTree, NerdWallet, and CrossCountry Mortgage all run these calculators as lead-gen tools. Their defaults and framing subtly favor buying.

10. **Standard deduction vs. itemized comparison is absent.** The incremental tax benefit of homeownership is the difference between itemized and standard deduction, not the full mortgage interest amount. Almost no calculator does this correctly.

### Why this matters
The rent vs. buy decision is a $200k–$1M+ financial choice. Getting it wrong by even a few percentage points compounds into life-altering amounts. People deserve a tool that tells the truth.

---

## Target Users

### Primary Personas

| Persona | Description | Pain Point |
|---|---|---|
| **First-time buyer** (25–40) | Browsing Zillow, considering their first purchase | Overwhelmed by variables; wants honest guidance, not a sales pitch |
| **r/personalfinance power user** | Financially literate, skeptical of default assumptions | Wants every variable exposed and adjustable; hates hidden assumptions |
| **HCOL renter** | Lives in SF/NYC/Austin, rent is $3k+, feels pressure to buy | Needs to see that renting + investing can beat buying in expensive markets |
| **Relocator** | Moving to a new city, doesn't know local costs | Needs a tool that helps them understand a market they don't know yet |

### Secondary Personas
- Financial advisors linking clients to a neutral tool
- Real estate agents wanting a credible, non-biased resource
- Personal finance bloggers/YouTubers embedding or referencing the calculator

---

## Success Metrics

### North Star Metric
**Monthly organic search traffic** — target 50k monthly visits within 12 months.

### Supporting Metrics

| Metric | Target | Why |
|---|---|---|
| Avg. time on page | > 4 minutes | Indicates engagement with the calculator |
| Calculation completions | > 60% of visitors | Visitors actually run the numbers |
| Scroll depth | > 80% | Visitors read the educational content below |
| Bounce rate | < 45% | Content matches search intent |
| AdSense RPM | > $15 | Finance niche should achieve this |
| Backlinks | > 100 in year 1 | Reddit/HN sharing, finance blog citations |
| Return visitors | > 15% | People come back with different scenarios |

---

## Feature Requirements

### P0 — MVP (Launch)

#### F1: Core Calculator Engine
A comprehensive financial model comparing the total cost of renting vs. buying over a configurable time horizon.

**Buying inputs:**
- Home purchase price
- Down payment ($ and %)
- Mortgage interest rate
- Loan term (15yr / 20yr / 30yr)
- Property tax rate (% of home value, annually)
- Homeowner's insurance (annual)
- HOA fees (monthly)
- PMI rate (auto-calculated if down payment < 20%, auto-removed at 80% LTV)
- Closing costs (% of purchase price, default 2–5%)
- Annual maintenance (% of home value, default 1.5% with tooltip explaining why)
- Home appreciation rate (nominal %)
- Selling costs (% of future sale price, default 8%)

**Renting inputs:**
- Monthly rent
- Annual rent increase rate (%)
- Renter's insurance (monthly)
- Security deposit (one-time)

**Shared/financial inputs:**
- Time horizon (slider: 1–30 years)
- Annual investment return rate (for opportunity cost calculation)
- Marginal income tax rate
- Filing status (single / married filing jointly)
- Capital gains tax rate (for home sale and investment gains)
- General inflation rate

**Calculation methodology:**
- Month-by-month amortization with running equity tracking
- Opportunity cost: down payment + closing costs + monthly cost differential invested at the specified return rate
- Tax benefit: compare standard deduction vs. itemized (mortgage interest + property tax up to SALT cap) — only the INCREMENTAL benefit counts
- Net worth comparison at each year: (home equity − selling costs) vs. (investment portfolio from renting savings)
- PMI auto-drops when equity reaches 20%
- All nominal values inflation-adjusted for real comparison

#### F2: Results Dashboard
- **Hero verdict**: Clear "Renting saves you $X" or "Buying saves you $X" over the selected time horizon
- **Breakeven year**: "Buying becomes cheaper than renting after year X" (or "Buying never becomes cheaper in this scenario")
- **Cumulative cost chart**: Line chart showing total cost of renting vs. buying over time (year by year)
- **Net worth chart**: Line chart comparing net worth under each scenario
- **Monthly cost breakdown**: Stacked bar chart showing where the money goes each month (principal, interest, taxes, insurance, maintenance, HOA vs. rent + insurance)
- **Equity buildup chart**: Area chart showing home equity growth vs. investment portfolio growth (renter scenario)

#### F3: Assumptions Transparency Panel
Every assumption used in the calculation must be visible and editable. No hidden defaults. A collapsible "Show All Assumptions" panel with:
- Current value of every variable
- The national average / reasonable default for context
- A brief explanation of why this variable matters
- Source links where applicable (e.g., Shiller data for appreciation, IRS for tax brackets)

#### F4: SEO Content Layer
Below the calculator, a well-structured content section targeting long-tail keywords:
- "What most rent vs. buy calculators get wrong" (addressing each flaw documented above)
- "How to think about opportunity cost"
- "Why the standard deduction changed everything"
- "How to estimate realistic maintenance costs"
- "Understanding home appreciation: what the data actually says"
- FAQ section with schema markup

#### F5: Shareable Results
- Generate a unique URL with all parameters encoded (query string or hash)
- "Share this scenario" button that copies the URL
- Open Graph / social meta tags that show the verdict when shared

#### F6: Responsive Design
- Mobile-first design
- Touch-friendly sliders on mobile
- Charts resize cleanly
- Calculator is fully usable without scrolling horizontally on 375px screens

---

### P1 — Post-Launch (Month 2–3)

#### F7: Scenario Comparison Mode
Side-by-side comparison of two scenarios (e.g., "What if I stay 5 years vs. 15 years?" or "What if appreciation is 2% vs. 5%?"). Diff highlighting on the changed variables.

#### F8: Sensitivity Analysis Table
A matrix showing how the verdict changes across two variables simultaneously (e.g., rows = appreciation rate from 0–6%, columns = time horizon from 3–30 years). Color-coded cells (green = buy wins, red = rent wins). This is the "power user" feature that no competitor has and would drive Reddit/HN sharing.

#### F9: City Presets
Dropdown to auto-fill typical values for major metro areas:
- Property tax rates (from county assessor data)
- Median home prices (from Zillow/Redfin public data)
- Median rents (from Zillow Rent Index)
- Historical appreciation rates (from FHFA House Price Index)
- Typical insurance costs

Target top 50 US metros initially.

#### F10: PDF Export
"Download Your Analysis" — generates a clean PDF summary of the scenario, charts, and assumptions. Good for sharing with a spouse, financial advisor, or real estate agent.

---

### P2 — Growth (Month 4–6)

#### F11: Embeddable Widget
Lightweight iframe version that personal finance bloggers can embed on their sites. Drives backlinks and brand awareness.

#### F12: "What Can I Actually Afford?" Module
Adjacent calculator that takes income, debts, and savings to determine realistic purchase price — then feeds directly into the rent vs. buy calculator.

#### F13: Historical Accuracy Backtester
"If you had bought in [city] in [year], here's what would have happened." Uses actual historical data (FHFA HPI, historical mortgage rates, historical rent data) to show how past decisions would have played out.

---

## Technical Architecture

### Core Principles
1. **100% client-side calculation** — no server needed for core functionality. All math runs in the browser.
2. **Zero dependencies for core logic** — the financial engine should be pure TypeScript/JavaScript with no external libraries.
3. **Static site** — deployable to Vercel, Netlify, or Cloudflare Pages. No database, no backend.
4. **Fast** — target < 1s LCP, 100 Lighthouse performance score.

### Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| **Framework** | Next.js (App Router, static export) | SEO-critical (SSG), React ecosystem, easy Vercel deploy |
| **Language** | TypeScript | Type safety for financial calculations — prevents bugs that cost users money |
| **Styling** | Tailwind CSS | Rapid iteration, small bundle, responsive utilities |
| **Charts** | Recharts | Lightweight, React-native, composable, good for line/bar/area |
| **Financial Engine** | Custom pure TS module (`/lib/calculator.ts`) | Testable, no deps, can be unit tested exhaustively |
| **SEO** | Next.js metadata API + next-sitemap | Structured data (FAQ schema, HowTo schema), OG tags |
| **Analytics** | Google Analytics 4 + Google Search Console | Track traffic, conversions, keyword rankings |
| **Ads** | Google AdSense | Auto ads initially, manual placement optimization later |
| **Hosting** | Vercel (free tier) | Zero-config Next.js deploy, edge CDN, custom domain |
| **Testing** | Vitest + React Testing Library | Unit tests for financial engine, component tests for UI |

### Project Structure

```
rent-vs-buy/
├── app/
│   ├── layout.tsx              # Root layout with metadata, analytics, ads
│   ├── page.tsx                # Main calculator page
│   ├── components/
│   │   ├── Calculator/
│   │   │   ├── BuyingInputs.tsx
│   │   │   ├── RentingInputs.tsx
│   │   │   ├── SharedInputs.tsx
│   │   │   ├── InputSlider.tsx       # Reusable slider + number input combo
│   │   │   └── AssumptionsPanel.tsx
│   │   ├── Results/
│   │   │   ├── VerdictHero.tsx       # "Renting saves you $X"
│   │   │   ├── BreakevenDisplay.tsx
│   │   │   ├── CostChart.tsx
│   │   │   ├── NetWorthChart.tsx
│   │   │   ├── MonthlyBreakdown.tsx
│   │   │   └── EquityVsInvestment.tsx
│   │   ├── SEO/
│   │   │   ├── ContentSection.tsx    # Educational articles below calculator
│   │   │   └── FAQSection.tsx        # FAQ with schema markup
│   │   └── UI/
│   │       ├── ShareButton.tsx
│   │       ├── Tooltip.tsx
│   │       └── SectionCard.tsx
│   └── globals.css
├── lib/
│   ├── calculator.ts            # Pure financial engine — NO side effects
│   ├── calculator.test.ts       # Exhaustive unit tests
│   ├── types.ts                 # TypeScript interfaces for all inputs/outputs
│   ├── defaults.ts              # Default values with citations
│   ├── tax.ts                   # Tax bracket logic, standard deduction, SALT cap
│   ├── amortization.ts          # Month-by-month mortgage amortization
│   └── formatters.ts            # Currency, percentage, year formatting
├── data/
│   └── city-presets.json        # (P1) Metro area default values
├── public/
│   ├── og-image.png
│   └── favicon.ico
├── claude.md                    # Claude Code project instructions
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

### Financial Engine Specification

The calculator engine (`lib/calculator.ts`) must implement the following month-by-month simulation:

```
For each month m from 1 to (timeHorizon × 12):

  BUYING SCENARIO:
    1. Calculate mortgage payment (fixed, standard amortization formula)
    2. Split payment into principal and interest
    3. Add property tax (monthly portion)
    4. Add homeowner's insurance (monthly portion)
    5. Add HOA fees
    6. Add PMI (if current LTV > 80%)
    7. Add maintenance reserve (monthly portion of annual %)
    8. Track home value: homeValue × (1 + monthlyAppreciation)^m
    9. Track remaining loan balance (decreases with principal payments)
    10. Track equity = homeValue − loanBalance
    11. Calculate tax savings: MAX(0, itemizedDeduction − standardDeduction) × marginalRate
        where itemizedDeduction = mortgageInterest + MIN(propertyTax, SALTcap)
    12. Net monthly cost = payment + tax + insurance + HOA + PMI + maintenance − taxSavings

  RENTING SCENARIO:
    1. Current rent = baseRent × (1 + monthlyRentGrowth)^m
    2. Add renter's insurance
    3. Net monthly cost = rent + insurance

  INVESTMENT TRACKING (Renter):
    1. Month 1: invest (downPayment + closingCosts)
    2. Each month: invest MAX(0, buyMonthlyCost − rentMonthlyCost)
    3. Portfolio grows at monthlyInvestmentReturn

  INVESTMENT TRACKING (Buyer):
    1. Each month: invest MAX(0, rentMonthlyCost − buyMonthlyCost) (if renting costs more)
    2. Portfolio grows at monthlyInvestmentReturn

  At time horizon endpoint:
    BUYER NET WORTH = homeEquity − sellingCosts + buyerInvestmentPortfolio
    RENTER NET WORTH = renterInvestmentPortfolio − securityDeposit (returned)

    Apply capital gains tax to:
      - Home sale profit (with $250k/$500k exclusion)
      - Investment portfolio gains
```

### Critical Calculation Details

**Standard deduction vs. Itemized (2024 values, update annually):**
- Single: $14,600
- Married Filing Jointly: $29,200
- SALT cap: $10,000
- Only the amount ABOVE the standard deduction is an incremental benefit

**PMI removal:**
- Track LTV each month
- When LTV ≤ 80% (via principal paydown + appreciation), PMI drops to $0
- Use original purchase price for LTV calculation (per most lender policies), not current market value

**Capital gains on home sale:**
- Exclusion: $250k (single) / $500k (married) if primary residence owned 2+ years
- Only gains above exclusion are taxed

---

## Design Requirements

### Design Philosophy
- **Trust through transparency**: every number is visible and editable
- **No dark patterns**: defaults are neutral (not biased toward buying)
- **Progressive disclosure**: simple view for casual users, "show all assumptions" for power users
- **Data-first**: charts and numbers take priority over decorative elements

### Visual Design

**Color palette:**
- Primary: Deep navy (#1a2332) — conveys trust and authority
- Accent (Buy): Warm amber/gold (#d4a843)
- Accent (Rent): Cool teal (#2da88e)
- Background: Off-white (#f8f9fa)
- Text: Dark gray (#2d3436)
- Warning/Alert: Muted red (#c0392b)

**Typography:**
- Headlines: Inter or DM Sans (geometric, modern, trustworthy)
- Body: System font stack (performance)
- Numbers/currency: Tabular numerals (monospace-like alignment)

**Layout:**
- Single-page design with anchor navigation
- Calculator inputs in left/right columns (Buy | Rent) on desktop
- Stacked cards on mobile
- Results section appears below inputs after first calculation
- Educational content below results
- Sticky "recalculate" or auto-recalculate on input change

### Interaction Design
- **Sliders + direct number input**: every numeric field has both a slider and a text input
- **Real-time recalculation**: results update as inputs change (debounced at 150ms)
- **Tooltips on every input**: "ⓘ" icon explaining the variable, why it matters, and reasonable range
- **Highlighted defaults**: show when a value differs from the default
- **Input validation**: prevent nonsensical values (negative prices, >100% rates, etc.)

---

## SEO Strategy

### Primary Keywords (High CPC, $15–30+)
- "rent vs buy calculator" (~22k monthly searches)
- "should I rent or buy" (~15k monthly searches)
- "rent or buy calculator" (~8k monthly searches)
- "is it better to rent or buy" (~7k monthly searches)
- "rent vs buy comparison" (~4k monthly searches)

### Long-Tail Keywords (Content Section Targets)
- "rent vs buy calculator with opportunity cost"
- "rent vs buy calculator with investment returns"
- "rent vs buy calculator maintenance costs"
- "is it better to rent or buy in [city]" (× 50 cities)
- "how long do you need to own a home to break even"
- "rent vs buy with standard deduction"
- "true cost of homeownership calculator"
- "rent vs buy 2025" / "rent vs buy 2026"

### Technical SEO
- Static HTML generation (SSG) — search engines get fully rendered content
- FAQ schema markup (JSON-LD)
- HowTo schema for the methodology section
- FinancialProduct schema where applicable
- Canonical URLs
- Sitemap with city-specific pages (P1)
- Core Web Vitals: target all green
- Mobile-first indexing compliant

### Content Marketing Strategy
- Launch post on r/personalfinance: "I built the rent vs buy calculator Reddit has been asking for"
- Cross-post to r/RealEstate, r/firsttimehomebuyer, r/financialplanning
- Submit to HackerNews (Show HN)
- Pitch to personal finance bloggers for backlinks
- Write guest posts about "What Rent vs Buy Calculators Get Wrong"

---

## AdSense Integration

### Placement Strategy (User Experience First)

| Placement | Type | Notes |
|---|---|---|
| Above calculator | Leaderboard (728×90) | One unit, not obtrusive |
| Between inputs and results | In-feed ad | Natural content break |
| Within educational content | In-article ads | Between H2 sections |
| Sidebar (desktop only) | Skyscraper (300×600) | Sticky, scrolls with content |
| After FAQ section | Leaderboard | End-of-content placement |

### Rules
- Never more than 3 ad units visible on screen at once
- No ads inside the calculator itself (inputs or results)
- No interstitials or pop-ups
- No auto-playing video ads
- Ads should not shift layout (use fixed-height containers)

---

## Launch Plan

### Phase 1: MVP Build (Weeks 1–3)
- Week 1: Financial engine + unit tests
- Week 2: UI — inputs, results dashboard, charts
- Week 3: SEO content, meta tags, responsive polish, AdSense setup

### Phase 2: Soft Launch (Week 4)
- Deploy to Vercel
- Submit to Google Search Console
- Get 3–5 trusted people to test and provide feedback
- Fix bugs, calibrate defaults

### Phase 3: Marketing Launch (Week 5)
- Reddit posts (r/personalfinance, r/RealEstate, r/sideproject)
- HackerNews Show HN
- Twitter/X personal finance community
- Begin SEO monitoring

### Phase 4: Iterate (Weeks 6–12)
- City presets (F9)
- Scenario comparison (F7)
- Sensitivity analysis (F8)
- PDF export (F10)
- Respond to user feedback

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Calculation errors | High — financial decisions at stake | Exhaustive unit tests, cross-validate against NYT calculator, allow users to report bugs |
| SEO competition from NerdWallet/Zillow | High — they have massive domain authority | Target long-tail keywords they miss; win on comprehensiveness and transparency |
| AdSense low RPM initially | Medium — revenue depends on traffic | Focus on content quality and backlinks first; RPM will improve with targeted traffic |
| Users confused by too many inputs | Medium — could cause abandonment | Progressive disclosure: show simple view by default, "Advanced" toggle for power users |
| Tax law changes | Low — but impacts calculations | Externalize tax parameters in config; update annually |
| Mortgage rate volatility | Low — users input their own rate | Show current average rates as reference, link to Freddie Mac PMMS |

---

## Competitive Landscape

| Competitor | Strengths | Weaknesses (Our Opportunity) |
|---|---|---|
| **NYT Calculator** | Gold standard UX, trusted brand | Paywalled, can't be shared freely, no sensitivity analysis |
| **NerdWallet** | High DA, good SEO | Lead-gen bias, oversimplified defaults, cluttered with CTAs |
| **Zillow** | Massive traffic, data access | Biased toward buying (they profit from transactions), minimal inputs |
| **Bankrate** | Good content | Generic calculator, poor UX, ad-heavy |
| **Calculator.net** | Clean, ad-supported model | No opportunity cost, no tax sophistication |
| **SmartAsset** | Good financial tools | Lead-gen focused, sells user data to advisors |

**Our differentiation:**
1. No lead-gen — we make money from ads, not from selling your data
2. Every assumption visible and editable — no hidden math
3. Correct tax treatment (standard deduction comparison, SALT cap)
4. Realistic defaults backed by data (not biased toward buying)
5. Sensitivity analysis (no competitor has this)
6. Shareable URLs with full scenario encoded

---

## Appendix: Default Values with Citations

| Variable | Default | Source |
|---|---|---|
| Mortgage rate | Current Freddie Mac 30-yr avg | freddiemac.com/pmms |
| Home appreciation | 3.5% nominal | FHFA House Price Index, 30-yr average |
| Rent growth | 3.5% | BLS CPI Shelter component, 30-yr average |
| Maintenance | 1.5% of home value | National Association of Home Builders |
| Investment return | 7% nominal | S&P 500 long-term average |
| Inflation | 3% | Historical US average |
| Closing costs (buy) | 3% | Bankrate national average |
| Selling costs | 8% | 5–6% commission + 2–3% closing/prep |
| PMI rate | 0.75% | Urban Institute average |
| Property tax | 1.1% | Tax Foundation national median |
| Standard deduction | $14,600 / $29,200 | IRS 2024 (update annually) |
| SALT cap | $10,000 | TCJA 2017, currently in effect |
| Capital gains exclusion | $250k / $500k | IRS Section 121 |
