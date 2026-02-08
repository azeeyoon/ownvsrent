export const methodologySections = [
  {
    id: 'overview',
    title: 'Overview',
    content: `Our rent vs buy calculator uses month-by-month simulation to accurately compare the financial outcomes of renting versus buying a home. Unlike simpler calculators that use annual approximations, we model each month individually to capture timing-dependent factors like PMI removal, amortization schedules, and investment compounding.

This precision matters because financial decisions compound over time. A small error early in the calculation can lead to significantly misleading results over a 7-10 year horizon. Our approach ensures that every factor is accounted for at the right time.

The calculator compares two scenarios: (1) renting and investing the money you would have spent on a down payment and closing costs, versus (2) buying a home and building equity. At the end of your specified holding period, we compare total wealth in both scenarios to determine which option leaves you better off financially.`
  },
  {
    id: 'renting',
    title: 'Renting Calculations',
    content: `**Monthly Rent Cost**
Starting rent increases each year by your specified annual rent increase rate. For month M in year Y:
Rent(M) = InitialRent × (1 + AnnualIncrease)^Y

**Renter's Investment Portfolio**
The renter starts with the equivalent of the buyer's down payment and closing costs invested on day one. Each month, if renting costs less than owning, the renter invests the difference:
MonthlyInvestment = max(0, TotalOwnershipCost - TotalRentCost)

The portfolio grows at a monthly rate derived from your annual investment return:
MonthlyRate = (1 + AnnualReturn)^(1/12) - 1

**Final Renter Wealth**
At the end of the holding period, we calculate the after-tax value of the renter's portfolio. Capital gains tax applies only to the gains (portfolio value minus total contributions).`
  },
  {
    id: 'buying',
    title: 'Buying Calculations',
    content: `**Amortization Schedule**
We calculate an exact month-by-month amortization schedule for your mortgage. Each payment splits between principal and interest:
MonthlyPayment = Principal × [r(1+r)^n] / [(1+r)^n - 1]
where r = annual rate / 12, n = loan term in months.

**PITI Breakdown**
Your total monthly housing cost includes:
- Principal & Interest: Fixed monthly mortgage payment
- Property Tax: (Home Value × Annual Rate) / 12
- Insurance: (Home Value × Annual Rate) / 12

**PMI (Private Mortgage Insurance)**
Required when down payment is less than 20%. PMI rate applies to original loan amount. PMI automatically terminates when your loan balance reaches 78% of the original purchase price, or when the loan-to-value ratio (based on current appraised value with appreciation) reaches 80%.

**Maintenance & HOA**
Annual maintenance (typically 1-2% of home value) is divided monthly. HOA fees are added as specified.

**Home Appreciation**
Home value grows monthly at:
HomeValue(M) = PurchasePrice × (1 + AnnualAppreciation)^(M/12)

**Buyer's Investment Portfolio**
If buying costs less than renting in any month, the buyer invests that difference using the same investment return assumptions as the renter.`
  },
  {
    id: 'taxes',
    title: 'Tax Calculations',
    content: `**Standard vs. Itemized Deductions**
This is where most calculators get it wrong. You only benefit from mortgage interest and property tax deductions if your total itemized deductions exceed the standard deduction:
- Single: $15,750 (2025, adjusted for inflation)
- Married Filing Jointly: $31,500 (2025, adjusted for inflation)

Your tax benefit is: max(0, (ItemizedTotal - StandardDeduction) × MarginalRate)

**SALT Cap (State and Local Tax)**
The 2025 OBBBA modified SALT deduction limits:
- 2025-2029: $40,000 cap ($20,000 MFS)
- Inflation adjustment: 1% annually
- Phase-out: 30% reduction for MAGI > $500K (floor of $10K)
- 2030+: Reverts to $10,000 cap

**Mortgage Interest Deduction**
Deductible on the first $750,000 of acquisition debt. If your loan exceeds this, we prorate the deductible amount.

**PMI Deductibility**
Starting tax year 2026 (OBBBA), PMI premiums are treated as deductible mortgage interest. Phase-out applies for AGI between $100K-$110K.`
  },
  {
    id: 'wealth',
    title: 'Wealth Comparison',
    content: `**Buyer's Final Wealth**
At the end of your holding period, the buyer's wealth equals:
HomeValue - RemainingMortgage - SellingCosts - CapitalGainsTax + InvestmentPortfolio

**Selling Costs**
Typically 6-8% of sale price, covering realtor commissions, transfer taxes, and closing costs.

**Capital Gains on Home Sale**
The IRS allows exclusion of $250,000 (single) or $500,000 (married) in capital gains on your primary residence if you've lived there 2+ of the last 5 years. Only gains above this exemption are taxed at your capital gains rate.

**Renter's Final Wealth**
The renter's wealth is their investment portfolio value minus capital gains tax on investment gains.

**Net Benefit**
The final comparison: BuyerWealth - RenterWealth
- Positive = buying wins
- Negative = renting wins
- Within ±$10,000 = too close to call (toss-up)`
  },
  {
    id: 'sources',
    title: 'Our Sources',
    content: `**Tax Law References**
- IRS Publication 936: Home Mortgage Interest Deduction
- IRS Publication 530: Tax Information for Homeowners
- One Big Beautiful Bill Act (OBBBA) 2025: SALT cap modifications
- IRC Section 121: Exclusion of gain from sale of principal residence

**Data Sources**
- Freddie Mac: Mortgage rate trends
- U.S. Census Bureau: Housing cost statistics
- Bureau of Labor Statistics: Inflation data
- S&P 500: Historical investment returns

**Transparency**
Our calculator's source code is available for review. We have no affiliation with real estate agents, mortgage lenders, or anyone with a financial interest in your decision. We show you the math—nothing more, nothing less.`
  }
];
