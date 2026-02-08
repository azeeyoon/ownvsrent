import { Link } from 'react-router-dom';
import { MortgageRateWidget } from '../AffiliateWidget';

// Reusable components for content
function SectionDivider() {
  return <hr className="my-8 border-gray-200" />;
}

function Callout({ children, type = 'info' }: { children: React.ReactNode; type?: 'info' | 'warning' | 'success' | 'error' }) {
  const styles = {
    info: 'bg-blue-50 border-blue-500 text-blue-900',
    warning: 'bg-amber-50 border-amber-500 text-amber-900',
    success: 'bg-emerald-50 border-emerald-500 text-emerald-900',
    error: 'bg-red-50 border-red-500 text-red-900',
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
          <span className="text-blue-500 mt-1.5">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function CheckList({ items }: { items: (string | React.ReactNode)[] }) {
  return (
    <ul className="my-4 space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-gray-600">
          <span className="text-emerald-500 mt-0.5">✓</span>
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
          <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold">
            {i + 1}
          </span>
          <span className="pt-0.5">{item}</span>
        </li>
      ))}
    </ol>
  );
}

function HighlightBox({ title, children, color = 'blue' }: { title: string; children: React.ReactNode; color?: 'blue' | 'green' | 'amber' | 'red' }) {
  const colors = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-emerald-50 border-emerald-200',
    amber: 'bg-amber-50 border-amber-200',
    red: 'bg-red-50 border-red-200',
  };
  return (
    <div className={`my-6 p-5 rounded-xl border ${colors[color]}`}>
      <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
      <div className="text-gray-700">{children}</div>
    </div>
  );
}

// Section Components
export function IntroductionSection() {
  return (
    <>
      <Paragraph>
        Buying a home is often called the biggest financial decision of your life. It's also one of the most emotionally charged. Real estate agents, mortgage lenders, parents, and well-meaning friends all have opinions—and many have financial incentives that don't align with yours.
      </Paragraph>

      <Paragraph>
        The real estate industry spends billions marketing the "American Dream" of homeownership. Phrases like "throwing money away on rent" and "building equity" make buying sound like the obvious choice.
      </Paragraph>

      <Callout type="info">
        <strong>But the math tells a more nuanced story.</strong>
      </Callout>

      <SectionDivider />

      <Paragraph>This guide cuts through the noise. We'll show you:</Paragraph>

      <BulletList items={[
        <>Exactly how to compare renting versus buying for <strong>your specific situation</strong></>,
        'What costs most people forget',
        <>How to make a decision based on <strong>numbers rather than emotions</strong></>,
      ]} />
    </>
  );
}

export function FivePercentRuleSection() {
  return (
    <>
      <Paragraph>
        The 5% rule offers a quick way to estimate whether renting or buying makes more sense.
      </Paragraph>

      <SubSection title="How It Works">
        <NumberList items={[
          "Take the home's purchase price",
          <>Multiply by <strong>5%</strong></>,
          <>Divide by <strong>12</strong> to get a monthly "breakeven rent" amount</>,
        ]} />

        <HighlightBox title="The Rule" color="blue">
          <p>If you can rent a comparable home for <strong>less</strong> than this number, renting likely wins.</p>
          <p className="mt-2">If rent is <strong>higher</strong>, buying might be better.</p>
        </HighlightBox>
      </SubSection>

      <SectionDivider />

      <SubSection title="Example Calculation">
        <Paragraph>For a <strong>$500,000 home</strong>:</Paragraph>
        <DataTable
          headers={['Step', 'Calculation', 'Result']}
          rows={[
            ['Annual Cost', '$500,000 × 5%', '$25,000'],
            ['Monthly Breakeven', '$25,000 ÷ 12', <strong>$2,083/month</strong>],
          ]}
        />
      </SubSection>

      <SectionDivider />

      <SubSection title="Where Does 5% Come From?">
        <Paragraph>The 5% represents three costs unique to ownership:</Paragraph>
        <DataTable
          headers={['Cost', 'Annual %', 'Description']}
          rows={[
            ['Property Taxes', '~1%', 'Varies by location'],
            ['Maintenance', '~1%', 'Roofs, appliances, repairs'],
            ['Cost of Capital', '~3%', 'What you could earn investing your down payment'],
          ]}
        />
      </SubSection>

      <SectionDivider />

      <div className="grid md:grid-cols-2 gap-4 my-6">
        <HighlightBox title="When It Works ✓" color="green">
          <p>As a quick sanity check in markets with typical price-to-rent ratios</p>
        </HighlightBox>
        <HighlightBox title="When It Fails ✗" color="red">
          <BulletList items={[
            'Expensive markets (SF, NYC) with extreme price-to-rent ratios',
            'Areas with unusually high property taxes',
            'Very short or very long holding periods',
          ]} />
        </HighlightBox>
      </div>

      <Callout type="info">
        <strong>Our calculator provides a more precise answer for your specific situation.</strong>
      </Callout>
    </>
  );
}

