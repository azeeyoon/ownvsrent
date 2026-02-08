# Frontend Calculator UI Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a calculator UI with input form, real-time results, and wealth chart.

**Architecture:** Single-page React app with useCalculator hook managing state and API calls. InputPanel on left, ResultsPanel on right (stacked on mobile). Debounced API calls on input change.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Recharts, Axios

---

### Task 1: Create lib utilities (defaults, formatters, api)

**Files:**
- Create: `frontend/src/lib/defaults.ts`
- Create: `frontend/src/lib/formatters.ts`
- Create: `frontend/src/lib/api.ts`

**Step 1: Create defaults.ts**

```typescript
// frontend/src/lib/defaults.ts
export interface CalculatorInputs {
  // Renting
  monthly_rent: number;
  annual_rent_increase: number;
  renter_insurance: number;
  security_deposit: number;
  broker_fee: number;
  // Buying
  purchase_price: number;
  down_payment_percent: number;
  mortgage_rate: number;
  loan_term_years: 10 | 15 | 20 | 25 | 30;
  property_tax_rate: number;
  home_insurance_rate: number;
  hoa_monthly: number;
  maintenance_rate: number;
  pmi_rate: number;
  buyer_closing_costs_percent: number;
  selling_costs_percent: number;
  // Financial
  holding_period_years: number;
  annual_appreciation: number;
  annual_investment_return: number;
  marginal_tax_rate: number;
  state_tax_rate: number;
  filing_status: 'single' | 'married';
  capital_gains_tax_rate: number;
}

export const DEFAULT_INPUTS: CalculatorInputs = {
  // Renting
  monthly_rent: 2000,
  annual_rent_increase: 0.03,
  renter_insurance: 30,
  security_deposit: 1,
  broker_fee: 0,
  // Buying
  purchase_price: 400000,
  down_payment_percent: 0.20,
  mortgage_rate: 0.068,
  loan_term_years: 30,
  property_tax_rate: 0.011,
  home_insurance_rate: 0.005,
  hoa_monthly: 0,
  maintenance_rate: 0.015,
  pmi_rate: 0.0075,
  buyer_closing_costs_percent: 0.03,
  selling_costs_percent: 0.08,
  // Financial
  holding_period_years: 7,
  annual_appreciation: 0.035,
  annual_investment_return: 0.07,
  marginal_tax_rate: 0.22,
  state_tax_rate: 0.05,
  filing_status: 'single',
  capital_gains_tax_rate: 0.15,
};
```

**Step 2: Create formatters.ts**

```typescript
// frontend/src/lib/formatters.ts
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatCompactCurrency(value: number): string {
  const absValue = Math.abs(value);
  if (absValue >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (absValue >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }
  return formatCurrency(value);
}
```

**Step 3: Create api.ts**

```typescript
// frontend/src/lib/api.ts
import axios from 'axios';
import type { CalculatorInputs } from './defaults';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.ownvsrent.io';

export interface YearlySnapshot {
  year: number;
  renter_wealth: number;
  buyer_wealth: number;
  net_benefit: number;
}

export interface CalculatorResults {
  verdict: 'buy' | 'rent' | 'toss-up';
  break_even_year: number | null;
  net_benefit_at_horizon: number;
  renter_wealth_at_horizon: number;
  buyer_wealth_at_horizon: number;
  yearly_snapshots: YearlySnapshot[];
  monthly_rent: number;
  monthly_ownership_cost: number;
  monthly_mortgage_payment: number;
  itemization_beneficial: boolean;
  pmi_removed_month: number | null;
}

export async function calculate(inputs: CalculatorInputs): Promise<CalculatorResults> {
  const response = await axios.post<CalculatorResults>(`${API_URL}/api/calculate`, inputs);
  return response.data;
}
```

**Step 4: Verify imports work**

Run: `cd frontend && npm run build`
Expected: Build succeeds

**Step 5: Commit**

```bash
git add frontend/src/lib/
git commit -m "feat(frontend): add lib utilities (defaults, formatters, api)"
```

---

### Task 2: Create useCalculator hook

**Files:**
- Create: `frontend/src/hooks/useCalculator.ts`

**Step 1: Create the hook**

