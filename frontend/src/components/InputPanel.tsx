import type { CalculatorInputs } from '../lib/defaults';
import { AccordionSection } from './AccordionSection';
import { SliderInput } from './SliderInput';
import { CitySelect } from './CitySelect';
import type { CityPreset } from '../data/cities';

interface InputPanelProps {
  inputs: CalculatorInputs;
  setInput: <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => void;
  onCitySelect: (city: CityPreset) => void;
  selectedCity: string | null;
}

// Tooltip definitions for each input field
const TOOLTIPS = {
  // Renting
  monthly_rent: "Your current or expected monthly rent payment. This will increase each year based on the rent increase rate you set.",
  annual_rent_increase: "How much your rent goes up each year. The national average is about 3-4%. Urban areas often see higher increases.",
  renter_insurance: "Monthly cost for renter's insurance, which covers your belongings. Typically $15-50/month depending on coverage.",

  // Buying - Purchase
  purchase_price: "The total price of the home you're considering. This is the full purchase price before any down payment.",
  down_payment_percent: "Percentage of the home price you'll pay upfront. 20% avoids PMI (Private Mortgage Insurance). Less than 20% requires PMI until you have 20% equity.",
  mortgage_rate: "Your annual mortgage interest rate. Check current rates at Bankrate or Freddie Mac. This significantly impacts your monthly payment.",
  loan_term_years: "Length of your mortgage. 30-year loans have lower monthly payments but more total interest. 15-year loans save interest but have higher payments.",
  property_tax_rate: "Annual property tax as a percentage of home value. Varies widely by location: 0.3% in Hawaii to 2.5% in New Jersey. Check your county's rate.",
  home_insurance_rate: "Annual homeowner's insurance as a percentage of home value. Typically 0.3-0.6%. Higher in disaster-prone areas.",
  hoa_monthly: "Monthly Homeowners Association fee, if applicable. Common in condos and planned communities. Covers shared amenities and maintenance.",
  maintenance_rate: "Annual maintenance costs as a percentage of home value. Experts recommend budgeting 1-3%. Older homes need more. Includes repairs, upkeep, and replacements.",

  // Selling
  holding_period_years: "How long you plan to own the home before selling. Short holding periods (under 5 years) often favor renting due to transaction costs.",
  annual_appreciation: "Expected annual increase in home value. Historical US average is 3-4% nominal. Varies significantly by market. Conservative estimates are safer.",
  selling_costs_percent: "Total cost to sell, including real estate agent commission (5-6%) and closing costs (1-3%). Most sellers pay 7-10% of sale price.",

  // Tax & Financial
  filing_status: "Your tax filing status affects standard deduction amount. Married filing jointly gets $31,500 standard deduction vs $15,750 for single (2025).",
  marginal_tax_rate: "Your federal income tax bracket. This determines the value of mortgage interest and property tax deductions IF you itemize (most people don't).",
  state_tax_rate: "Your state income tax rate. This is part of your SALT deduction, which is capped at $40,000 (2025-2029).",
  capital_gains_tax_rate: "Tax rate on investment gains when you sell stocks. Also applies to home sale gains above the $250K/$500K exemption.",
  annual_investment_return: "Expected annual return on investments (stocks, bonds). The S&P 500 has historically returned about 7% after inflation. Used for comparing what renters could earn.",
  pmi_rate: "Annual PMI cost as a percentage of the original loan amount. Required when down payment is less than 20%. Removed when you reach 20% equity.",
  closing_costs_percent: "Buyer's closing costs as a percentage of the loan amount. Includes loan origination, appraisal, title insurance, etc. Typically 2-5%.",
  security_deposit: "Security deposit in months of rent. Typically 1-2 months. This is returned at the end of your lease (not invested).",
  broker_fee: "One-time broker fee as a percentage of annual rent. Common in NYC and Boston (up to 15%). Most markets have no broker fee.",
};

