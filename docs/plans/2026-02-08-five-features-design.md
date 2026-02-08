# Five Features Design Document

> **Goal:** Add 5 new features to enhance the rent vs buy calculator user experience.

**Date:** 2026-02-08

---

## Feature 1: Shareable URLs

**Purpose:** Allow users to share their exact calculator configuration with others via URL.

**Approach:** Sync all calculator inputs to URL query parameters. When the page loads, read params from URL and hydrate the calculator state.

**Implementation:**
- Create `useUrlState` hook that:
  1. On mount: Parse `window.location.search`, decode params, merge with defaults
  2. On input change: Update URL using `history.replaceState()` (no page reload)
  3. Use short parameter names to keep URLs reasonable

**URL Parameter Mapping:**
```
rent=2000           → monthly_rent
ri=3                → annual_rent_increase (as %, so 3 = 0.03)
rins=30             → renter_insurance
sd=1                → security_deposit
bf=0                → broker_fee
price=400000        → purchase_price
down=20             → down_payment_percent (as %, so 20 = 0.20)
rate=6.8            → mortgage_rate (as %, so 6.8 = 0.068)
term=30             → loan_term_years
ptax=1.1            → property_tax_rate
hins=0.5            → home_insurance_rate
hoa=0               → hoa_monthly
maint=1.5           → maintenance_rate
pmi=0.75            → pmi_rate
close=3             → buyer_closing_costs_percent
sell=8              → selling_costs_percent
hold=7              → holding_period_years
appr=3.5            → annual_appreciation
inv=7               → annual_investment_return
ftax=22             → marginal_tax_rate
stax=5              → state_tax_rate
file=single         → filing_status
cg=15               → capital_gains_tax_rate
```

**Share Button:**
- Add "Share" button next to results
- On click: Copy URL to clipboard, show toast "Link copied!"

---

## Feature 2: Itemization Warning

**Purpose:** Alert users when standard deduction beats itemizing (most common case), as many people overestimate the tax benefit of mortgage interest.

**Current State:** API already returns `itemization_beneficial: boolean`.

**Implementation:**
- Add warning banner below VerdictCard when `itemization_beneficial === false`
- Text: "Note: With your inputs, the standard deduction ($15,750 single / $31,500 married) exceeds your itemized deductions. You won't get additional tax benefits from mortgage interest."
- Style: Info/blue tone, not alarming
- Collapsible with "Why?" that explains the math

---

## Feature 3: Scenario Comparison

**Purpose:** Let users compare two different scenarios side-by-side (e.g., 20% down vs 10% down, or 15-year vs 30-year mortgage).

**Approach:** Add "Compare Scenarios" mode that shows two calculators side-by-side.

**Implementation:**
- Add toggle button "Compare Two Scenarios"
- When enabled:
  - Duplicate the input panel into "Scenario A" and "Scenario B"
  - Results panel shows both side-by-side:
    - Two VerdictCards
    - WealthChart with 4 lines (A-Renter, A-Buyer, B-Renter, B-Buyer)
  - Allow linking specific inputs (e.g., "same rent for both")
- State management:
  - `inputs` becomes `{ a: CalculatorInputs, b: CalculatorInputs }`
  - `results` becomes `{ a: CalculatorResults, b: CalculatorResults }`
  - Track which inputs are "linked" between scenarios

**URL for comparison mode:**
- Add `compare=1` flag
- Scenario B params use `b_` prefix: `b_price=500000`, `b_down=10`

---

## Feature 4: Rent Equivalent Display

**Purpose:** Help users understand what buying "costs" in rental terms. Shows: "Buying this home is like paying $X/month in rent."

**Calculation:** Rent equivalent = Total cost of ownership (over holding period) / (holding period months)

More precisely:
- Total ownership cost = All monthly costs + closing costs + selling costs + opportunity cost of down payment - equity built - appreciation
- Divide by months held
- This gives the "true cost" of ownership as monthly rent equivalent

**API Change Required:**
- Add `rent_equivalent` to `CalculatorResults` (backend calculation)
- Formula: `(total_buy_outflow - final_equity) / holding_months`

**UI:**
- Show below monthly comparison: "Equivalent Rent: $X/mo"
- Add tooltip explaining the concept

---

## Feature 5: City Presets

**Purpose:** Pre-fill calculator with city-specific defaults (median rent, typical HOA, property tax rate) to give users a realistic starting point.

**Approach:** Static JSON file with city data (no external API dependency for MVP).

**Data Source:** Compile from public sources:
- Zillow/Redfin median rent data
- State property tax rates (public records)
- Average HOA by city type (condo vs single-family)

**Implementation:**
- Create `frontend/src/data/cities.json`:
```json
[
  {
    "name": "New York City, NY",
    "slug": "nyc",
    "monthly_rent": 3500,
    "property_tax_rate": 0.009,
    "hoa_monthly": 800,
    "state_tax_rate": 0.0685,
    "median_home_price": 750000,
    "home_insurance_rate": 0.004
  },
  {
    "name": "Austin, TX",
    "slug": "austin",
    "monthly_rent": 1800,
    "property_tax_rate": 0.022,
    "hoa_monthly": 200,
    "state_tax_rate": 0,
    "median_home_price": 450000,
    "home_insurance_rate": 0.006
  }
  // ... more cities
]
```

**UI:**
- Add dropdown at top of InputPanel: "Start with city defaults"
- Options: National Average (default), NYC, SF, Austin, Miami, Chicago, Denver, Seattle, Boston, LA
- On select: Apply city presets to relevant fields, keep other fields at defaults

---

## Priority Order

1. **Shareable URLs** - High impact, low complexity
2. **Itemization Warning** - Data already exists, just UI
3. **Rent Equivalent** - Requires backend change, but high value
4. **City Presets** - Static data, moderate effort
5. **Scenario Comparison** - Most complex, do last

---

## Files to Create/Modify

| Feature | Files |
|---------|-------|
| Shareable URLs | `hooks/useUrlState.ts`, modify `useCalculator.ts`, add Share button to `Calculator.tsx` |
| Itemization Warning | Add warning to `VerdictCard.tsx` |
| Rent Equivalent | Backend: add to calculation, Frontend: display in `VerdictCard.tsx` |
| City Presets | `data/cities.json`, `components/CitySelect.tsx`, modify `InputPanel.tsx` |
| Scenario Comparison | `hooks/useScenarioCompare.ts`, `components/ScenarioToggle.tsx`, major refactor of `Calculator.tsx` |