```typescript
// frontend/src/hooks/useCalculator.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { calculate, type CalculatorResults } from '../lib/api';
import { DEFAULT_INPUTS, type CalculatorInputs } from '../lib/defaults';

interface UseCalculatorReturn {
  inputs: CalculatorInputs;
  setInput: <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => void;
  results: CalculatorResults | null;
  loading: boolean;
  error: string | null;
}

export function useCalculator(): UseCalculatorReturn {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);
  const [results, setResults] = useState<CalculatorResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const runCalculation = useCallback(async (currentInputs: CalculatorInputs) => {
    try {
      setLoading(true);
      setError(null);
      const data = await calculate(currentInputs);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation failed');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial calculation
  useEffect(() => {
    runCalculation(inputs);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced calculation on input change
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      runCalculation(inputs);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [inputs, runCalculation]);

  const setInput = useCallback(<K extends keyof CalculatorInputs>(
    key: K,
    value: CalculatorInputs[K]
  ) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  }, []);

  return { inputs, setInput, results, loading, error };
}
```

**Step 2: Verify build**

Run: `cd frontend && npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add frontend/src/hooks/
git commit -m "feat(frontend): add useCalculator hook with debounced API calls"
```

---

### Task 3: Create SliderInput component

**Files:**
- Create: `frontend/src/components/SliderInput.tsx`

**Step 1: Create the component**

```typescript
// frontend/src/components/SliderInput.tsx
import { useId } from 'react';

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  format: 'currency' | 'percent' | 'years' | 'months';
  helpText?: string;
}

export function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  format,
  helpText,
}: SliderInputProps) {
  const id = useId();

  const displayValue = () => {
    switch (format) {
      case 'currency':
        return `$${value.toLocaleString()}`;
      case 'percent':
        return `${(value * 100).toFixed(1)}%`;
      case 'years':
        return `${value} ${value === 1 ? 'year' : 'years'}`;
      case 'months':
        return `${value} ${value === 1 ? 'month' : 'months'}`;
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.-]/g, '');
    let num = parseFloat(raw);
    if (isNaN(num)) return;

    if (format === 'percent') {
      num = num / 100;
    }

    num = Math.max(min, Math.min(max, num));
    onChange(num);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-sm font-medium text-gray-300">
          {label}
        </label>
        <input
          type="text"
          value={displayValue()}
          onChange={handleTextChange}
          className="w-24 text-right bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-accent-buy"
        />
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-accent-buy"
      />
      {helpText && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add frontend/src/components/SliderInput.tsx
git commit -m "feat(frontend): add SliderInput component"
```

---

### Task 4: Create AccordionSection component

**Files:**
- Create: `frontend/src/components/AccordionSection.tsx`

**Step 1: Create the component**

```typescript
// frontend/src/components/AccordionSection.tsx
import { useState, type ReactNode } from 'react';

interface AccordionSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function AccordionSection({ title, defaultOpen = true, children }: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex justify-between items-center bg-gray-800 hover:bg-gray-750 transition-colors"
      >
        <span className="font-medium text-white">{title}</span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-4 py-4 space-y-4 bg-gray-800/50">
          {children}
        </div>
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add frontend/src/components/AccordionSection.tsx
git commit -m "feat(frontend): add AccordionSection component"
```

---

### Task 5: Create InputPanel component

**Files:**
- Create: `frontend/src/components/InputPanel.tsx`

**Step 1: Create the component**