export function TrueCostOwnershipSection() {
  return (
    <>
      <Paragraph>
        The mortgage payment is just the beginning. Here's what home buyers actually pay:
      </Paragraph>

      <SubSection title="PITI: The Four Components">
        <DataTable
          headers={['Component', 'Description']}
          rows={[
            [<strong>P</strong>, 'Principal — The portion paying down your loan'],
            [<strong>I</strong>, 'Interest — What the bank charges for the loan'],
            [<strong>T</strong>, 'Taxes — Property taxes, typically 0.5-2.5% of home value annually'],
            [<strong>I</strong>, 'Insurance — Homeowner\'s insurance, 0.3-1% annually'],
          ]}
        />
      </SubSection>

      <SectionDivider />

      <SubSection title="Hidden Costs Most Buyers Forget">
        <HighlightBox title="Maintenance and Repairs" color="amber">
          <p>Plan for <strong>1-2% of home value annually</strong>. That's $4,000-$8,000 per year on a $400,000 home.</p>
          <BulletList items={[
            'HVAC replacements',
            'Roof repairs',
            'Plumbing issues',
            'Appliance breakdowns',
            'Constant small fixes',
          ]} />
        </HighlightBox>

        <HighlightBox title="HOA Fees" color="amber">
          <p>Condos and planned communities charge <strong>$200-$1,000+ monthly</strong>. These fees tend to increase over time and are essentially non-negotiable.</p>
        </HighlightBox>

        <HighlightBox title="PMI (Private Mortgage Insurance)" color="amber">
          <p>Required if your down payment is under 20%. Typically <strong>0.5-1% of the loan amount annually</strong>.</p>
          <p className="mt-2 text-amber-800">A $320,000 loan could add <strong>$133-$267 per month</strong> until you hit 20% equity.</p>
        </HighlightBox>
      </SubSection>

      <SectionDivider />

      <SubSection title="The Opportunity Cost">
        <Paragraph>Your down payment could be invested instead:</Paragraph>
        <DataTable
          headers={['Investment', '10-Year Growth']}
          rows={[
            ['$80,000 at 7% annually', <strong className="text-emerald-600">$157,000</strong>],
          ]}
        />
        <Paragraph>
          This opportunity cost is invisible but real—it's money you could have but don't because it's locked in your house.
        </Paragraph>
      </SubSection>

      <SectionDivider />

      <SubSection title="Transaction Costs">
        <DataTable
          headers={['Transaction', 'Cost']}
          rows={[
            ['Buying', '2-5% of purchase price'],
            ['Selling', '6-8% in realtor commissions and fees'],
          ]}
        />
        <Callout type="warning">
          On a $500,000 home, that's <strong>$40,000-$65,000</strong> just to buy and sell—money you never get back.
        </Callout>
      </SubSection>
    </>
  );
}

