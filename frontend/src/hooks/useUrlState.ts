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
const KEY_TO_PARAM = Object.fromEntries(
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
  if (typeof window === 'undefined') return {};

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

  for (const key of Object.keys(inputs) as (keyof CalculatorInputs)[]) {
    const value = inputs[key];
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
