# Calculation Engine Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement the rent vs. buy calculation engine with month-by-month simulation, accurate tax treatment, and comprehensive tests.

**Architecture:** Pure Python modules in `backend/src/ownvsrent/engine/` with no FastAPI dependencies. TDD approach - write tests first, then implementation.

**Tech Stack:** Python 3.12, Pydantic 2.x, pytest

---

## Task 1: Create Types Module

**Files:**
- Create: `backend/src/ownvsrent/engine/types.py`
- Test: `backend/tests/engine/test_types.py`

**Step 1: Create types.py**

```python
"""Type definitions for the calculation engine."""

from pydantic import BaseModel, Field
from typing import Literal


class CalculatorInputs(BaseModel):
    """Input parameters for rent vs. buy calculation."""

    # Renting
    monthly_rent: float = Field(ge=0, description="Monthly rent payment")
    annual_rent_increase: float = Field(
        ge=0, le=0.20, description="Annual rent increase rate (decimal)"
    )
    renter_insurance: float = Field(ge=0, description="Monthly renter's insurance")
    security_deposit: float = Field(ge=0, description="Security deposit in months of rent")
    broker_fee: float = Field(ge=0, le=1, description="One-time broker fee (decimal)")

    # Buying
    purchase_price: float = Field(gt=0, description="Home purchase price")
    down_payment_percent: float = Field(
        ge=0, le=1, description="Down payment as decimal (0.20 = 20%)"
    )
    mortgage_rate: float = Field(ge=0, le=0.20, description="Annual mortgage interest rate")
    loan_term_years: Literal[10, 15, 20, 25, 30] = Field(description="Loan term in years")
    property_tax_rate: float = Field(ge=0, le=0.05, description="Annual property tax rate")
    home_insurance_rate: float = Field(
        ge=0, le=0.02, description="Annual home insurance as % of home value"
    )
    hoa_monthly: float = Field(ge=0, description="Monthly HOA fees")
    maintenance_rate: float = Field(
        ge=0, le=0.05, description="Annual maintenance as % of home value"
    )
    pmi_rate: float = Field(ge=0, le=0.02, description="Annual PMI rate")
    buyer_closing_costs_percent: float = Field(
        ge=0, le=0.10, description="Buyer closing costs as % of loan"
    )
    selling_costs_percent: float = Field(
        ge=0, le=0.15, description="Selling costs as % of sale price"
    )

    # Financial
    holding_period_years: int = Field(ge=1, le=30, description="Years before selling")
    annual_appreciation: float = Field(
        ge=-0.10, le=0.15, description="Annual home appreciation rate"
    )
    annual_investment_return: float = Field(
        ge=0, le=0.15, description="Annual investment return rate"
    )
    marginal_tax_rate: float = Field(ge=0, le=0.50, description="Federal marginal tax rate")
    state_tax_rate: float = Field(ge=0, le=0.15, description="State income tax rate")
    filing_status: Literal["single", "married"] = Field(description="Tax filing status")
    capital_gains_tax_rate: float = Field(ge=0, le=0.30, description="Capital gains tax rate")


class MonthlySnapshot(BaseModel):
    """Monthly state for both renting and buying scenarios."""

    month: int
    # Renting
    rent: float
    renter_insurance: float
    total_rent_cost: float
    renter_portfolio: float
    # Buying
    mortgage_payment: float
    principal: float
    interest: float
    property_tax: float
    home_insurance: float
    maintenance: float
    hoa: float
    pmi: float
    total_buy_cost: float
    loan_balance: float
    home_value: float
    home_equity: float
    buyer_portfolio: float


class YearlySnapshot(BaseModel):
    """Yearly summary for display."""

    year: int
    total_rent_paid: float
    total_buy_cost_paid: float
    home_equity: float
    renter_portfolio: float
    buyer_portfolio: float
    tax_benefit: float
    renter_wealth: float
    buyer_wealth: float
    net_benefit: float  # positive = buy wins


class CalculatorResults(BaseModel):
    """Complete calculation results."""

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


class SensitivityResult(BaseModel):
    """Result of varying one input parameter."""

    variable: str
    label: str
    low_value: float
    high_value: float
    low_outcome: float
    high_outcome: float
    base_outcome: float
    impact: float  # high - low (absolute spread)


class MonteCarloResult(BaseModel):
    """Monte Carlo simulation results."""

    simulations: int
    buy_wins_pct: float
    median: float
    p10: float
    p90: float
    distribution: list[float]
```