export function TrueCostRentingSection() {
  return (
    <>
      <Paragraph>
        Renting is often dismissed as "throwing money away," but let's look at what renters actually get:
      </Paragraph>

      <div className="grid md:grid-cols-2 gap-6 my-6">
        <HighlightBox title="What You Pay" color="amber">
          <BulletList items={[
            'Monthly rent',
            "Renter's insurance (~$15-30/month)",
            'Utilities (sometimes included)',
            'Security deposit (refundable)',
            'Broker fee in some markets (one-time)',
          ]} />
        </HighlightBox>

        <HighlightBox title="What You Get" color="green">
          <CheckList items={[
            'Flexibility to move without selling',
            'No maintenance or repair costs',
            'No property tax payments',
            'No risk of home value decline',
            "Liquidity—your savings aren't locked in a house",
          ]} />
        </HighlightBox>
      </div>

      <SectionDivider />

      <SubSection title="The Renter's Investment Advantage">
        <Paragraph>
          Here's what the "throwing money away" crowd misses: renters can invest the money they would have spent on a down payment, closing costs, and the ownership premium.
        </Paragraph>
        <DataTable
          headers={['Scenario', '10-Year Value']}
          rows={[
            ['$80,000 down payment invested at 7%', '$157,000'],
            ['+ $500/month savings invested', '$86,000'],
            [<strong>Total</strong>, <strong className="text-emerald-600">$243,000+</strong>],
          ]}
        />
      </SubSection>

      <SectionDivider />

      <SubSection title="The Flexibility Premium">
        <Paragraph><strong>Job opportunity in another city?</strong></Paragraph>
        <DataTable
          headers={['Renter', 'Homeowner']}
          rows={[
            ['Give 30-60 days notice', 'Months of selling process'],
            ['No transaction costs', '6-8% in selling costs'],
            ['No market risk', 'Risk of selling in a down market'],
          ]}
        />
        <Paragraph>
          For career-focused individuals in their 20s and 30s, this flexibility can be worth <strong>tens of thousands</strong> in better job opportunities.
        </Paragraph>
      </SubSection>
    </>
  );
}

export function TaxRealitySection() {
  return (
    <>
      <Callout type="warning">
        <p className="text-lg">"You'll save so much on taxes!"</p>
        <p className="mt-2">This is perhaps the most <strong>overstated benefit</strong> of homeownership.</p>
      </Callout>

      <SubSection title="How the Mortgage Interest Deduction Actually Works">
        <Paragraph>
          You can only deduct mortgage interest if you <strong>itemize your deductions</strong>. You should only itemize if your total itemized deductions exceed the standard deduction:
        </Paragraph>
        <DataTable
          headers={['Filing Status', 'Standard Deduction (2025)']}
          rows={[
            ['Single', '$15,750'],
            ['Married Filing Jointly', '$31,500'],
          ]}
        />
        <Callout type="info">
          <strong>Most homeowners</strong>, especially those with smaller mortgages or in low-tax states, are better off taking the standard deduction. In that case, the mortgage interest deduction provides <strong>zero tax benefit</strong>.
        </Callout>
      </SubSection>

      <SectionDivider />

      <SubSection title="A Realistic Example">
        <DataTable
          headers={['Deduction Type', 'Amount']}
          rows={[
            ['Mortgage interest', '$18,000'],
            ['Property taxes', '$6,000'],
            ['State income taxes', '$2,000'],
            [<strong>Total Itemized</strong>, <strong>$26,000</strong>],
          ]}
        />
        <HighlightBox title="If you're single (standard deduction $15,750):" color="blue">
          <BulletList items={[
            'Extra deductions from itemizing: $10,250',
            <>At 22% tax bracket: <strong>$2,255 in actual tax savings</strong></>,
          ]} />
        </HighlightBox>
        <Paragraph>
          Compare that to the <strong>$24,000+ you paid</strong> in interest and taxes. You're not "getting money back"—you're getting a small discount on a large expense.
        </Paragraph>
      </SubSection>

      <SectionDivider />

      <SubSection title="The SALT Cap">
        <Paragraph>
          The State and Local Tax (SALT) deduction is capped at <strong>$40,000</strong> (2025-2029).
        </Paragraph>
        <Paragraph>
          In high-tax states like California or New York, this limit prevents you from deducting all your property and state income taxes.
        </Paragraph>
      </SubSection>

      <SectionDivider />

      <HighlightBox title="Bottom Line" color="blue">
        <p>For most buyers, the tax benefit is real but modest—typically <strong>$1,000-$3,000/year</strong>. It shouldn't be the deciding factor in your rent vs. buy decision.</p>
      </HighlightBox>
    </>
  );
}

