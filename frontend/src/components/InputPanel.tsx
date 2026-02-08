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
          <label className="text-sm text-gray-600">Loan Term</label>
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
          <label className="text-sm text-gray-600">Filing Status</label>
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