```typescript
// frontend/src/components/InputPanel.tsx
import type { CalculatorInputs } from '../lib/defaults';
import { AccordionSection } from './AccordionSection';
import { SliderInput } from './SliderInput';

interface InputPanelProps {
  inputs: CalculatorInputs;
  setInput: <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => void;
}

export function InputPanel({ inputs, setInput }: InputPanelProps) {
  return (
    <div className="space-y-4">
      {/* Rent Section */}
      <AccordionSection title="Your Rent">
        <SliderInput
          label="Monthly Rent"
          value={inputs.monthly_rent}
          onChange={(v) => setInput('monthly_rent', v)}
          min={0}
          max={10000}
          step={100}
          format="currency"
        />
        <SliderInput
          label="Annual Rent Increase"
          value={inputs.annual_rent_increase}
          onChange={(v) => setInput('annual_rent_increase', v)}
          min={0}
          max={0.10}
          step={0.005}
          format="percent"
        />
        <SliderInput
          label="Renter's Insurance"
          value={inputs.renter_insurance}
          onChange={(v) => setInput('renter_insurance', v)}
          min={0}
          max={200}
          step={5}
          format="currency"
        />
      </AccordionSection>

      {/* Purchase Section */}
      <AccordionSection title="Home Purchase">
        <SliderInput
          label="Purchase Price"
          value={inputs.purchase_price}
          onChange={(v) => setInput('purchase_price', v)}
          min={50000}
          max={2000000}
          step={10000}
          format="currency"
        />
        <SliderInput
          label="Down Payment"
          value={inputs.down_payment_percent}
          onChange={(v) => setInput('down_payment_percent', v)}
          min={0.03}
          max={1}
          step={0.01}
          format="percent"
        />
        <SliderInput
          label="Mortgage Rate"
          value={inputs.mortgage_rate}
          onChange={(v) => setInput('mortgage_rate', v)}
          min={0.01}
          max={0.12}
          step={0.001}
          format="percent"
        />
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Loan Term</label>
          <select
            value={inputs.loan_term_years}
            onChange={(e) => setInput('loan_term_years', parseInt(e.target.value) as 10 | 15 | 20 | 25 | 30)}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-accent-buy"
          >
            <option value={10}>10 years</option>
            <option value={15}>15 years</option>
            <option value={20}>20 years</option>
            <option value={25}>25 years</option>
            <option value={30}>30 years</option>
          </select>
        </div>
        <SliderInput
          label="Property Tax Rate"
          value={inputs.property_tax_rate}
          onChange={(v) => setInput('property_tax_rate', v)}
          min={0}
          max={0.04}
          step={0.001}
          format="percent"
        />
        <SliderInput
          label="Home Insurance Rate"
          value={inputs.home_insurance_rate}
          onChange={(v) => setInput('home_insurance_rate', v)}
          min={0}
          max={0.02}
          step={0.001}
          format="percent"
        />
        <SliderInput
          label="HOA Monthly"
          value={inputs.hoa_monthly}
          onChange={(v) => setInput('hoa_monthly', v)}
          min={0}
          max={1000}
          step={25}
          format="currency"
        />
        <SliderInput
          label="Maintenance Rate"
          value={inputs.maintenance_rate}
          onChange={(v) => setInput('maintenance_rate', v)}
          min={0.005}
          max={0.04}
          step={0.005}
          format="percent"
          helpText="Most experts recommend 1-3% annually"
        />
      </AccordionSection>

      {/* Selling Section */}
      <AccordionSection title="When You Sell">
        <SliderInput
          label="Holding Period"
          value={inputs.holding_period_years}
          onChange={(v) => setInput('holding_period_years', Math.round(v))}
          min={1}
          max={30}
          step={1}
          format="years"
        />
        <SliderInput
          label="Annual Appreciation"
          value={inputs.annual_appreciation}
          onChange={(v) => setInput('annual_appreciation', v)}
          min={-0.05}
          max={0.10}
          step={0.005}
          format="percent"
          helpText="Historical average: 3-4% nominal"
        />
        <SliderInput
          label="Selling Costs"
          value={inputs.selling_costs_percent}
          onChange={(v) => setInput('selling_costs_percent', v)}
          min={0.04}
          max={0.12}
          step={0.01}
          format="percent"
          helpText="Includes agent commission + closing costs"
        />
      </AccordionSection>

      {/* Tax & Financial Section */}
      <AccordionSection title="Tax & Financial" defaultOpen={false}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Filing Status</label>
          <select
            value={inputs.filing_status}
            onChange={(e) => setInput('filing_status', e.target.value as 'single' | 'married')}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-accent-buy"
          >
            <option value="single">Single</option>
            <option value="married">Married Filing Jointly</option>
          </select>
        </div>
        <SliderInput
          label="Marginal Tax Rate"
          value={inputs.marginal_tax_rate}
          onChange={(v) => setInput('marginal_tax_rate', v)}
          min={0}
          max={0.40}
          step={0.01}
          format="percent"
        />
        <SliderInput
          label="State Tax Rate"
          value={inputs.state_tax_rate}
          onChange={(v) => setInput('state_tax_rate', v)}
          min={0}
          max={0.13}
          step={0.01}
          format="percent"
        />
        <SliderInput
          label="Capital Gains Rate"
          value={inputs.capital_gains_tax_rate}
          onChange={(v) => setInput('capital_gains_tax_rate', v)}
          min={0}
          max={0.25}
          step={0.01}
          format="percent"
        />
        <SliderInput
          label="Investment Return"
          value={inputs.annual_investment_return}
          onChange={(v) => setInput('annual_investment_return', v)}
          min={0.02}
          max={0.12}
          step={0.005}
          format="percent"
          helpText="S&P 500 long-term average: ~7%"
        />
        {inputs.down_payment_percent < 0.2 && (
          <SliderInput
            label="PMI Rate"
            value={inputs.pmi_rate}
            onChange={(v) => setInput('pmi_rate', v)}
            min={0.003}
            max={0.02}
            step={0.001}
            format="percent"
          />
        )}
        <SliderInput
          label="Closing Costs"
          value={inputs.buyer_closing_costs_percent}
          onChange={(v) => setInput('buyer_closing_costs_percent', v)}
          min={0.01}
          max={0.06}
          step={0.005}
          format="percent"
        />
        <SliderInput
          label="Security Deposit"
          value={inputs.security_deposit}
          onChange={(v) => setInput('security_deposit', Math.round(v))}
          min={0}
          max={3}
          step={1}
          format="months"
        />
        <SliderInput
          label="Broker Fee"
          value={inputs.broker_fee}
          onChange={(v) => setInput('broker_fee', v)}
          min={0}
          max={0.15}
          step={0.01}
          format="percent"
        />
      </AccordionSection>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add frontend/src/components/InputPanel.tsx
git commit -m "feat(frontend): add InputPanel with all calculator inputs"
```

