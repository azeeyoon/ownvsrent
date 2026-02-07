# Design: Calculation Engine for ownvsrent.io

**Date:** 2026-02-07
**Status:** Approved

## Summary

Build the Python calculation engine that powers the rent vs. buy comparison. Month-by-month simulation with accurate tax treatment, PMI handling, and wealth tracking for both scenarios.

---

## Module Structure

```
backend/src/ownvsrent/engine/
├── __init__.py          # Public API exports
├── types.py             # Pydantic models
├── defaults.py          # Constants with citations
├── amortization.py      # Mortgage payment schedule
├── taxes.py             # Tax benefit calculations
├── renting.py           # Renter cash flows
├── buying.py            # Buyer cash flows
├── wealth.py            # Net wealth at horizon
├── sensitivity.py       # Tornado chart data
├── montecarlo.py        # Monte Carlo simulation
└── calculator.py        # Main orchestrator
```

---

## Core Types

### CalculatorInputs

```python
class CalculatorInputs(BaseModel):
    # Renting
    monthly_rent: float
    annual_rent_increase: float      # decimal 0.03 = 3%
    renter_insurance: float
    security_deposit: float          # months of rent
    broker_fee: float                # decimal, one-time

    # Buying
    purchase_price: float
    down_payment_percent: float      # decimal 0.20 = 20%
    mortgage_rate: float             # decimal annual
    loan_term_years: Literal[10, 15, 20, 25, 30]
    property_tax_rate: float
    home_insurance_rate: float
    hoa_monthly: float
    maintenance_rate: float
    pmi_rate: float
    buyer_closing_costs_percent: float
    selling_costs_percent: float

    # Financial
    holding_period_years: int
    annual_appreciation: float
    annual_investment_return: float
    marginal_tax_rate: float
    state_tax_rate: float
    filing_status: Literal["single", "married"]
    capital_gains_tax_rate: float
```

### CalculatorResults

```python
class CalculatorResults(BaseModel):
    verdict: Literal["buy", "rent", "toss-up"]
    break_even_year: int | None
    net_benefit_at_horizon: float
    renter_wealth_at_horizon: float
    buyer_wealth_at_horizon: float
    monthly_snapshots: list[MonthlySnapshot]
    yearly_snapshots: list[YearlySnapshot]
    monthly_rent: float
    monthly_ownership_cost: float
    itemization_beneficial: bool
    pmi_removed_month: int | None
```

---

## Critical Calculation Rules

### 1. Month-by-Month Simulation

Do NOT use annual approximations. Iterate monthly for accuracy in:
- Amortization (principal/interest split)
- PMI removal timing
- Investment compounding
- Rent escalation

### 2. PMI Auto-Removal

PMI stops when `current_balance / current_home_value <= 0.80`. Use current appraised value (with appreciation), not original purchase price.

### 3. Tax Benefit = Excess Only

```python
tax_benefit = max(0, (itemized - standard_deduction) * marginal_rate)
```

If itemized < standard, mortgage interest provides ZERO benefit.

### 4. SALT Cap (OBBBA 2025)

- 2025–2029: $40,000 ($20,000 MFS)
- 2030+: reverts to $10,000
- Phase-out: 30% reduction for MAGI > $500K

### 5. PMI Deductibility

Starting tax year 2026, PMI premiums are deductible as mortgage interest. Phase-out: AGI $100K–$110K.

### 6. Mortgage Interest Cap

Deductible on first $750K of acquisition debt only. Prorate if loan > $750K.

### 7. Renter Invests the Difference

Renter's portfolio starts with:
- Down payment amount
- Buyer's closing costs
- Monthly savings when rent < ownership cost

### 8. Both Sides Invest Surpluses

If buying is cheaper in a given month, buyer invests the difference too. Fair comparison requires symmetry.

### 9. Capital Gains Exemption

$250K single / $500K married on home sale. Only gains above exemption are taxed.

---

## Constants (defaults.py)

```python
# Tax (2025 base)
STANDARD_DEDUCTION_SINGLE_2025 = 15_750
STANDARD_DEDUCTION_MARRIED_2025 = 31_500

# SALT caps
SALT_CAP_2025_2029 = 40_000
SALT_CAP_2030_PLUS = 10_000

# Mortgage
MORTGAGE_INTEREST_CAP = 750_000
PMI_LTV_THRESHOLD = 0.80

# Capital gains
CAP_GAINS_EXEMPTION_SINGLE = 250_000
CAP_GAINS_EXEMPTION_MARRIED = 500_000
```

---

## API Endpoints

```python
POST /api/calculate      -> CalculatorResults
POST /api/sensitivity    -> list[SensitivityResult]
POST /api/montecarlo     -> MonteCarloResult
```

All endpoints accept `CalculatorInputs` as request body.

---

## Testing Requirements

1. **Amortization accuracy** - verify against Bankrate
2. **PMI removal** - correct month with appreciation
3. **Tax deductions** - standard wins, itemized wins, SALT cap binding
4. **Breakeven calculation** - matches expected year
5. **Investment tracking** - renter invests down payment + closing costs
6. **Capital gains exemption** - applied correctly
7. **Edge cases** - 100% down, 0% down, negative appreciation, 1-year hold

---

## Implementation Order

1. types.py - Data models
2. defaults.py - Constants
3. amortization.py - Mortgage math
4. taxes.py - Tax benefit calculation
5. renting.py - Renter cash flows
6. buying.py - Buyer cash flows
7. wealth.py - Final wealth comparison
8. calculator.py - Main orchestrator
9. sensitivity.py - Tornado chart
10. montecarlo.py - Simulations
11. API routes update
12. Integration tests
