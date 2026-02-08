# Five Features Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement 5 new features: Shareable URLs, Itemization Warning, Rent Equivalent, City Presets, Scenario Comparison.

**Architecture:** Each feature builds incrementally. URL state enables sharing. Warning uses existing API data. Rent equivalent needs backend+frontend. City presets are static data. Scenario comparison is a major refactor.

**Tech Stack:** React 19, TypeScript, Tailwind CSS

---

## Task 1: Create useUrlState Hook

**Files:**
- Create: `frontend/src/hooks/useUrlState.ts`
- Modify: `frontend/src/hooks/useCalculator.ts`

**Step 1: Create useUrlState.ts**

```typescript
// frontend/src/hooks/useUrlState.ts
import { useCallback, useEffect, useRef } from 'react';
import { DEFAULT_INPUTS, type CalculatorInputs } from '../lib/defaults';

// Short URL param names → input keys
const PARAM_MAP: Record<string, keyof CalculatorInputs> = {
  rent: 'monthly_rent',
  ri: 'annual_rent_increase',
  rins: 'renter_insurance',
  sd: 'security_deposit',
  bf: 'broker_fee',
  price: 'purchase_price',
  down: 'down_payment_percent',
  rate: 'mortgage_rate',
  term: 'loan_term_years',
  ptax: 'property_tax_rate',
  hins: 'home_insurance_rate',
  hoa: 'hoa_monthly',
  maint: 'maintenance_rate',
  pmi: 'pmi_rate',
  close: 'buyer_closing_costs_percent',
  sell: 'selling_costs_percent',
  hold: 'holding_period_years',
  appr: 'annual_appreciation',
  inv: 'annual_investment_return',
  ftax: 'marginal_tax_rate',
  stax: 'state_tax_rate',
  file: 'filing_status',
  cg: 'capital_gains_tax_rate',
};

// Reverse map: input keys → short param names
const KEY_TO_PARAM: Record<keyof CalculatorInputs, string> = Object.fromEntries(
  Object.entries(PARAM_MAP).map(([param, key]) => [key, param])
) as Record<keyof CalculatorInputs, string>;

// Percent fields that are stored as decimals (0.03) but shown as percentages (3)
const PERCENT_FIELDS = new Set([
  'annual_rent_increase', 'down_payment_percent', 'mortgage_rate',
  'property_tax_rate', 'home_insurance_rate', 'maintenance_rate',
  'pmi_rate', 'buyer_closing_costs_percent', 'selling_costs_percent',
  'annual_appreciation', 'annual_investment_return', 'marginal_tax_rate',
  'state_tax_rate', 'capital_gains_tax_rate', 'broker_fee',
]);

export function parseUrlInputs(): Partial<CalculatorInputs> {
  const params = new URLSearchParams(window.location.search);
  const parsed: Partial<CalculatorInputs> = {};

  for (const [param, key] of Object.entries(PARAM_MAP)) {
    const value = params.get(param);
    if (value === null) continue;

    if (key === 'filing_status') {
      if (value === 'single' || value === 'married') {
        parsed[key] = value;
      }
    } else if (key === 'loan_term_years') {
      const num = parseInt(value, 10);
      if ([10, 15, 20, 25, 30].includes(num)) {
        parsed[key] = num as 10 | 15 | 20 | 25 | 30;
      }
    } else {
      let num = parseFloat(value);
      if (!isNaN(num)) {
        // Convert percentages back to decimals
        if (PERCENT_FIELDS.has(key)) {
          num = num / 100;
        }
        (parsed as Record<string, number>)[key] = num;
      }
    }
  }

  return parsed;
}

export function buildUrlParams(inputs: CalculatorInputs): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(inputs) as [keyof CalculatorInputs, unknown][]) {
    const param = KEY_TO_PARAM[key];
    if (!param) continue;

    // Only include non-default values
    if (value === DEFAULT_INPUTS[key]) continue;

    if (key === 'filing_status' || key === 'loan_term_years') {
      params.set(param, String(value));
    } else if (PERCENT_FIELDS.has(key)) {
      // Convert decimals to percentages for URL
      params.set(param, String(Math.round((value as number) * 10000) / 100));
    } else {
      params.set(param, String(value));
    }
  }

  return params.toString();
}

export function useUrlState(
  inputs: CalculatorInputs,
  setInputs: (inputs: CalculatorInputs) => void
) {
  const initialized = useRef(false);

  // On mount: parse URL and set initial inputs
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const urlInputs = parseUrlInputs();
    if (Object.keys(urlInputs).length > 0) {
      setInputs({ ...DEFAULT_INPUTS, ...urlInputs });
    }
  }, [setInputs]);

  // On input change: update URL
  useEffect(() => {
    if (!initialized.current) return;

    const params = buildUrlParams(inputs);
    const newUrl = params ? `${window.location.pathname}?${params}` : window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  }, [inputs]);

  // Copy current URL to clipboard
  const copyUrl = useCallback(async (): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      return true;
    } catch {
      return false;
    }
  }, []);

  return { copyUrl };
}
```