export function MarketConditionsSection() {
  return (
    <>
      <Paragraph>
        The rent vs. buy math isn't static—it shifts dramatically based on market conditions.
      </Paragraph>

      <SubSection title="Home Appreciation">
        <Paragraph>
          The historical average home appreciation is about <strong>3-4% nationally</strong>. But this varies enormously:
        </Paragraph>
        <DataTable
          headers={['Scenario', 'Annual Change']}
          rows={[
            ['Boom markets', '+7-10%'],
            ['Normal appreciation', '+3-4%'],
            ['Downturns (2008-2012)', '-20-30%'],
            ['Neighborhood variation', '±5%+'],
          ]}
        />
        <Callout type="warning">
          Be skeptical of anyone who promises consistent appreciation. Markets are cyclical, and timing matters more than most buyers realize.
        </Callout>
      </SubSection>

      <SectionDivider />

      <SubSection title="Interest Rates">
        <Paragraph>
          Mortgage rates have a <strong>massive impact</strong> on monthly costs. On a $400,000 loan:
        </Paragraph>
        <DataTable
          headers={['Rate', 'Monthly Payment', 'vs. 5% Rate']}
          rows={[
            ['5%', '$2,147', '—'],
            ['7%', '$2,661', <span className="text-red-600">+$514/mo</span>],
            ['8%', '$2,935', <span className="text-red-600">+$788/mo</span>],
          ]}
        />
        <Callout type="info">
          <strong>Higher rates favor renting; lower rates favor buying.</strong>
        </Callout>
      </SubSection>

      <SectionDivider />

      <SubSection title="Price-to-Rent Ratio">
        <Paragraph>
          This ratio (home price ÷ annual rent) indicates whether a market favors buyers or renters:
        </Paragraph>
        <DataTable
          headers={['Ratio', 'Implication']}
          rows={[
            [<span className="text-emerald-600 font-semibold">Under 15</span>, 'Buying often favorable'],
            ['15-20', 'Roughly neutral'],
            [<span className="text-red-600 font-semibold">Over 20</span>, 'Renting often more economical'],
          ]}
        />
        <Paragraph>
          In San Francisco and New York, ratios exceed <strong>30</strong>—strongly favoring renters. In cities like Cleveland or Detroit, ratios under <strong>12</strong> favor buyers.
        </Paragraph>
      </SubSection>

      <SectionDivider />

      <HighlightBox title="The 2024-2026 Market" color="blue">
        <p>As of 2026, elevated mortgage rates (6-7%) combined with high home prices in many markets have shifted the math toward renting in most major metros.</p>
        <p className="mt-2"><strong>Our calculator uses current conditions to give you an accurate comparison.</strong></p>
      </HighlightBox>
    </>
  );
}