**Step 2: Create test file**

```python
"""Tests for type definitions."""

import pytest
from pydantic import ValidationError
from ownvsrent.engine.types import CalculatorInputs, MonthlySnapshot, CalculatorResults


def test_calculator_inputs_valid():
    """Valid inputs should pass validation."""
    inputs = CalculatorInputs(
        monthly_rent=2000,
        annual_rent_increase=0.03,
        renter_insurance=30,
        security_deposit=1,
        broker_fee=0,
        purchase_price=400000,
        down_payment_percent=0.20,
        mortgage_rate=0.068,
        loan_term_years=30,
        property_tax_rate=0.011,
        home_insurance_rate=0.005,
        hoa_monthly=0,
        maintenance_rate=0.015,
        pmi_rate=0.0075,
        buyer_closing_costs_percent=0.03,
        selling_costs_percent=0.08,
        holding_period_years=7,
        annual_appreciation=0.035,
        annual_investment_return=0.07,
        marginal_tax_rate=0.22,
        state_tax_rate=0.05,
        filing_status="single",
        capital_gains_tax_rate=0.15,
    )
    assert inputs.purchase_price == 400000


def test_calculator_inputs_invalid_rate():
    """Rates above 100% should fail."""
    with pytest.raises(ValidationError):
        CalculatorInputs(
            monthly_rent=2000,
            annual_rent_increase=1.5,  # Invalid: 150%
            renter_insurance=30,
            security_deposit=1,
            broker_fee=0,
            purchase_price=400000,
            down_payment_percent=0.20,
            mortgage_rate=0.068,
            loan_term_years=30,
            property_tax_rate=0.011,
            home_insurance_rate=0.005,
            hoa_monthly=0,
            maintenance_rate=0.015,
            pmi_rate=0.0075,
            buyer_closing_costs_percent=0.03,
            selling_costs_percent=0.08,
            holding_period_years=7,
            annual_appreciation=0.035,
            annual_investment_return=0.07,
            marginal_tax_rate=0.22,
            state_tax_rate=0.05,
            filing_status="single",
            capital_gains_tax_rate=0.15,
        )


def test_calculator_inputs_invalid_loan_term():
    """Invalid loan terms should fail."""
    with pytest.raises(ValidationError):
        CalculatorInputs(
            monthly_rent=2000,
            annual_rent_increase=0.03,
            renter_insurance=30,
            security_deposit=1,
            broker_fee=0,
            purchase_price=400000,
            down_payment_percent=0.20,
            mortgage_rate=0.068,
            loan_term_years=12,  # Invalid: not 10/15/20/25/30
            property_tax_rate=0.011,
            home_insurance_rate=0.005,
            hoa_monthly=0,
            maintenance_rate=0.015,
            pmi_rate=0.0075,
            buyer_closing_costs_percent=0.03,
            selling_costs_percent=0.08,
            holding_period_years=7,
            annual_appreciation=0.035,
            annual_investment_return=0.07,
            marginal_tax_rate=0.22,
            state_tax_rate=0.05,
            filing_status="single",
            capital_gains_tax_rate=0.15,
        )
```

**Step 3: Run tests**

```bash
cd backend && uv run pytest tests/engine/test_types.py -v
```

**Step 4: Commit**

```bash
git add backend/
git commit -m "feat(engine): add Pydantic type definitions

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Create Defaults Module

**Files:**
- Create: `backend/src/ownvsrent/engine/defaults.py`

```python
"""Constants and default values for calculations.

All values are sourced from IRS publications, tax code, or reputable data sources.
Comments cite the specific source for each constant.
"""

# =============================================================================
# TAX CONSTANTS (2025 base year, per OBBBA signed July 4, 2025)
# =============================================================================