**Step 2: Modify useCalculator.ts to use URL state**

Add to useCalculator.ts:
- Import useUrlState
- Change initial state to use URL params
- Pass copyUrl through the return

```typescript
// Add near top of useCalculator.ts
import { parseUrlInputs, useUrlState } from './useUrlState';

// Change useState initial value
const [inputs, setInputs] = useState<CalculatorInputs>(() => {
  const urlInputs = parseUrlInputs();
  return { ...DEFAULT_INPUTS, ...urlInputs };
});

// Add inside useCalculator function, after state declarations
const { copyUrl } = useUrlState(inputs, setInputs);

// Add copyUrl to return
return { inputs, setInput, setInputs, results, loading, error, copyUrl };
```

**Step 3: Build and verify**

Run: `cd frontend && npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add frontend/src/hooks/useUrlState.ts frontend/src/hooks/useCalculator.ts
git commit -m "feat: add URL state sync for shareable calculator links"
```

---

## Task 2: Add Share Button

**Files:**
- Modify: `frontend/src/components/Calculator.tsx`

**Step 1: Add Share button and toast**

```typescript
// Add to Calculator.tsx imports
import { useState } from 'react';

// Inside Calculator component, add state for toast
const [showToast, setShowToast] = useState(false);

// Add copyUrl to destructuring
const { inputs, setInput, results, loading, error, copyUrl } = useCalculator();

// Add share handler
const handleShare = async () => {
  const success = await copyUrl();
  if (success) {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  }
};

// Add Share button above VerdictCard in JSX
<div className="flex justify-end mb-2">
  <button
    onClick={handleShare}
    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
  >
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
    Share
  </button>
</div>

// Add toast notification at bottom of component
{showToast && (
  <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
    Link copied to clipboard!
  </div>
)}
```

**Step 2: Commit**

```bash
git add frontend/src/components/Calculator.tsx
git commit -m "feat: add share button with copy-to-clipboard"
```

---

## Task 3: Add Itemization Warning

**Files:**
- Modify: `frontend/src/components/VerdictCard.tsx`

**Step 1: Add warning banner**

Add below the break-even section in VerdictCard:

```typescript
// Add new prop to VerdictCardProps
interface VerdictCardProps {
  results: CalculatorResults;
  holdingPeriod: number;
  filingStatus: 'single' | 'married';
}

// Add filingStatus to destructuring
export function VerdictCard({ results, holdingPeriod, filingStatus }: VerdictCardProps) {

// Add itemization warning section after break-even div
{!results.itemization_beneficial && (
  <div className="mt-4 pt-4 border-t border-gray-200">
    <div className="bg-blue-50 rounded-lg p-4">
      <div className="flex gap-3">
        <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="text-sm text-blue-900 font-medium">Standard deduction is better for you</p>
          <p className="text-sm text-blue-700 mt-1">
            With your inputs, the standard deduction ({filingStatus === 'married' ? '$31,500' : '$15,750'})
            exceeds your itemized deductions. You won't get additional tax savings from mortgage interest.
          </p>
        </div>
      </div>
    </div>
  </div>
)}
```

**Step 2: Update Calculator.tsx to pass filingStatus**