export function HoldingPeriodSection() {
  return (
    <>
      <Paragraph>
        The length of time you'll live in a home is one of the <strong>most important variables</strong> in the rent vs. buy decision.
      </Paragraph>

      <SubSection title="Why Short Holds Favor Renting">
        <Paragraph>
          Transaction costs—the 2-5% to buy and 6-8% to sell—must be recouped before buying makes financial sense.
        </Paragraph>
        <DataTable
          headers={['Home Price', 'Transaction Costs']}
          rows={[
            ['$500,000', <span className="text-red-600 font-semibold">$40,000-$65,000</span>],
          ]}
        />
        <Callout type="warning">
          If you sell after just 2 years, you'll likely <strong>lose money</strong> even in an appreciating market once you factor in these costs plus the heavy interest payments in early loan years.
        </Callout>
      </SubSection>

      <SectionDivider />

      <SubSection title="The Breakeven Timeline">
        <Paragraph>
          Most analyses suggest you need to stay at least <strong>5-7 years</strong> for buying to beat renting. But this varies:
        </Paragraph>
        <DataTable
          headers={['Market Type', 'Typical Breakeven']}
          rows={[
            ['Expensive (high price-to-rent)', '10+ years'],
            ['Average', '5-7 years'],
            ['Affordable', '3-4 years'],
          ]}
        />
      </SubSection>

      <SectionDivider />

      <div className="grid md:grid-cols-2 gap-4 my-6">
        <HighlightBox title="✓ Confident you'll stay 5-7+ years?" color="green">
          <p>Buying often makes sense.</p>
        </HighlightBox>
        <HighlightBox title="✗ Reasonable chance you'll move sooner?" color="red">
          <p>The flexibility of renting has real financial value.</p>
          <BulletList items={[
            'Job change',
            'Relationship change',
            'Growing family',
            'Career opportunity',
          ]} />
        </HighlightBox>
      </div>

      <Callout type="info">
        <strong>Our Calculator Shows Your Breakeven</strong>
        <p className="mt-2">Input your numbers, and we'll tell you exactly what year buying beats renting in your specific scenario—or whether it never does within a 30-year horizon.</p>
      </Callout>
    </>
  );
}

export function LifestyleFactorsSection() {
  return (
    <>
      <Paragraph>
        Money isn't everything. Here are non-financial factors that should influence your decision:
      </Paragraph>

      <SubSection title="Job Flexibility">
        <Paragraph>Are you in an industry where opportunities might arise in other cities?</Paragraph>
        <HighlightBox title="High-mobility industries:" color="blue">
          <div className="flex gap-4">
            <span className="px-3 py-1 bg-blue-100 rounded-full text-sm">Tech</span>
            <span className="px-3 py-1 bg-blue-100 rounded-full text-sm">Finance</span>
            <span className="px-3 py-1 bg-blue-100 rounded-full text-sm">Consulting</span>
          </div>
        </HighlightBox>
        <Paragraph>Being tied to a home you can't quickly sell limits your options.</Paragraph>
      </SubSection>

      <SectionDivider />

      <SubSection title="Family Planning">
        <Paragraph>Expecting kids changes the equation. You may want:</Paragraph>
        <BulletList items={['More space', 'Better schools', 'A yard']} />
        <Paragraph>
          But be realistic about timing—the "starter home" you buy now might not be where you want to raise a family.
        </Paragraph>
      </SubSection>

      <SectionDivider />

      <SubSection title="Maintenance Tolerance">
        <DataTable
          headers={['Love home projects?', 'Dread them?']}
          rows={[
            ['Ownership = opportunity', 'Ownership = burden'],
            ['DIY savings', 'Hire for everything'],
            ['Weekend projects', 'Weekend freedom'],
          ]}
        />
        <Paragraph>
          Owning means you're responsible for every repair, upgrade, and maintenance task.
        </Paragraph>
      </SubSection>

      <SectionDivider />

      <SubSection title="Risk Tolerance">
        <Callout type="warning">
          Homeownership concentrates your wealth in a <strong>single, illiquid asset</strong>.
        </Callout>
        <DataTable
          headers={['Scenario', 'Homeowner', 'Renter']}
          rows={[
            ['Local economy tanks', 'Lose job + home equity', 'Can relocate easily'],
            ['Investment approach', 'One asset, one location', 'Diversified globally'],
          ]}
        />
      </SubSection>

      <SectionDivider />

      <HighlightBox title="The Honest Assessment" color="blue">
        <p>There's nothing wrong with prioritizing lifestyle over pure financial optimization.</p>
        <p className="mt-2"><strong>Just make sure you're making an informed choice, not rationalizing an emotional decision after the fact.</strong></p>
      </HighlightBox>
    </>
  );
}