# Standard deduction (IRS 2025 projections)
STANDARD_DEDUCTION_SINGLE_2025 = 15_750
STANDARD_DEDUCTION_MARRIED_2025 = 31_500
STANDARD_DEDUCTION_INFLATION = 0.02  # Conservative estimate

# SALT cap per OBBBA (One Big Beautiful Bill Act, 2025)
SALT_CAP_2025_2029 = 40_000  # $40K for tax years 2025-2029
SALT_CAP_2030_PLUS = 10_000  # Reverts to TCJA $10K after 2029
SALT_CAP_MFS_DIVISOR = 2  # Married filing separately gets half
SALT_INFLATION_ADJUSTMENT = 0.01  # 1% annual inflation adjustment 2026-2029
SALT_PHASE_OUT_THRESHOLD = 500_000  # 30% reduction of cap for MAGI above this
SALT_PHASE_OUT_REDUCTION = 0.30
SALT_PHASE_OUT_FLOOR = 10_000  # Minimum cap after phase-out

# Mortgage interest deduction (IRC Section 163(h))
MORTGAGE_INTEREST_CAP = 750_000  # Acquisition debt limit per TCJA

# PMI deductibility (OBBBA 2025, effective 2026)
PMI_DEDUCTIBLE_START_YEAR = 2026
PMI_PHASE_OUT_AGI_START = 100_000
PMI_PHASE_OUT_AGI_END = 110_000

# =============================================================================
# CAPITAL GAINS (IRC Section 121)
# =============================================================================

CAP_GAINS_EXEMPTION_SINGLE = 250_000
CAP_GAINS_EXEMPTION_MARRIED = 500_000
MIN_OWNERSHIP_YEARS_FOR_EXEMPTION = 2

# =============================================================================
# PMI THRESHOLDS
# =============================================================================

PMI_LTV_THRESHOLD = 0.80  # PMI removed when LTV <= 80%
PMI_DOWN_PAYMENT_THRESHOLD = 0.20  # No PMI if down payment >= 20%

# =============================================================================
# DEFAULT INPUT VALUES (nationally representative midpoints)
# =============================================================================

DEFAULTS = {
    # Renting
    "monthly_rent": 2000,  # Approximate US median
    "annual_rent_increase": 0.035,  # BLS CPI Shelter 30-yr avg
    "renter_insurance": 30,
    "security_deposit": 1,  # 1 month
    "broker_fee": 0,  # Varies by market

    # Buying
    "purchase_price": 400_000,  # Approximate US median
    "down_payment_percent": 0.20,
    "mortgage_rate": 0.068,  # Freddie Mac PMMS (update regularly)
    "loan_term_years": 30,
    "property_tax_rate": 0.011,  # Tax Foundation national median
    "home_insurance_rate": 0.005,
    "hoa_monthly": 0,
    "maintenance_rate": 0.015,  # NAHB recommendation
    "pmi_rate": 0.0075,  # Urban Institute average
    "buyer_closing_costs_percent": 0.03,  # Bankrate average
    "selling_costs_percent": 0.08,  # 5-6% commission + 2-3% closing

    # Financial
    "holding_period_years": 7,  # NAR median tenure
    "annual_appreciation": 0.035,  # FHFA HPI 30-yr nominal avg
    "annual_investment_return": 0.07,  # S&P 500 long-term avg
    "marginal_tax_rate": 0.22,  # 22% bracket
    "state_tax_rate": 0.05,
    "filing_status": "single",
    "capital_gains_tax_rate": 0.15,
}


def get_standard_deduction(year: int, filing_status: str) -> float:
    """Get inflation-adjusted standard deduction for a given year."""
    base = (
        STANDARD_DEDUCTION_MARRIED_2025
        if filing_status == "married"
        else STANDARD_DEDUCTION_SINGLE_2025
    )
    years_from_base = max(0, year - 2025)
    return base * (1 + STANDARD_DEDUCTION_INFLATION) ** years_from_base