```typescript
<VerdictCard
  results={results}
  holdingPeriod={inputs.holding_period_years}
  filingStatus={inputs.filing_status}
/>
```

**Step 3: Commit**

```bash
git add frontend/src/components/VerdictCard.tsx frontend/src/components/Calculator.tsx
git commit -m "feat: add itemization warning when standard deduction is better"
```

---

## Task 4: Add Rent Equivalent (Backend)

**Files:**
- Modify: `api/calculator.py`

**Step 1: Add rent_equivalent calculation**

In the calculate function, after computing final values, add:

```python
# Calculate rent equivalent
# Total ownership cost = all outflows - final equity
total_buy_outflow = sum(s.total_buy_cost for s in monthly_snapshots)
total_buy_outflow += down_payment + buyer_closing_costs  # upfront costs
total_buy_outflow += selling_costs  # when selling
total_buy_outflow -= final_home_equity  # subtract what you keep

# True monthly cost of ownership
holding_months = holding_period_years * 12
rent_equivalent = total_buy_outflow / holding_months

# Add to response
response["rent_equivalent"] = round(rent_equivalent, 2)
```

**Step 2: Update API types**

Add to the response model:
```python
rent_equivalent: float
```

**Step 3: Commit**

```bash
git add api/calculator.py
git commit -m "feat: add rent_equivalent calculation to API"
```

---

## Task 5: Add Rent Equivalent (Frontend)

**Files:**
- Modify: `frontend/src/lib/api.ts`
- Modify: `frontend/src/components/VerdictCard.tsx`

**Step 1: Update API types**

Add to CalculatorResults interface:
```typescript
rent_equivalent: number;
```

**Step 2: Display in VerdictCard**

Add after Monthly Comparison section:

```typescript
{/* Rent Equivalent */}
<div className="mt-4 pt-4 border-t border-gray-200">
  <div className="flex items-center gap-2">
    <span className="text-gray-500 text-sm">Rent Equivalent:</span>
    <span className="text-gray-900 font-medium text-lg">
      {formatCurrency(results.rent_equivalent)}/mo
    </span>
    <div className="relative group">
      <button
        type="button"
        className="text-gray-400 hover:text-gray-600"
        aria-label="What is rent equivalent?"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
      <div className="absolute left-0 bottom-full mb-2 z-50 w-64 p-3 text-xs text-gray-700 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
        <p>This is your true monthly cost of ownership, accounting for all costs minus equity built. Compare this directly to rent.</p>
      </div>
    </div>
  </div>
</div>
```

**Step 3: Commit**

```bash
git add frontend/src/lib/api.ts frontend/src/components/VerdictCard.tsx
git commit -m "feat: display rent equivalent in results"
```

---

## Task 6: Create City Data

**Files:**
- Create: `frontend/src/data/cities.ts`

**Step 1: Create cities data file**

