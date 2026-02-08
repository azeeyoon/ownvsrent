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