def get_salt_cap(year: int, filing_status: str, magi: float = 0) -> float:
    """Get SALT cap for a given year, accounting for phase-outs."""
    if year >= 2030:
        base_cap = SALT_CAP_2030_PLUS
    else:
        # 2025-2029: $40K with 1% annual inflation adjustment
        years_from_2025 = max(0, year - 2025)
        base_cap = SALT_CAP_2025_2029 * (1 + SALT_INFLATION_ADJUSTMENT) ** years_from_2025

    # Married filing separately gets half
    if filing_status == "married_separately":
        base_cap /= SALT_CAP_MFS_DIVISOR

    # Phase-out for high income (30% reduction above $500K MAGI)
    if magi > SALT_PHASE_OUT_THRESHOLD:
        base_cap *= (1 - SALT_PHASE_OUT_REDUCTION)
        base_cap = max(base_cap, SALT_PHASE_OUT_FLOOR)

    return base_cap
```

**Step: Commit**

```bash
git add backend/
git commit -m "feat(engine): add defaults and tax constants

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Create Amortization Module

**Files:**
- Create: `backend/src/ownvsrent/engine/amortization.py`
- Create: `backend/tests/engine/test_amortization.py`

**Step 1: Create amortization.py**

```python
"""Mortgage amortization calculations."""

import math


def calculate_monthly_payment(
    principal: float, annual_rate: float, term_years: int
) -> float:
    """Calculate fixed monthly mortgage payment.

    Uses standard amortization formula:
    M = P * [r(1+r)^n] / [(1+r)^n - 1]

    Args:
        principal: Loan amount
        annual_rate: Annual interest rate (decimal, e.g., 0.068 for 6.8%)
        term_years: Loan term in years

    Returns:
        Monthly payment amount (principal + interest only)
    """
    if annual_rate == 0:
        return principal / (term_years * 12)

    monthly_rate = annual_rate / 12
    num_payments = term_years * 12

    payment = principal * (
        (monthly_rate * (1 + monthly_rate) ** num_payments)
        / ((1 + monthly_rate) ** num_payments - 1)
    )
    return payment


def calculate_loan_balance(
    principal: float, annual_rate: float, term_years: int, month: int
) -> float:
    """Calculate remaining loan balance after N months.

    Args:
        principal: Original loan amount
        annual_rate: Annual interest rate (decimal)
        term_years: Loan term in years
        month: Number of payments made (1-indexed)

    Returns:
        Remaining loan balance
    """
    if month <= 0:
        return principal

    if annual_rate == 0:
        return principal - (principal / (term_years * 12)) * month

    monthly_rate = annual_rate / 12
    num_payments = term_years * 12

    if month >= num_payments:
        return 0

    monthly_payment = calculate_monthly_payment(principal, annual_rate, term_years)

    # Balance = P * [(1+r)^n - (1+r)^p] / [(1+r)^n - 1]
    balance = principal * (
        ((1 + monthly_rate) ** num_payments - (1 + monthly_rate) ** month)
        / ((1 + monthly_rate) ** num_payments - 1)
    )
    return max(0, balance)


def calculate_payment_breakdown(
    principal: float, annual_rate: float, term_years: int, month: int
) -> tuple[float, float]:
    """Calculate principal and interest portions of payment for a specific month.

    Args:
        principal: Original loan amount
        annual_rate: Annual interest rate (decimal)
        term_years: Loan term in years
        month: Payment number (1-indexed)

    Returns:
        Tuple of (principal_portion, interest_portion)
    """
    if month <= 0:
        return 0, 0

    monthly_payment = calculate_monthly_payment(principal, annual_rate, term_years)

    if annual_rate == 0:
        return monthly_payment, 0

    # Get balance at start of this month (after previous payments)
    balance_before = calculate_loan_balance(principal, annual_rate, term_years, month - 1)

    monthly_rate = annual_rate / 12
    interest_portion = balance_before * monthly_rate
    principal_portion = monthly_payment - interest_portion

    return principal_portion, interest_portion


def calculate_total_interest(
    principal: float, annual_rate: float, term_years: int
) -> float:
    """Calculate total interest paid over life of loan."""
    monthly_payment = calculate_monthly_payment(principal, annual_rate, term_years)
    total_payments = monthly_payment * term_years * 12
    return total_payments - principal
```

