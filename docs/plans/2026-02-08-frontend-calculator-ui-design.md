# Design: Frontend Calculator UI for ownvsrent.io

**Date:** 2026-02-08
**Status:** Approved

## Summary

Build a simple MVP calculator UI with a single-page form, accordion-organized inputs, real-time results, and a wealth-over-time chart. Get it live fast, iterate later.

---

## Page Layout

Three zones on desktop (stacked on mobile):

1. **Header** - Logo, tagline
2. **InputPanel** (left) - Form with accordion sections
3. **ResultsPanel** (right, sticky) - Verdict card + wealth chart

---

## Input Organization

Four accordion sections with 23 total fields:

### Section: Your Rent (expanded by default)
| Field | Type | Default |
|-------|------|---------|
| Monthly rent | $ input | $2,000 |
| Annual rent increase | % slider | 3% |
| Renter insurance | $ input | $30 |

### Section: Home Purchase (expanded by default)
| Field | Type | Default |
|-------|------|---------|
| Purchase price | $ input | $400,000 |
| Down payment | % slider | 20% |
| Mortgage rate | % slider | 6.8% |
| Loan term | select | 30 years |
| Property tax rate | % slider | 1.1% |
| Home insurance rate | % slider | 0.5% |
| HOA monthly | $ input | $0 |
| Maintenance rate | % slider | 1.5% |

### Section: When You Sell (expanded by default)
| Field | Type | Default |
|-------|------|---------|
| Holding period | slider 1-30 | 7 years |
| Annual appreciation | % slider | 3.5% |
| Selling costs | % slider | 8% |

### Section: Tax & Financial (collapsed by default)
| Field | Type | Default |
|-------|------|---------|
| Filing status | select | Single |
| Marginal tax rate | % slider | 22% |
| State tax rate | % slider | 5% |
| Capital gains rate | % slider | 15% |
| Investment return | % slider | 7% |
| PMI rate | % slider | 0.75% |
| Closing costs | % slider | 3% |
| Security deposit | # months | 1 |
| Broker fee | % slider | 0% |

---

## Results Display

### Verdict Card
- Color-coded background: Teal (rent wins) or Amber (buy wins)
- Large headline: "Renting saves you $X" or "Buying saves you $X"
- Subtext: "over N years"
- Monthly comparison: "$X rent vs $Y owning"
- Break-even: "Year X" or "Never"

### Wealth Chart
- Recharts LineChart
- Two lines: Renter Wealth (blue) vs Buyer Wealth (green)
- X-axis: Years (1 to holding period)
- Y-axis: Net wealth ($)
- Tooltip on hover
- Vertical dashed line at break-even year

---

## Component Architecture

```
App
├── Header
├── Calculator
│   ├── InputPanel
│   │   ├── AccordionSection (Rent)
│   │   ├── AccordionSection (Purchase)
│   │   ├── AccordionSection (Selling)
│   │   └── AccordionSection (Tax)
│   └── ResultsPanel
│       ├── VerdictCard
│       └── WealthChart
└── Footer
```

---

## State Management

Single `useCalculator` hook:
- Holds all 23 input fields with defaults
- Holds API response (results)
- Debounced API call on input change (300ms)
- Loading and error states

Data flow:
```
Input change → setInputs → debounce 300ms → POST /api/calculate → setResults → re-render
```

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/hooks/useCalculator.ts` | State + API logic |
| `src/components/Calculator.tsx` | Main layout container |
| `src/components/InputPanel.tsx` | Form with accordions |
| `src/components/AccordionSection.tsx` | Collapsible section |
| `src/components/SliderInput.tsx` | Slider + text input combo |
| `src/components/VerdictCard.tsx` | Result summary card |
| `src/components/WealthChart.tsx` | Recharts line chart |
| `src/lib/api.ts` | API client |
| `src/lib/defaults.ts` | Default input values |
| `src/lib/formatters.ts` | Currency/percent formatting |

---

## Error Handling

- **Loading:** Skeleton pulse on first load, subtle spinner on updates
- **Network error:** Auto-retry 3x with inline banner
- **Validation error:** Red border + field-level message
- **Server error:** "Calculation failed" banner

---

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| Rent = 0 | Allowed |
| Down payment = 100% | Works (no mortgage) |
| Holding period = 1 yr | Warning about costs |
| Buy never wins | Break-even shows "Never" |
| Toss-up (< $1,000 diff) | "Too close to call" |

---

## Mobile Responsiveness

- Stack InputPanel above ResultsPanel on < 1024px
- VerdictCard flows normally (not sticky)
- Chart maintains aspect ratio

---

## NOT in MVP (Future)

- Sensitivity tornado chart
- Monte Carlo visualization
- URL state sync (shareable links)
- City-specific defaults
- PDF export
- Scenario comparison

---

## Tech Stack

- React 18 + TypeScript
- Tailwind CSS (custom colors configured)
- Recharts
- No additional UI libraries

---

## Implementation Order

1. `lib/defaults.ts` + `lib/formatters.ts`
2. `lib/api.ts`
3. `hooks/useCalculator.ts`
4. `components/SliderInput.tsx`
5. `components/AccordionSection.tsx`
6. `components/InputPanel.tsx`
7. `components/VerdictCard.tsx`
8. `components/WealthChart.tsx`
9. `components/Calculator.tsx`
10. Update `App.tsx`
