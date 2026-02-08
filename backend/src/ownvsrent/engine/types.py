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
    monthly_mortgage_payment: float
    itemization_beneficial: bool
    pmi_removed_month: int | None
    rent_equivalent: float = Field(
        description="True monthly cost of ownership expressed as equivalent rent"
    )


class SensitivityResult(BaseModel):
    """Result of varying one input parameter."""

    variable: str
    label: str
    low_value: float
    high_value: float
    low_outcome: float
    high_outcome: float
    base_outcome: float
    impact: float


class MonteCarloResult(BaseModel):
    """Monte Carlo simulation results."""

    simulations: int
    buy_wins_pct: float
    median: float
    p10: float
    p90: float
    distribution: list[float]