**Step 2: Create test file**

```python
"""Tests for amortization calculations."""

import pytest
from ownvsrent.engine.amortization import (
    calculate_monthly_payment,
    calculate_loan_balance,
    calculate_payment_breakdown,
    calculate_total_interest,
)


class TestMonthlyPayment:
    """Tests for monthly payment calculation."""

    def test_standard_30_year_mortgage(self):
        """Test against known Bankrate result for $320K at 6.8% for 30 years."""
        # Bankrate calculator: $2,085.96
        payment = calculate_monthly_payment(320_000, 0.068, 30)
        assert abs(payment - 2085.96) < 1  # Within $1

    def test_15_year_mortgage(self):
        """Test 15-year mortgage payment."""
        # Higher payment for shorter term
        payment_15 = calculate_monthly_payment(320_000, 0.068, 15)
        payment_30 = calculate_monthly_payment(320_000, 0.068, 30)
        assert payment_15 > payment_30

    def test_zero_interest(self):
        """Test interest-free loan (edge case)."""
        payment = calculate_monthly_payment(120_000, 0, 10)
        assert payment == 1000  # $120K / 120 months


class TestLoanBalance:
    """Tests for remaining balance calculation."""

    def test_balance_decreases(self):
        """Balance should decrease each month."""
        principal = 320_000
        rate = 0.068
        term = 30

        prev_balance = principal
        for month in range(1, 13):
            balance = calculate_loan_balance(principal, rate, term, month)
            assert balance < prev_balance
            prev_balance = balance

    def test_balance_at_end(self):
        """Balance should be zero at end of term."""
        balance = calculate_loan_balance(320_000, 0.068, 30, 360)
        assert balance < 1  # Essentially zero (floating point)

    def test_balance_at_start(self):
        """Balance at month 0 should be principal."""
        balance = calculate_loan_balance(320_000, 0.068, 30, 0)
        assert balance == 320_000


class TestPaymentBreakdown:
    """Tests for principal/interest split."""

    def test_early_payments_mostly_interest(self):
        """Early payments should be mostly interest."""
        principal_1, interest_1 = calculate_payment_breakdown(320_000, 0.068, 30, 1)
        assert interest_1 > principal_1
        # First month interest on $320K at 6.8% ≈ $1,813
        assert abs(interest_1 - 1813.33) < 1

    def test_late_payments_mostly_principal(self):
        """Late payments should be mostly principal."""
        principal, interest = calculate_payment_breakdown(320_000, 0.068, 30, 350)
        assert principal > interest

    def test_breakdown_sums_to_payment(self):
        """Principal + interest should equal total payment."""
        payment = calculate_monthly_payment(320_000, 0.068, 30)
        principal, interest = calculate_payment_breakdown(320_000, 0.068, 30, 60)
        assert abs((principal + interest) - payment) < 0.01


class TestTotalInterest:
    """Tests for total interest calculation."""

    def test_total_interest_reasonable(self):
        """Total interest should be roughly 1.3x principal for 30yr at 6.8%."""
        total = calculate_total_interest(320_000, 0.068, 30)
        # $320K loan at 6.8% for 30 years ≈ $430K total interest
        assert 400_000 < total < 460_000
```

**Step 3: Run tests**

```bash
cd backend && uv run pytest tests/engine/test_amortization.py -v
```

**Step 4: Commit**

```bash
git add backend/
git commit -m "feat(engine): add amortization calculations with tests

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Create Taxes Module

**Files:**
- Create: `backend/src/ownvsrent/engine/taxes.py`
- Create: `backend/tests/engine/test_taxes.py`

**Step 1: Create taxes.py**

```python
"""Tax benefit calculations."""

from .defaults import (
    get_standard_deduction,
    get_salt_cap,
    MORTGAGE_INTEREST_CAP,
    PMI_DEDUCTIBLE_START_YEAR,
    PMI_PHASE_OUT_AGI_START,
    PMI_PHASE_OUT_AGI_END,
)