export function InputPanel({ inputs, setInput, onCitySelect, selectedCity }: InputPanelProps) {
  return (
    <div className="space-y-4">
      {/* City Selector */}
      <div className="mb-6">
        <CitySelect onSelect={onCitySelect} selectedSlug={selectedCity} />
      </div>

      {/* Rent Section */}
      <AccordionSection title="Your Rent">
        <SliderInput
          label="Monthly Rent"
          value={inputs.monthly_rent}
          onChange={(v) => setInput('monthly_rent', v)}
          min={0}
          max={15000}
          step={100}
          format="currency"
          tooltip={TOOLTIPS.monthly_rent}
        />
        <SliderInput
          label="Annual Rent Increase"
          value={inputs.annual_rent_increase}
          onChange={(v) => setInput('annual_rent_increase', v)}
          min={0}
          max={0.10}
          step={0.005}
          format="percent"
          tooltip={TOOLTIPS.annual_rent_increase}
        />
        <SliderInput
          label="Renter's Insurance"
          value={inputs.renter_insurance}
          onChange={(v) => setInput('renter_insurance', v)}
          min={0}
          max={200}
          step={5}
          format="currency"
          tooltip={TOOLTIPS.renter_insurance}
        />
      </AccordionSection>

      {/* Purchase Section */}
      <AccordionSection title="Home Purchase">
        <SliderInput
          label="Purchase Price"
          value={inputs.purchase_price}
          onChange={(v) => setInput('purchase_price', v)}
          min={50000}
          max={5000000}
          step={10000}
          format="currency"
          tooltip={TOOLTIPS.purchase_price}
        />
        <SliderInput
          label="Down Payment"
          value={inputs.down_payment_percent}
          onChange={(v) => setInput('down_payment_percent', v)}
          min={0.03}
          max={1}
          step={0.01}
          format="percent"
          tooltip={TOOLTIPS.down_payment_percent}
        />
        <SliderInput
          label="Mortgage Rate"
          value={inputs.mortgage_rate}
          onChange={(v) => setInput('mortgage_rate', v)}
          min={0.01}
          max={0.15}
          step={0.001}
          format="percent"
          tooltip={TOOLTIPS.mortgage_rate}
        />
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <label className="text-sm text-gray-600">Loan Term</label>
            <div className="relative group">
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Info about Loan Term"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <div className="absolute left-0 bottom-full mb-2 z-50 w-64 p-3 text-xs text-gray-700 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="font-medium text-gray-900 mb-1">Loan Term</div>
                <p className="leading-relaxed">{TOOLTIPS.loan_term_years}</p>
                <div className="absolute left-3 bottom-0 transform translate-y-1/2 rotate-45 w-2 h-2 bg-white border-r border-b border-gray-200"></div>
              </div>
            </div>
          </div>
          <select
            value={inputs.loan_term_years}
            onChange={(e) => setInput('loan_term_years', parseInt(e.target.value) as 10 | 15 | 20 | 25 | 30)}
            className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-300"
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
          max={0.05}
          step={0.001}
          format="percent"
          tooltip={TOOLTIPS.property_tax_rate}
        />
        <SliderInput
          label="Home Insurance Rate"
          value={inputs.home_insurance_rate}
          onChange={(v) => setInput('home_insurance_rate', v)}
          min={0}
          max={0.04}
          step={0.001}
          format="percent"
          tooltip={TOOLTIPS.home_insurance_rate}
        />
        <SliderInput
          label="HOA Monthly"
          value={inputs.hoa_monthly}
          onChange={(v) => setInput('hoa_monthly', v)}
          min={0}
          max={2000}
          step={25}
          format="currency"
          tooltip={TOOLTIPS.hoa_monthly}
        />
        <SliderInput
          label="Maintenance Rate"
          value={inputs.maintenance_rate}
          onChange={(v) => setInput('maintenance_rate', v)}
          min={0.005}
          max={0.04}
          step={0.005}
          format="percent"
          tooltip={TOOLTIPS.maintenance_rate}
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
          tooltip={TOOLTIPS.holding_period_years}
        />
        <SliderInput
          label="Annual Appreciation"
          value={inputs.annual_appreciation}
          onChange={(v) => setInput('annual_appreciation', v)}
          min={-0.10}
          max={0.15}
          step={0.005}
          format="percent"
          tooltip={TOOLTIPS.annual_appreciation}
          helpText="Historical average: 3-4% nominal"
        />
        <SliderInput
          label="Selling Costs"
          value={inputs.selling_costs_percent}
          onChange={(v) => setInput('selling_costs_percent', v)}
          min={0.02}
          max={0.15}
          step={0.01}
          format="percent"
          tooltip={TOOLTIPS.selling_costs_percent}
          helpText="Includes agent commission + closing costs"
        />
      </AccordionSection>

      {/* Tax & Financial Section */}
      <AccordionSection title="Tax & Financial" defaultOpen={false}>
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <label className="text-sm text-gray-600">Filing Status</label>
            <div className="relative group">
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Info about Filing Status"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <div className="absolute left-0 bottom-full mb-2 z-50 w-64 p-3 text-xs text-gray-700 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="font-medium text-gray-900 mb-1">Filing Status</div>
                <p className="leading-relaxed">{TOOLTIPS.filing_status}</p>
                <div className="absolute left-3 bottom-0 transform translate-y-1/2 rotate-45 w-2 h-2 bg-white border-r border-b border-gray-200"></div>
              </div>
            </div>
          </div>
          <select
            value={inputs.filing_status}
            onChange={(e) => setInput('filing_status', e.target.value as 'single' | 'married')}
            className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-300"
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
          tooltip={TOOLTIPS.marginal_tax_rate}
        />
        <SliderInput
          label="State Tax Rate"
          value={inputs.state_tax_rate}
          onChange={(v) => setInput('state_tax_rate', v)}
          min={0}
          max={0.13}
          step={0.01}
          format="percent"
          tooltip={TOOLTIPS.state_tax_rate}
        />
        <SliderInput
          label="Capital Gains Rate"
          value={inputs.capital_gains_tax_rate}
          onChange={(v) => setInput('capital_gains_tax_rate', v)}
          min={0}
          max={0.25}
          step={0.01}
          format="percent"
          tooltip={TOOLTIPS.capital_gains_tax_rate}
        />
        <SliderInput
          label="Investment Return"
          value={inputs.annual_investment_return}
          onChange={(v) => setInput('annual_investment_return', v)}
          min={0}
          max={0.15}
          step={0.005}
          format="percent"
          tooltip={TOOLTIPS.annual_investment_return}
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
            tooltip={TOOLTIPS.pmi_rate}
          />
        )}
        <SliderInput
          label="Closing Costs"
          value={inputs.buyer_closing_costs_percent}
          onChange={(v) => setInput('buyer_closing_costs_percent', v)}
          min={0}
          max={0.08}
          step={0.005}
          format="percent"
          tooltip={TOOLTIPS.closing_costs_percent}
        />
        <SliderInput
          label="Security Deposit"
          value={inputs.security_deposit}
          onChange={(v) => setInput('security_deposit', Math.round(v))}
          min={0}
          max={6}
          step={1}
          format="months"
          tooltip={TOOLTIPS.security_deposit}
        />
        <SliderInput
          label="Broker Fee"
          value={inputs.broker_fee}
          onChange={(v) => setInput('broker_fee', v)}
          min={0}
          max={0.15}
          step={0.01}
          format="percent"
          tooltip={TOOLTIPS.broker_fee}
        />
      </AccordionSection>
    </div>
  );
}