```typescript
// frontend/src/data/cities.ts
export interface CityPreset {
  name: string;
  slug: string;
  monthly_rent: number;
  purchase_price: number;
  property_tax_rate: number;
  home_insurance_rate: number;
  hoa_monthly: number;
  state_tax_rate: number;
}

export const CITIES: CityPreset[] = [
  {
    name: 'National Average',
    slug: 'national',
    monthly_rent: 2000,
    purchase_price: 400000,
    property_tax_rate: 0.011,
    home_insurance_rate: 0.005,
    hoa_monthly: 0,
    state_tax_rate: 0.05,
  },
  {
    name: 'New York City, NY',
    slug: 'nyc',
    monthly_rent: 3800,
    purchase_price: 750000,
    property_tax_rate: 0.009,
    home_insurance_rate: 0.004,
    hoa_monthly: 900,
    state_tax_rate: 0.0685,
  },
  {
    name: 'San Francisco, CA',
    slug: 'sf',
    monthly_rent: 3200,
    purchase_price: 1100000,
    property_tax_rate: 0.0118,
    home_insurance_rate: 0.003,
    hoa_monthly: 600,
    state_tax_rate: 0.093,
  },
  {
    name: 'Los Angeles, CA',
    slug: 'la',
    monthly_rent: 2800,
    purchase_price: 850000,
    property_tax_rate: 0.0118,
    home_insurance_rate: 0.004,
    hoa_monthly: 400,
    state_tax_rate: 0.093,
  },
  {
    name: 'Seattle, WA',
    slug: 'seattle',
    monthly_rent: 2400,
    purchase_price: 700000,
    property_tax_rate: 0.009,
    home_insurance_rate: 0.003,
    hoa_monthly: 350,
    state_tax_rate: 0,
  },
  {
    name: 'Austin, TX',
    slug: 'austin',
    monthly_rent: 1900,
    purchase_price: 480000,
    property_tax_rate: 0.022,
    home_insurance_rate: 0.006,
    hoa_monthly: 150,
    state_tax_rate: 0,
  },
  {
    name: 'Denver, CO',
    slug: 'denver',
    monthly_rent: 2100,
    purchase_price: 550000,
    property_tax_rate: 0.006,
    home_insurance_rate: 0.004,
    hoa_monthly: 200,
    state_tax_rate: 0.0455,
  },
  {
    name: 'Miami, FL',
    slug: 'miami',
    monthly_rent: 2600,
    purchase_price: 550000,
    property_tax_rate: 0.009,
    home_insurance_rate: 0.012,
    hoa_monthly: 500,
    state_tax_rate: 0,
  },
  {
    name: 'Chicago, IL',
    slug: 'chicago',
    monthly_rent: 2000,
    purchase_price: 350000,
    property_tax_rate: 0.021,
    home_insurance_rate: 0.005,
    hoa_monthly: 350,
    state_tax_rate: 0.0495,
  },
  {
    name: 'Boston, MA',
    slug: 'boston',
    monthly_rent: 3100,
    purchase_price: 700000,
    property_tax_rate: 0.0109,
    home_insurance_rate: 0.004,
    hoa_monthly: 450,
    state_tax_rate: 0.05,
  },
  {
    name: 'Phoenix, AZ',
    slug: 'phoenix',
    monthly_rent: 1700,
    purchase_price: 420000,
    property_tax_rate: 0.006,
    home_insurance_rate: 0.005,
    hoa_monthly: 100,
    state_tax_rate: 0.025,
  },
  {
    name: 'Atlanta, GA',
    slug: 'atlanta',
    monthly_rent: 1800,
    purchase_price: 380000,
    property_tax_rate: 0.009,
    home_insurance_rate: 0.006,
    hoa_monthly: 150,
    state_tax_rate: 0.055,
  },
];
```

**Step 2: Commit**

```bash
git add frontend/src/data/cities.ts
git commit -m "feat: add city presets data for 12 major cities"
```

---

## Task 7: Add City Selector

**Files:**
- Create: `frontend/src/components/CitySelect.tsx`
- Modify: `frontend/src/components/InputPanel.tsx`
- Modify: `frontend/src/hooks/useCalculator.ts`

**Step 1: Create CitySelect component**

```typescript
// frontend/src/components/CitySelect.tsx
import { CITIES, type CityPreset } from '../data/cities';

interface CitySelectProps {
  onSelect: (city: CityPreset) => void;
  selectedSlug: string | null;
}

export function CitySelect({ onSelect, selectedSlug }: CitySelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-600">Start with city defaults</label>
      <select
        value={selectedSlug || 'national'}
        onChange={(e) => {
          const city = CITIES.find((c) => c.slug === e.target.value);
          if (city) onSelect(city);
        }}
        className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-300"
      >
        {CITIES.map((city) => (
          <option key={city.slug} value={city.slug}>
            {city.name}
          </option>
        ))}
      </select>
    </div>
  );
}
```

**Step 2: Add city selector to InputPanel**

```typescript
// Add imports
import { CitySelect } from './CitySelect';
import type { CityPreset } from '../data/cities';

// Add prop
interface InputPanelProps {
  inputs: CalculatorInputs;
  setInput: <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => void;
  onCitySelect: (city: CityPreset) => void;
  selectedCity: string | null;
}

// Add to component before accordion sections
<div className="mb-6">
  <CitySelect onSelect={onCitySelect} selectedSlug={selectedCity} />
</div>
```