export function CommonMistakesSection() {
  return (
    <>
      <Paragraph>
        These errors lead people to buy when they shouldn't—or underestimate the true costs:
      </Paragraph>

      <HighlightBox title="❌ Comparing Rent to Mortgage Payment Only" color="red">
        <p>Your mortgage payment is just principal and interest. You also pay:</p>
        <BulletList items={[
          'Property taxes',
          'Insurance',
          'Maintenance',
          'HOA (if applicable)',
          'PMI (if applicable)',
        ]} />
        <p className="mt-2 font-semibold">True ownership costs are typically 30-50% higher than the mortgage payment alone.</p>
      </HighlightBox>

      <SectionDivider />

      <HighlightBox title="❌ Ignoring Opportunity Cost" color="red">
        <p>That $80,000 down payment could be invested in index funds averaging 7% returns.</p>
        <DataTable
          headers={['Time', 'Foregone Gains']}
          rows={[
            ['10 years', '~$77,000'],
          ]}
        />
        <p>It's invisible money, but it's real.</p>
      </HighlightBox>

      <SectionDivider />

      <HighlightBox title="❌ Overestimating Appreciation" color="red">
        <Callout type="warning">
          "Real estate always goes up"
        </Callout>
        <p>This ignores 2008-2012 when prices fell <strong>30%+</strong> in many markets. Even in normal times, appreciation varies wildly by location.</p>
      </HighlightBox>

      <SectionDivider />

      <HighlightBox title="❌ Underestimating Maintenance" color="red">
        <p>First-time buyers consistently underestimate how much they'll spend. That "move-in ready" home still needs:</p>
        <BulletList items={[
          'New roof in 10 years',
          'HVAC replacement in 15 years',
          'Countless small repairs along the way',
        ]} />
      </HighlightBox>

      <SectionDivider />

      <HighlightBox title="❌ Assuming Tax Savings You Won't Get" color="red">
        <p>Most buyers don't itemize deductions, meaning the mortgage interest deduction provides <strong>zero benefit</strong>.</p>
        <p className="mt-2">Calculate your actual tax situation, not the theoretical maximum.</p>
      </HighlightBox>

      <SectionDivider />

      <HighlightBox title="❌ Emotional Attachment to Ownership" color="red">
        <Callout type="warning">
          <p>"I don't want to pay someone else's mortgage"</p>
          <p>"Rent is throwing money away"</p>
        </Callout>
        <p>These are <strong>emotional arguments, not financial ones</strong>. When you pay rent, you're buying housing—a real service with real value.</p>
      </HighlightBox>

      <SectionDivider />

      <Callout type="info">
        <strong>❌ Not Running the Numbers</strong>
        <p className="mt-2">The biggest mistake? <strong>Not doing the actual math for your specific situation.</strong></p>
        <p className="mt-2">That's what our calculator is for.</p>
      </Callout>
    </>
  );
}

