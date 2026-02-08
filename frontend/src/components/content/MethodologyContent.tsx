// Reusable components for content
function SectionDivider() {
  return <hr className="my-8 border-gray-200" />;
}

function Formula({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 p-4 bg-gray-900 text-emerald-400 font-mono text-sm rounded-lg overflow-x-auto">
      {children}
    </div>
  );
}

function Callout({ children, type = 'info' }: { children: React.ReactNode; type?: 'info' | 'warning' | 'success' }) {
  const styles = {
    info: 'bg-blue-50 border-blue-500 text-blue-900',
    warning: 'bg-amber-50 border-amber-500 text-amber-900',
    success: 'bg-emerald-50 border-emerald-500 text-emerald-900',
  };
  return (
    <div className={`my-6 p-4 border-l-4 rounded-r-lg ${styles[type]}`}>
      {children}
    </div>
  );
}

function DataTable({ headers, rows }: { headers: string[]; rows: (string | React.ReactNode)[][] }) {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {headers.map((header, i) => (
              <th key={i} className="px-4 py-3 bg-gray-100 text-left font-semibold text-gray-900 border border-gray-200 text-sm">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 1 ? 'bg-gray-50' : 'bg-white'}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 border border-gray-200 text-gray-600 text-sm">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return <p className="text-gray-600 leading-relaxed mb-4">{children}</p>;
}

function BulletList({ items }: { items: (string | React.ReactNode)[] }) {
  return (
    <ul className="my-4 space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-gray-600">
          <span className="text-emerald-500 mt-1.5">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function NumberList({ items }: { items: (string | React.ReactNode)[] }) {
  return (
    <ol className="my-4 space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-gray-600">
          <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-sm font-semibold">
            {i + 1}
          </span>
          <span className="pt-0.5">{item}</span>
        </li>
      ))}
    </ol>
  );
}

// Section Components
export function OverviewSection() {
  return (
    <>
      <Paragraph>
        Our rent vs buy calculator uses <strong>month-by-month simulation</strong> to accurately compare the financial outcomes of renting versus buying a home. Unlike simpler calculators that use annual approximations, we model each month individually to capture timing-dependent factors like PMI removal, amortization schedules, and investment compounding.
      </Paragraph>

      <Paragraph>
        This precision matters because financial decisions compound over time. A small error early in the calculation can lead to significantly misleading results over a 7-10 year horizon.
      </Paragraph>

      <SectionDivider />

      <Paragraph>The calculator compares two scenarios:</Paragraph>

      <NumberList items={[
        <><strong>Renting</strong> and investing the money you would have spent on a down payment and closing costs</>,
        <><strong>Buying</strong> a home and building equity</>
      ]} />

      <Paragraph>
        At the end of your specified holding period, we compare total wealth in both scenarios to determine which option leaves you better off financially.
      </Paragraph>
    </>
  );
}

export function RentingSection() {
  return (
    <>
      <SubSection title="Monthly Rent Cost">
        <Paragraph>
          Starting rent increases each year by your specified annual rent increase rate. For month M in year Y:
        </Paragraph>
        <Formula>Rent(M) = InitialRent × (1 + AnnualIncrease)^Y</Formula>
      </SubSection>

      <SectionDivider />

      <SubSection title="Renter's Investment Portfolio">
        <Paragraph>
          The renter starts with the equivalent of the buyer's down payment and closing costs invested on day one. Each month, if renting costs less than owning, the renter invests the difference:
        </Paragraph>
        <Formula>MonthlyInvestment = max(0, TotalOwnershipCost - TotalRentCost)</Formula>

        <Paragraph>
          The portfolio grows at a monthly rate derived from your annual investment return:
        </Paragraph>
        <Formula>MonthlyRate = (1 + AnnualReturn)^(1/12) - 1</Formula>
      </SubSection>

      <SectionDivider />

      <SubSection title="Final Renter Wealth">
        <Paragraph>
          At the end of the holding period, we calculate the after-tax value of the renter's portfolio. Capital gains tax applies only to the gains (portfolio value minus total contributions).
        </Paragraph>
      </SubSection>
    </>
  );
}

export function BuyingSection() {
  return (
    <>
      <SubSection title="Amortization Schedule">
        <Paragraph>
          We calculate an exact month-by-month amortization schedule for your mortgage. Each payment splits between principal and interest:
        </Paragraph>
        <Formula>MonthlyPayment = Principal × [r(1+r)^n] / [(1+r)^n - 1]</Formula>
        <Paragraph>
          Where <code className="bg-gray-100 px-1.5 py-0.5 rounded text-emerald-700 text-sm">r</code> = annual rate ÷ 12, and <code className="bg-gray-100 px-1.5 py-0.5 rounded text-emerald-700 text-sm">n</code> = loan term in months.
        </Paragraph>
      </SubSection>

      <SectionDivider />

      <SubSection title="PITI Breakdown">
        <Paragraph>Your total monthly housing cost includes:</Paragraph>
        <DataTable
          headers={['Component', 'Calculation']}
          rows={[
            [<strong>Principal & Interest</strong>, 'Fixed monthly mortgage payment'],
            [<strong>Property Tax</strong>, '(Home Value × Annual Rate) ÷ 12'],
            [<strong>Insurance</strong>, '(Home Value × Annual Rate) ÷ 12'],
          ]}
        />
      </SubSection>

      <SectionDivider />

      <SubSection title="PMI (Private Mortgage Insurance)">
        <Paragraph>
          Required when down payment is less than 20%. PMI rate applies to original loan amount.
        </Paragraph>
        <Callout type="info">
          <strong>PMI automatically terminates when:</strong>
          <BulletList items={[
            <>Your loan balance reaches <strong>78%</strong> of the original purchase price, OR</>,
            <>The loan-to-value ratio (based on current appraised value with appreciation) reaches <strong>80%</strong></>
          ]} />
        </Callout>
      </SubSection>

      <SectionDivider />

      <SubSection title="Home Appreciation">
        <Paragraph>Home value grows monthly at:</Paragraph>
        <Formula>HomeValue(M) = PurchasePrice × (1 + AnnualAppreciation)^(M/12)</Formula>
      </SubSection>

      <SectionDivider />

      <SubSection title="Buyer's Investment Portfolio">
        <Paragraph>
          If buying costs less than renting in any month, the buyer invests that difference using the same investment return assumptions as the renter.
        </Paragraph>
      </SubSection>
    </>
  );
}

export function TaxesSection() {
  return (
    <>
      <SubSection title="Standard vs. Itemized Deductions">
        <Callout type="warning">
          <strong>This is where most calculators get it wrong.</strong> You only benefit from mortgage interest and property tax deductions if your total itemized deductions exceed the standard deduction.
        </Callout>

        <DataTable
          headers={['Filing Status', 'Standard Deduction (2025)']}
          rows={[
            ['Single', '$15,750'],
            ['Married Filing Jointly', '$31,500'],
          ]}
        />

        <Paragraph>Your tax benefit is:</Paragraph>
        <Formula>TaxBenefit = max(0, (ItemizedTotal - StandardDeduction) × MarginalRate)</Formula>
      </SubSection>

      <SectionDivider />

      <SubSection title="SALT Cap (State and Local Tax)">
        <Paragraph>The 2025 OBBBA modified SALT deduction limits:</Paragraph>
        <DataTable
          headers={['Period', 'Cap', 'Notes']}
          rows={[
            ['2025-2029', '$40,000', '$20,000 for MFS'],
            ['Inflation', '+1% annually', 'Applied to cap'],
            ['Phase-out', '30% reduction', 'For MAGI > $500K (floor of $10K)'],
            ['2030+', '$10,000', 'Reverts to previous limit'],
          ]}
        />
      </SubSection>

      <SectionDivider />

      <SubSection title="Mortgage Interest Deduction">
        <Paragraph>
          Deductible on the first <strong>$750,000</strong> of acquisition debt. If your loan exceeds this, we prorate the deductible amount.
        </Paragraph>
      </SubSection>

      <SectionDivider />

      <SubSection title="PMI Deductibility">
        <Paragraph>
          Starting tax year 2026 (OBBBA), PMI premiums are treated as deductible mortgage interest.
        </Paragraph>
        <Callout type="info">
          <strong>Phase-out:</strong> AGI between $100K–$110K
        </Callout>
      </SubSection>
    </>
  );
}

export function WealthSection() {
  return (
    <>
      <SubSection title="Buyer's Final Wealth">
        <Paragraph>At the end of your holding period, the buyer's wealth equals:</Paragraph>
        <Formula>HomeValue - RemainingMortgage - SellingCosts - CapitalGainsTax + InvestmentPortfolio</Formula>
      </SubSection>

      <SectionDivider />

      <SubSection title="Selling Costs">
        <Paragraph>
          Typically <strong>6-8% of sale price</strong>, covering:
        </Paragraph>
        <BulletList items={[
          'Realtor commissions',
          'Transfer taxes',
          'Closing costs',
        ]} />
      </SubSection>

      <SectionDivider />

      <SubSection title="Capital Gains on Home Sale">
        <Paragraph>
          The IRS allows exclusion of capital gains on your primary residence if you've lived there 2+ of the last 5 years:
        </Paragraph>
        <DataTable
          headers={['Filing Status', 'Exclusion Amount']}
          rows={[
            ['Single', '$250,000'],
            ['Married', '$500,000'],
          ]}
        />
        <Paragraph>
          Only gains <strong>above</strong> this exemption are taxed at your capital gains rate.
        </Paragraph>
      </SubSection>

      <SectionDivider />

      <SubSection title="Net Benefit">
        <Paragraph>The final comparison:</Paragraph>
        <Formula>NetBenefit = BuyerWealth - RenterWealth</Formula>

        <DataTable
          headers={['Result', 'Meaning']}
          rows={[
            [<span className="text-emerald-600 font-semibold">Positive</span>, 'Buying wins'],
            [<span className="text-blue-600 font-semibold">Negative</span>, 'Renting wins'],
            [<span className="text-gray-600 font-semibold">Within ±$10,000</span>, 'Too close to call (toss-up)'],
          ]}
        />
      </SubSection>
    </>
  );
}

export function SourcesSection() {
  return (
    <>
      <SubSection title="Tax Law References">
        <BulletList items={[
          <><strong>IRS Publication 936:</strong> Home Mortgage Interest Deduction</>,
          <><strong>IRS Publication 530:</strong> Tax Information for Homeowners</>,
          <><strong>One Big Beautiful Bill Act (OBBBA) 2025:</strong> SALT cap modifications</>,
          <><strong>IRC Section 121:</strong> Exclusion of gain from sale of principal residence</>,
        ]} />
      </SubSection>

      <SectionDivider />

      <SubSection title="Data Sources">
        <BulletList items={[
          <><strong>Freddie Mac:</strong> Mortgage rate trends</>,
          <><strong>U.S. Census Bureau:</strong> Housing cost statistics</>,
          <><strong>Bureau of Labor Statistics:</strong> Inflation data</>,
          <><strong>S&P 500:</strong> Historical investment returns</>,
        ]} />
      </SubSection>

      <SectionDivider />

      <SubSection title="Transparency">
        <Paragraph>
          Our calculator's source code is available for review. We have no affiliation with real estate agents, mortgage lenders, or anyone with a financial interest in your decision.
        </Paragraph>
        <Callout type="success">
          <strong>We show you the math—nothing more, nothing less.</strong>
        </Callout>
      </SubSection>
    </>
  );
}

// Export section data for the page
export const methodologySectionsData = [
  { id: 'overview', title: 'Overview', icon: '🎯', Component: OverviewSection },
  { id: 'renting', title: 'Renting Calculations', icon: '🔑', Component: RentingSection },
  { id: 'buying', title: 'Buying Calculations', icon: '🏠', Component: BuyingSection },
  { id: 'taxes', title: 'Tax Calculations', icon: '📋', Component: TaxesSection },
  { id: 'wealth', title: 'Wealth Comparison', icon: '💰', Component: WealthSection },
  { id: 'sources', title: 'Our Sources', icon: '📚', Component: SourcesSection },
];