---

### Task 6: Create VerdictCard component

**Files:**
- Create: `frontend/src/components/VerdictCard.tsx`

**Step 1: Create the component**

```typescript
// frontend/src/components/VerdictCard.tsx
import type { CalculatorResults } from '../lib/api';
import { formatCurrency } from '../lib/formatters';

interface VerdictCardProps {
  results: CalculatorResults;
  holdingPeriod: number;
}

export function VerdictCard({ results, holdingPeriod }: VerdictCardProps) {
  const isRentWins = results.verdict === 'rent';
  const isTossUp = results.verdict === 'toss-up';
  const benefit = Math.abs(results.net_benefit_at_horizon);

  const bgColor = isTossUp
    ? 'bg-gray-700'
    : isRentWins
    ? 'bg-accent-rent/20 border-accent-rent'
    : 'bg-accent-buy/20 border-accent-buy';

  const textColor = isTossUp
    ? 'text-gray-300'
    : isRentWins
    ? 'text-accent-rent'
    : 'text-accent-buy';

  return (
    <div className={`rounded-lg border-2 p-6 ${bgColor}`}>
      {/* Verdict Badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`text-sm font-bold uppercase tracking-wide ${textColor}`}>
          {isTossUp ? 'Too Close to Call' : isRentWins ? 'Rent Wins' : 'Buy Wins'}
        </span>
      </div>

      {/* Main Headline */}
      <h2 className="text-2xl font-bold text-white mb-2">
        {isTossUp ? (
          'The difference is minimal'
        ) : (
          <>
            {isRentWins ? 'Renting' : 'Buying'} saves you{' '}
            <span className={textColor}>{formatCurrency(benefit)}</span>
          </>
        )}
      </h2>
      <p className="text-gray-400 mb-4">
        over {holdingPeriod} {holdingPeriod === 1 ? 'year' : 'years'}
      </p>

      {/* Monthly Comparison */}
      <div className="flex gap-6 text-sm mb-4">
        <div>
          <span className="text-gray-400">Monthly Rent:</span>{' '}
          <span className="text-white font-medium">
            {formatCurrency(results.monthly_rent)}
          </span>
        </div>
        <div>
          <span className="text-gray-400">Monthly Ownership:</span>{' '}
          <span className="text-white font-medium">
            {formatCurrency(results.monthly_ownership_cost)}
          </span>
        </div>
      </div>

      {/* Break-even */}
      <div className="text-sm">
        <span className="text-gray-400">Break-even:</span>{' '}
        <span className="text-white font-medium">
          {results.break_even_year
            ? `Year ${results.break_even_year}`
            : 'Never (within 30 years)'}
        </span>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add frontend/src/components/VerdictCard.tsx
git commit -m "feat(frontend): add VerdictCard component"
```

---

### Task 7: Create WealthChart component

**Files:**
- Create: `frontend/src/components/WealthChart.tsx`

**Step 1: Create the component**

