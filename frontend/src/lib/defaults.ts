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
  monthly_rent: 2000,
  annual_rent_increase: 0.03,
  renter_insurance: 30,
  security_deposit: 1,
  broker_fee: 0,
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
  holding_period_years: 7,
  annual_appreciation: 0.035,
  annual_investment_return: 0.07,
  marginal_tax_rate: 0.22,
  state_tax_rate: 0.05,
  filing_status: 'single',
  capital_gains_tax_rate: 0.15,
};