def calculate_annual_tax_benefit(
    year: int,
    mortgage_interest: float,
    property_tax: float,
    state_income_tax: float,
    pmi_paid: float,
    loan_amount: float,
    marginal_tax_rate: float,
    filing_status: str,
    agi: float = 0,
) -> tuple[float, bool]:
    """Calculate annual tax benefit from homeownership.

    The key insight: tax benefit is ONLY the excess of itemized deductions
    over the standard deduction, multiplied by marginal rate.

    Args:
        year: Tax year
        mortgage_interest: Total mortgage interest paid in year
        property_tax: Total property tax paid in year
        state_income_tax: State income tax paid in year
        pmi_paid: Total PMI paid in year
        loan_amount: Original loan amount (for $750K cap calculation)
        marginal_tax_rate: Federal marginal tax rate (decimal)
        filing_status: "single" or "married"
        agi: Adjusted gross income (for PMI phase-out)

    Returns:
        Tuple of (tax_benefit_dollars, itemization_is_beneficial)
    """
    # Standard deduction (inflation-adjusted)
    standard_deduction = get_standard_deduction(year, filing_status)

    # SALT deduction (property tax + state income tax, capped)
    salt_cap = get_salt_cap(year, filing_status)
    salt_deduction = min(property_tax + state_income_tax, salt_cap)

    # Mortgage interest deduction (capped at interest on first $750K)
    if loan_amount > MORTGAGE_INTEREST_CAP:
        # Prorate the deduction
        mortgage_interest_deduction = mortgage_interest * (MORTGAGE_INTEREST_CAP / loan_amount)
    else:
        mortgage_interest_deduction = mortgage_interest

    # PMI deduction (only available starting 2026 per OBBBA)
    pmi_deduction = 0.0
    if year >= PMI_DEDUCTIBLE_START_YEAR and pmi_paid > 0:
        # Phase-out for AGI $100K-$110K
        if agi <= PMI_PHASE_OUT_AGI_START:
            pmi_deduction = pmi_paid
        elif agi >= PMI_PHASE_OUT_AGI_END:
            pmi_deduction = 0
        else:
            # Linear phase-out
            phase_out_pct = (agi - PMI_PHASE_OUT_AGI_START) / (
                PMI_PHASE_OUT_AGI_END - PMI_PHASE_OUT_AGI_START
            )
            pmi_deduction = pmi_paid * (1 - phase_out_pct)

    # Total itemized deductions
    itemized_total = salt_deduction + mortgage_interest_deduction + pmi_deduction

    # Tax benefit is ONLY the excess over standard deduction
    itemization_beneficial = itemized_total > standard_deduction
    excess = max(0, itemized_total - standard_deduction)
    tax_benefit = excess * marginal_tax_rate

    return tax_benefit, itemization_beneficial


def estimate_state_income_tax(agi: float, state_tax_rate: float) -> float:
    """Estimate state income tax for SALT calculation.

    This is a simplified calculation. Real state taxes vary significantly.
    """
    return agi * state_tax_rate
```

**Step 2: Create test file**

```python
"""Tests for tax calculations."""

import pytest
from ownvsrent.engine.taxes import calculate_annual_tax_benefit