```typescript
// frontend/src/components/WealthChart.tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from 'recharts';
import type { CalculatorResults } from '../lib/api';
import { formatCompactCurrency } from '../lib/formatters';

interface WealthChartProps {
  results: CalculatorResults;
}

export function WealthChart({ results }: WealthChartProps) {
  const data = results.yearly_snapshots.map((snapshot) => ({
    year: snapshot.year,
    renter: snapshot.renter_wealth,
    buyer: snapshot.buyer_wealth,
  }));

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-4">Wealth Over Time</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="year"
              stroke="#9CA3AF"
              tickFormatter={(v) => `Yr ${v}`}
            />
            <YAxis
              stroke="#9CA3AF"
              tickFormatter={(v) => formatCompactCurrency(v)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#F3F4F6' }}
              formatter={(value: number, name: string) => [
                formatCompactCurrency(value),
                name === 'renter' ? 'Renter Wealth' : 'Buyer Wealth',
              ]}
              labelFormatter={(label) => `Year ${label}`}
            />
            <Legend
              formatter={(value) =>
                value === 'renter' ? 'Renter Wealth' : 'Buyer Wealth'
              }
            />
            {results.break_even_year && (
              <ReferenceLine
                x={results.break_even_year}
                stroke="#9CA3AF"
                strokeDasharray="5 5"
                label={{
                  value: 'Break-even',
                  fill: '#9CA3AF',
                  fontSize: 12,
                }}
              />
            )}
            <Line
              type="monotone"
              dataKey="renter"
              stroke="#2da88e"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="buyer"
              stroke="#d4a843"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-gray-500 mt-3">
        Renter wealth = investment portfolio. Buyer wealth = home equity + portfolio − selling costs − taxes.
      </p>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add frontend/src/components/WealthChart.tsx
git commit -m "feat(frontend): add WealthChart component with Recharts"
```

---

### Task 8: Create Calculator component and update App

**Files:**
- Create: `frontend/src/components/Calculator.tsx`
- Modify: `frontend/src/App.tsx`

**Step 1: Create Calculator.tsx**

```typescript
// frontend/src/components/Calculator.tsx
import { useCalculator } from '../hooks/useCalculator';
import { InputPanel } from './InputPanel';
import { VerdictCard } from './VerdictCard';
import { WealthChart } from './WealthChart';

export function Calculator() {
  const { inputs, setInput, results, loading, error } = useCalculator();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left: Inputs */}
      <div>
        <InputPanel inputs={inputs} setInput={setInput} />
      </div>

      {/* Right: Results */}
      <div className="lg:sticky lg:top-8 lg:self-start space-y-6">
        {error && (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 text-red-200">
            {error}
          </div>
        )}

        {loading && !results && (
          <div className="animate-pulse space-y-6">
            <div className="bg-gray-700 rounded-lg h-48"></div>
            <div className="bg-gray-700 rounded-lg h-64"></div>
          </div>
        )}

        {results && (
          <>
            <div className={loading ? 'opacity-60' : ''}>
              <VerdictCard
                results={results}
                holdingPeriod={inputs.holding_period_years}
              />
            </div>
            <div className={loading ? 'opacity-60' : ''}>
              <WealthChart results={results} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
```

**Step 2: Update App.tsx**

```typescript
// frontend/src/App.tsx
import { Calculator } from './components/Calculator';

function App() {
  return (
    <div className="min-h-screen bg-primary">
      <header className="border-b border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-accent-buy">ownvsrent.io</h1>
          <p className="text-gray-400 mt-1">
            The rent vs. buy calculator that doesn't lie to you.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Calculator />
      </main>

      <footer className="border-t border-gray-700 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          <p>All calculations run locally. No data is stored.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
```

**Step 3: Verify everything builds**

Run: `cd frontend && npm run build`
Expected: Build succeeds

**Step 4: Test locally**

Run: `cd frontend && npm run dev`
Expected: Opens browser, calculator loads, inputs work, results update

**Step 5: Commit**

```bash
git add frontend/src/components/Calculator.tsx frontend/src/App.tsx
git commit -m "feat(frontend): add Calculator component and wire up App"
```

---

### Task 9: Deploy to production

**Step 1: Build for production**

Run: `cd frontend && npm run build`

**Step 2: Deploy to S3**

Run: `aws s3 sync frontend/dist/ s3://ownvsrent-frontend --delete`

**Step 3: Invalidate CloudFront cache**

Run: `aws cloudfront create-invalidation --distribution-id E2YAX90K1YB9JU --paths "/*"`

**Step 4: Verify production**

Open: https://ownvsrent.io
Expected: Calculator loads, inputs work, results update in real-time

**Step 5: Commit and push**

```bash
git add .
git commit -m "feat(frontend): complete calculator MVP"
git push origin main
```

---

## Summary

| Task | Files | Description |
|------|-------|-------------|
| 1 | lib/* | Defaults, formatters, API client |
| 2 | hooks/useCalculator | State management + debounced API |
| 3 | SliderInput | Reusable slider + text input |
| 4 | AccordionSection | Collapsible section wrapper |
| 5 | InputPanel | All 23 inputs organized in accordions |
| 6 | VerdictCard | Result summary with verdict |
| 7 | WealthChart | Recharts line chart |
| 8 | Calculator + App | Main layout, wire everything |
| 9 | Deploy | Build, S3, CloudFront |

**Total: 9 tasks, ~10 files, ready for production**
