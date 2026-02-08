"""Wealth comparison calculations.

This module calculates final net wealth for both renter and buyer scenarios,
including capital gains taxes and selling costs.
"""

from ownvsrent.engine.defaults import get_capital_gains_exemption


def calculate_home_sale_proceeds(
    sale_price: float,
    loan_balance: float,
    selling_costs: float,
    purchase_price: float,
    capital_gains_tax_rate: float,
    filing_status: str,
    years_owned: int,
) -> float:
    """Calculate net proceeds from home sale after all costs and taxes.

    Applies:
    - Selling costs (commission + closing)
    - Capital gains tax (with $250K/$500K exemption for 2+ year ownership)

    Args:
        sale_price: Home sale price
        loan_balance: Remaining mortgage balance
        selling_costs: Selling costs (commission, etc.)
        purchase_price: Original purchase price
        capital_gains_tax_rate: Long-term capital gains rate
        filing_status: "single" or "married"
        years_owned: Years the home was owned

    Returns:
        Net proceeds after paying off mortgage, selling costs, and taxes
    """
    # Gross equity
    gross_equity = sale_price - loan_balance

    # Subtract selling costs
    after_selling_costs = gross_equity - selling_costs

    # Calculate capital gains (if any)
    gain = sale_price - purchase_price

    if gain <= 0:
        # No gain, no capital gains tax
        return after_selling_costs

    # Capital gains exemption (requires 2+ years of ownership)
    if years_owned >= 2:
        exemption = get_capital_gains_exemption(filing_status)
        taxable_gain = max(0, gain - exemption)
    else:
        taxable_gain = gain

    # Capital gains tax
    cap_gains_tax = taxable_gain * capital_gains_tax_rate

    return after_selling_costs - cap_gains_tax


def calculate_buyer_final_wealth(
    home_sale_proceeds: float,
    investment_portfolio: float,
    portfolio_cost_basis: float,
    capital_gains_tax_rate: float,
) -> float:
    """Calculate buyer's total wealth at end of holding period.

    Includes:
    - Net proceeds from home sale
    - Investment portfolio (after capital gains tax on gains)

    Args:
        home_sale_proceeds: Net proceeds from home sale
        investment_portfolio: Current portfolio value
        portfolio_cost_basis: Total contributions to portfolio
        capital_gains_tax_rate: Tax rate on investment gains

    Returns:
        Total after-tax wealth
    """
    # Tax on investment gains
    portfolio_gain = max(0, investment_portfolio - portfolio_cost_basis)
    portfolio_tax = portfolio_gain * capital_gains_tax_rate
    after_tax_portfolio = investment_portfolio - portfolio_tax

    return home_sale_proceeds + after_tax_portfolio


def calculate_renter_final_wealth(
    investment_portfolio: float,
    portfolio_cost_basis: float,
    capital_gains_tax_rate: float,
    security_deposit_returned: float,
) -> float:
    """Calculate renter's total wealth at end of holding period.

    Includes:
    - Investment portfolio (after capital gains tax on gains)
    - Security deposit returned

    Args:
        investment_portfolio: Current portfolio value
        portfolio_cost_basis: Total contributions to portfolio
        capital_gains_tax_rate: Tax rate on investment gains
        security_deposit_returned: Security deposit returned at end

    Returns:
        Total after-tax wealth
    """
    # Tax on investment gains
    portfolio_gain = max(0, investment_portfolio - portfolio_cost_basis)
    portfolio_tax = portfolio_gain * capital_gains_tax_rate
    after_tax_portfolio = investment_portfolio - portfolio_tax

    return after_tax_portfolio + security_deposit_returned


def determine_verdict(
    net_benefit: float,
    threshold: float = 1000,
) -> str:
    """Determine verdict based on net benefit.

    Args:
        net_benefit: Buyer wealth - Renter wealth (positive = buy wins)
        threshold: Amount below which it's considered a toss-up

    Returns:
        "buy", "rent", or "toss-up"
    """
    if net_benefit > threshold:
        return "buy"
    elif net_benefit < -threshold:
        return "rent"
    else:
        return "toss-up"


def find_break_even_year(
    yearly_net_benefits: list[float],
) -> int | None:
    """Find the year when buying becomes better than renting.

    Break-even is the first year where net benefit becomes positive.

    Args:
        yearly_net_benefits: List of net benefits by year (buyer - renter)

    Returns:
        Year number when break-even occurs, or None if never
    """
    for year, benefit in enumerate(yearly_net_benefits, start=1):
        if benefit > 0:
            return year
    return None