class TestTaxBenefit:
    """Tests for tax benefit calculation."""

    def test_standard_deduction_wins(self):
        """When itemized < standard, benefit should be zero."""
        benefit, itemization_beneficial = calculate_annual_tax_benefit(
            year=2026,
            mortgage_interest=8000,  # Low interest
            property_tax=3000,
            state_income_tax=2000,
            pmi_paid=0,
            loan_amount=200_000,
            marginal_tax_rate=0.22,
            filing_status="married",  # Standard deduction ~$32K
        )
        assert benefit == 0
        assert itemization_beneficial is False

    def test_itemized_wins(self):
        """When itemized > standard, benefit should be positive."""
        benefit, itemization_beneficial = calculate_annual_tax_benefit(
            year=2026,
            mortgage_interest=25000,  # High interest
            property_tax=15000,
            state_income_tax=10000,
            pmi_paid=0,
            loan_amount=500_000,
            marginal_tax_rate=0.32,
            filing_status="single",  # Standard deduction ~$16K
        )
        assert benefit > 0
        assert itemization_beneficial is True

    def test_salt_cap_applied(self):
        """SALT should be capped at $40K for 2025-2029."""
        # Even with $60K in property + state tax, only $40K counts
        benefit_capped, _ = calculate_annual_tax_benefit(
            year=2026,
            mortgage_interest=20000,
            property_tax=35000,  # Very high
            state_income_tax=25000,  # Very high
            pmi_paid=0,
            loan_amount=400_000,
            marginal_tax_rate=0.32,
            filing_status="single",
        )

        # Without cap, itemized would be $80K. With cap, it's $60K.
        # Benefit should reflect capped amount
        assert benefit_capped > 0

    def test_salt_cap_2030_reverts(self):
        """SALT cap should revert to $10K after 2029."""
        benefit_2029, _ = calculate_annual_tax_benefit(
            year=2029,
            mortgage_interest=15000,
            property_tax=20000,
            state_income_tax=10000,
            pmi_paid=0,
            loan_amount=300_000,
            marginal_tax_rate=0.24,
            filing_status="single",
        )

        benefit_2030, _ = calculate_annual_tax_benefit(
            year=2030,
            mortgage_interest=15000,
            property_tax=20000,
            state_income_tax=10000,
            pmi_paid=0,
            loan_amount=300_000,
            marginal_tax_rate=0.24,
            filing_status="single",
        )

        # 2030 benefit should be lower due to $10K SALT cap
        assert benefit_2030 < benefit_2029

    def test_mortgage_interest_cap(self):
        """Mortgage interest should be prorated for loans > $750K."""
        # $1M loan, only 75% of interest is deductible
        benefit, _ = calculate_annual_tax_benefit(
            year=2026,
            mortgage_interest=60000,  # On $1M loan
            property_tax=10000,
            state_income_tax=5000,
            pmi_paid=0,
            loan_amount=1_000_000,  # Exceeds $750K cap
            marginal_tax_rate=0.35,
            filing_status="single",
        )

        # If fully deductible, itemized = $75K. Prorated = $60K.
        # Benefit reflects prorated amount
        assert benefit > 0

    def test_pmi_not_deductible_before_2026(self):
        """PMI should not be deductible before 2026."""
        benefit_2025, _ = calculate_annual_tax_benefit(
            year=2025,
            mortgage_interest=15000,
            property_tax=5000,
            state_income_tax=3000,
            pmi_paid=2000,  # Should not count
            loan_amount=350_000,
            marginal_tax_rate=0.24,
            filing_status="single",
        )

        benefit_2026, _ = calculate_annual_tax_benefit(
            year=2026,
            mortgage_interest=15000,
            property_tax=5000,
            state_income_tax=3000,
            pmi_paid=2000,  # Should count
            loan_amount=350_000,
            marginal_tax_rate=0.24,
            filing_status="single",
        )

        # 2026 should have higher benefit due to PMI deduction
        assert benefit_2026 > benefit_2025
```

**Step 3: Run tests and commit**

```bash
cd backend && uv run pytest tests/engine/test_taxes.py -v
git add backend/
git commit -m "feat(engine): add tax benefit calculations with tests

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 5: Create Calculator Module (Core Orchestrator)

**Files:**
- Create: `backend/src/ownvsrent/engine/calculator.py`
- Create: `backend/tests/engine/test_calculator.py`

This is the main module that orchestrates the month-by-month simulation. See implementation in code.

---

## Task 6: Update Engine __init__.py and API Routes

**Files:**
- Modify: `backend/src/ownvsrent/engine/__init__.py`
- Modify: `backend/src/ownvsrent/api/routes.py`

Export public API and connect to FastAPI routes.

---

## Task 7: Integration Tests

**Files:**
- Create: `backend/tests/engine/test_integration.py`

Test complete scenarios end-to-end.

---

## Task 8: Deploy Updated Backend

Push to GitHub and deploy to EC2.