**Step 3: Update useCalculator to handle city selection**

```typescript
// Add state for selected city
const [selectedCity, setSelectedCity] = useState<string | null>(null);

// Add city selection handler
const handleCitySelect = useCallback((city: CityPreset) => {
  setSelectedCity(city.slug);
  setInputs(prev => ({
    ...prev,
    monthly_rent: city.monthly_rent,
    purchase_price: city.purchase_price,
    property_tax_rate: city.property_tax_rate,
    home_insurance_rate: city.home_insurance_rate,
    hoa_monthly: city.hoa_monthly,
    state_tax_rate: city.state_tax_rate,
  }));
}, []);

// Add to return
return { ..., handleCitySelect, selectedCity };
```

**Step 4: Update Calculator.tsx to wire it up**

```typescript
const { inputs, setInput, results, loading, error, copyUrl, handleCitySelect, selectedCity } = useCalculator();

<InputPanel
  inputs={inputs}
  setInput={setInput}
  onCitySelect={handleCitySelect}
  selectedCity={selectedCity}
/>
```

**Step 5: Commit**

```bash
git add frontend/src/components/CitySelect.tsx frontend/src/components/InputPanel.tsx frontend/src/hooks/useCalculator.ts frontend/src/components/Calculator.tsx
git commit -m "feat: add city preset selector with 12 major cities"
```

---

## Task 8: Add Scenario Comparison Mode

**Files:**
- Create: `frontend/src/hooks/useScenarioCompare.ts`
- Create: `frontend/src/components/ScenarioTabs.tsx`
- Modify: `frontend/src/components/Calculator.tsx`
- Modify: `frontend/src/components/WealthChart.tsx`

**Step 1: Create useScenarioCompare hook**

```typescript
// frontend/src/hooks/useScenarioCompare.ts
import { useState, useCallback, useEffect, useRef } from 'react';
import { calculate, type CalculatorResults } from '../lib/api';
import { DEFAULT_INPUTS, type CalculatorInputs } from '../lib/defaults';

interface ScenarioState {
  a: CalculatorInputs;
  b: CalculatorInputs;
}

interface ScenarioResults {
  a: CalculatorResults | null;
  b: CalculatorResults | null;
}

export function useScenarioCompare() {
  const [enabled, setEnabled] = useState(false);
  const [inputs, setInputs] = useState<ScenarioState>({
    a: DEFAULT_INPUTS,
    b: DEFAULT_INPUTS,
  });
  const [results, setResults] = useState<ScenarioResults>({ a: null, b: null });
  const [loading, setLoading] = useState({ a: false, b: false });
  const debounceRef = useRef<{ a: ReturnType<typeof setTimeout> | null; b: ReturnType<typeof setTimeout> | null }>({
    a: null,
    b: null,
  });

  const setScenarioInput = useCallback(
    <K extends keyof CalculatorInputs>(
      scenario: 'a' | 'b',
      key: K,
      value: CalculatorInputs[K]
    ) => {
      setInputs((prev) => ({
        ...prev,
        [scenario]: { ...prev[scenario], [key]: value },
      }));
    },
    []
  );

  const runCalculation = useCallback(async (scenario: 'a' | 'b', currentInputs: CalculatorInputs) => {
    setLoading((prev) => ({ ...prev, [scenario]: true }));
    try {
      const data = await calculate(currentInputs);
      setResults((prev) => ({ ...prev, [scenario]: data }));
    } finally {
      setLoading((prev) => ({ ...prev, [scenario]: false }));
    }
  }, []);

  // Debounced calculation for scenario A
  useEffect(() => {
    if (!enabled) return;
    if (debounceRef.current.a) clearTimeout(debounceRef.current.a);
    debounceRef.current.a = setTimeout(() => runCalculation('a', inputs.a), 300);
    return () => {
      if (debounceRef.current.a) clearTimeout(debounceRef.current.a);
    };
  }, [inputs.a, enabled, runCalculation]);

  // Debounced calculation for scenario B
  useEffect(() => {
    if (!enabled) return;
    if (debounceRef.current.b) clearTimeout(debounceRef.current.b);
    debounceRef.current.b = setTimeout(() => runCalculation('b', inputs.b), 300);
    return () => {
      if (debounceRef.current.b) clearTimeout(debounceRef.current.b);
    };
  }, [inputs.b, enabled, runCalculation]);

  // Initial calculation when enabling
  useEffect(() => {
    if (enabled) {
      runCalculation('a', inputs.a);
      runCalculation('b', inputs.b);
    }
  }, [enabled]);

  const toggle = useCallback(() => setEnabled((prev) => !prev), []);

  return {
    enabled,
    toggle,
    inputs,
    setScenarioInput,
    results,
    loading,
  };
}
```

