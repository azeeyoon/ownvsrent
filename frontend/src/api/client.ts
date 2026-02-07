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
