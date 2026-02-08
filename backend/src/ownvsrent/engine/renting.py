"""Renting cash flow calculations.

This module calculates monthly costs and portfolio growth for the renter scenario.
The renter invests:
1. Initial capital (down payment + closing costs they would have spent buying)
2. Monthly savings when rent < ownership cost
"""


def calculate_monthly_rent(
    base_rent: float,
    month: int,
    annual_rent_increase: float,
) -> float:
    """Calculate rent for a given month with annual escalation.

    Rent increases once per year (every 12 months).

    Args:
        base_rent: Starting monthly rent
        month: Month number (1-indexed)
        annual_rent_increase: Annual rent increase rate (decimal)

    Returns:
        Rent amount for the given month
    """
    years_elapsed = (month - 1) // 12
    return base_rent * (1 + annual_rent_increase) ** years_elapsed


def calculate_renter_monthly_cost(
    rent: float,
    renter_insurance: float,
) -> float:
    """Calculate total monthly cost for renter.

    Args:
        rent: Monthly rent
        renter_insurance: Monthly renter's insurance

    Returns:
        Total monthly housing cost
    """
    return rent + renter_insurance


def calculate_renter_initial_investment(
    down_payment: float,
    closing_costs: float,
    security_deposit: float,
    broker_fee: float,
) -> float:
    """Calculate renter's initial investment amount.

    The renter invests what they would have spent on:
    - Down payment
    - Buyer closing costs

    Minus their own upfront costs:
    - Security deposit (returned at end, so not a cost)
    - Broker fee (actual cost, reduces investment)

    Args:
        down_payment: Down payment buyer would have made
        closing_costs: Closing costs buyer would have paid
        security_deposit: Security deposit (months of rent)
        broker_fee: One-time broker fee

    Returns:
        Initial investment amount
    """
    # Renter invests the down payment and closing costs
    # Broker fee reduces initial investment (it's spent)
    # Security deposit is not included as it's returned
    return down_payment + closing_costs - broker_fee


def grow_portfolio(
    current_value: float,
    monthly_contribution: float,
    monthly_return_rate: float,
) -> float:
    """Grow investment portfolio for one month.

    Applies monthly compounding: existing balance grows, then contribution added.

    Args:
        current_value: Current portfolio value
        monthly_contribution: Amount to add this month (can be negative)
        monthly_return_rate: Monthly investment return rate (decimal)

    Returns:
        New portfolio value after one month
    """
    # Grow existing balance, then add contribution
    new_value = current_value * (1 + monthly_return_rate) + monthly_contribution
    return max(0, new_value)  # Portfolio can't go negative


def calculate_renter_portfolio_after_tax(
    portfolio_value: float,
    initial_investment: float,
    capital_gains_tax_rate: float,
) -> float:
    """Calculate renter's portfolio value after capital gains tax.

    Only gains (value - cost basis) are taxed.

    Args:
        portfolio_value: Current portfolio value
        initial_investment: Original investment (cost basis approximation)
        capital_gains_tax_rate: Tax rate on gains (decimal)

    Returns:
        After-tax portfolio value
    """
    if portfolio_value <= initial_investment:
        # No gains, no tax
        return portfolio_value

    gains = portfolio_value - initial_investment
    taxes = gains * capital_gains_tax_rate
    return portfolio_value - taxes