**Step 2: Create ScenarioTabs component**

```typescript
// frontend/src/components/ScenarioTabs.tsx
interface ScenarioTabsProps {
  enabled: boolean;
  onToggle: () => void;
}

export function ScenarioTabs({ enabled, onToggle }: ScenarioTabsProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <button
        onClick={onToggle}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          enabled
            ? 'bg-gray-900 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        {enabled ? 'Exit Comparison' : 'Compare Scenarios'}
      </button>
      {enabled && (
        <span className="text-sm text-gray-500">
          Compare two different scenarios side-by-side
        </span>
      )}
    </div>
  );
}
```

**Step 3: Update WealthChart for comparison mode**

Add optional scenario B data:

```typescript
interface WealthChartProps {
  results: CalculatorResults;
  resultsB?: CalculatorResults | null;
  labels?: { a: string; b: string };
}

// If resultsB provided, render 4 lines with different colors/labels
```

**Step 4: Update Calculator.tsx for comparison mode**

Conditionally render dual input panels and merged results when comparison is enabled.

**Step 5: Commit**

```bash
git add frontend/src/hooks/useScenarioCompare.ts frontend/src/components/ScenarioTabs.tsx frontend/src/components/WealthChart.tsx frontend/src/components/Calculator.tsx
git commit -m "feat: add scenario comparison mode for side-by-side analysis"
```

---

## Task 9: Test All Features

**Step 1: Manual testing checklist**

- [ ] Open app, change inputs, verify URL updates
- [ ] Copy URL, paste in new tab, verify inputs restored
- [ ] Set down payment below 20%, verify itemization warning appears
- [ ] Verify rent equivalent displays with tooltip
- [ ] Select different cities, verify inputs change
- [ ] Enable comparison mode, set different values, verify both calculate
- [ ] Verify chart shows all 4 lines in comparison mode

**Step 2: Build for production**

Run: `cd frontend && npm run build`

**Step 3: Commit final**

```bash
git add .
git commit -m "feat: complete all 5 new features"
```

---

## Task 10: Deploy

**Step 1: Deploy backend (if rent_equivalent was added)**

```bash
cd api && ./deploy.sh
```

**Step 2: Deploy frontend**

```bash
aws s3 sync frontend/dist/ s3://ownvsrent-frontend --delete
aws cloudfront create-invalidation --distribution-id E2YAX90K1YB9JU --paths "/*"
```

**Step 3: Verify production**

Open: https://ownvsrent.io
Test all 5 features work in production

---

## Summary

| Task | Feature | Files |
|------|---------|-------|
| 1 | URL State Hook | `hooks/useUrlState.ts`, modify `useCalculator.ts` |
| 2 | Share Button | `Calculator.tsx` |
| 3 | Itemization Warning | `VerdictCard.tsx` |
| 4 | Rent Equivalent (Backend) | `api/calculator.py` |
| 5 | Rent Equivalent (Frontend) | `api.ts`, `VerdictCard.tsx` |
| 6 | City Data | `data/cities.ts` |
| 7 | City Selector | `CitySelect.tsx`, `InputPanel.tsx`, `useCalculator.ts` |
| 8 | Scenario Comparison | `useScenarioCompare.ts`, `ScenarioTabs.tsx`, `WealthChart.tsx`, `Calculator.tsx` |
| 9 | Testing | Manual verification |
| 10 | Deploy | S3, CloudFront |

**Total: 10 tasks, ~12 files**