export function UsingCalculatorSection() {
  return (
    <>
      <Paragraph>
        Here's how to get the most accurate results from our rent vs. buy calculator:
      </Paragraph>

      <SubSection title="Start with Current Market Data">
        <BulletList items={[
          <>Enter your <strong>actual current rent</strong> or a realistic estimate for comparable housing</>,
          <>For purchase price, use <strong>recently sold homes</strong> in your target neighborhood, not listing prices</>,
        ]} />
      </SubSection>

      <SectionDivider />

      <SubSection title="Be Realistic About Holding Period">
        <Paragraph>How long will you <strong>actually</strong> stay?</Paragraph>
        <Paragraph>
          If there's uncertainty, run multiple scenarios. The breakeven analysis shows you the risk of leaving early.
        </Paragraph>
      </SubSection>

      <SectionDivider />

      <SubSection title="Use Conservative Appreciation">
        <DataTable
          headers={['Assumption', 'Risk Level']}
          rows={[
            ['3-4% annually', <span className="text-emerald-600">Historically reasonable</span>],
            ['5%+', <span className="text-amber-600">Optimistic, adds risk</span>],
          ]}
        />
      </SubSection>

      <SectionDivider />

      <SubSection title="Don't Forget All Ownership Costs">
        <DataTable
          headers={['Cost', 'Typical Range']}
          rows={[
            ['Property tax rate', '0.5-2.5% annually'],
            ['Insurance', '0.3-1% annually'],
            ['Maintenance', '1-2% of home value'],
            ['HOA (if applicable)', '$200-$1,000+/month'],
          ]}
        />
      </SubSection>

      <SectionDivider />

      <SubSection title="Check the Tax Calculation">
        <Callout type="info">
          Our calculator shows whether you'll benefit from itemizing deductions. Many buyers are surprised to learn the mortgage interest deduction doesn't help them.
        </Callout>
      </SubSection>

      <SectionDivider />

      <SubSection title="Compare the Wealth Chart">
        <Paragraph>
          The most important output is the <strong>wealth comparison over time</strong>. This shows your total net worth in both scenarios, accounting for:
        </Paragraph>
        <BulletList items={[
          'Home equity',
          'Investment growth',
          'All costs',
        ]} />
      </SubSection>

      <SectionDivider />

      <SubSection title="Run Multiple Scenarios">
        <Paragraph>What if:</Paragraph>
        <BulletList items={[
          'Rates go up or down?',
          'You need to leave early?',
          'Appreciation is lower than expected?',
        ]} />
        <Paragraph>
          Understanding how sensitive your decision is to these factors helps you make a <strong>robust choice</strong>.
        </Paragraph>
      </SubSection>

      <SectionDivider />

      <HighlightBox title="Ready to see your numbers?" color="green">
        <p className="text-lg font-semibold">Use our calculator for a personalized, accurate rent vs. buy comparison.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Try the Calculator
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </HighlightBox>

      <SectionDivider />

      {/* Affiliate Widget */}
      <MortgageRateWidget variant="full" />
    </>
  );
}

// Export section data for the page
export const guideSectionsData = [
  { id: 'introduction', title: 'Introduction', icon: '👋', Component: IntroductionSection },
  { id: 'five-percent-rule', title: 'The 5% Rule Explained', icon: '🧮', Component: FivePercentRuleSection },
  { id: 'true-cost-ownership', title: 'True Cost of Homeownership', icon: '🏠', Component: TrueCostOwnershipSection },
  { id: 'true-cost-renting', title: 'True Cost of Renting', icon: '🔑', Component: TrueCostRentingSection },
  { id: 'tax-reality', title: 'The Tax Benefit Reality', icon: '📋', Component: TaxRealitySection },
  { id: 'market-conditions', title: 'Market Conditions Matter', icon: '📈', Component: MarketConditionsSection },
  { id: 'holding-period', title: 'How Long You Will Stay', icon: '⏱️', Component: HoldingPeriodSection },
  { id: 'lifestyle-factors', title: 'Lifestyle Factors', icon: '🎯', Component: LifestyleFactorsSection },
  { id: 'common-mistakes', title: 'Common Mistakes', icon: '⚠️', Component: CommonMistakesSection },
  { id: 'using-calculator', title: 'Using Our Calculator', icon: '🖩', Component: UsingCalculatorSection },
];
