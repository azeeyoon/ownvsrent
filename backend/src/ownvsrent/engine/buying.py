"""Buying cash flow calculations.

This module calculates monthly costs, equity growth, and portfolio for the buyer.
"""

from ownvsrent.engine.amortization import calculate_loan_balance, calculate_payment_breakdown
from ownvsrent.engine.defaults import PMI_LTV_THRESHOLD


def calculate_home_value(
    purchase_price: float,
    month: int,
    annual_appreciation: float,
) -> float:
    """Calculate home value at a given month.

    Uses monthly compounding of appreciation.

    Args:
        purchase_price: Original purchase price
        month: Month number (1-indexed)
        annual_appreciation: Annual appreciation rate (decimal)

    Returns:
        Home value at the given month
    """
    monthly_rate = (1 + annual_appreciation) ** (1 / 12) - 1
    return purchase_price * (1 + monthly_rate) ** month


def calculate_pmi(
    loan_balance: float,
    home_value: float,
    original_loan_amount: float,
    pmi_rate: float,
) -> float:
    """Calculate monthly PMI payment.

    PMI is removed when LTV (based on current appraised value) <= 80%.

    Args:
        loan_balance: Current loan balance
        home_value: Current home value (with appreciation)
        original_loan_amount: Original loan amount (for PMI calculation)
        pmi_rate: Annual PMI rate (decimal)

    Returns:
        Monthly PMI payment (0 if LTV <= 80%)
    """
    ltv = loan_balance / home_value

    if ltv <= PMI_LTV_THRESHOLD:
        return 0.0

    # PMI is calculated on original loan amount, not current balance
    annual_pmi = original_loan_amount * pmi_rate
    return annual_pmi / 12


def calculate_property_tax(
    home_value: float,
    property_tax_rate: float,
) -> float:
    """Calculate monthly property tax.

    Args:
        home_value: Current home value
        property_tax_rate: Annual property tax rate (decimal)

    Returns:
        Monthly property tax
    """
    return (home_value * property_tax_rate) / 12


def calculate_home_insurance(
    home_value: float,
    home_insurance_rate: float,
) -> float:
    """Calculate monthly home insurance.

    Args:
        home_value: Current home value
        home_insurance_rate: Annual insurance rate as % of home value

    Returns:
        Monthly insurance cost
    """
    return (home_value * home_insurance_rate) / 12


def calculate_maintenance(
    home_value: float,
    maintenance_rate: float,
) -> float:
    """Calculate monthly maintenance cost.

    Args:
        home_value: Current home value
        maintenance_rate: Annual maintenance rate as % of home value

    Returns:
        Monthly maintenance cost
    """
    return (home_value * maintenance_rate) / 12


def calculate_buyer_monthly_cost(
    mortgage_payment: float,
    property_tax: float,
    home_insurance: float,
    maintenance: float,
    hoa: float,
    pmi: float,
) -> float:
    """Calculate total monthly cost for buyer.

    Args:
        mortgage_payment: Monthly P&I payment
        property_tax: Monthly property tax
        home_insurance: Monthly home insurance
        maintenance: Monthly maintenance
        hoa: Monthly HOA fee
        pmi: Monthly PMI

    Returns:
        Total monthly ownership cost
    """
    return mortgage_payment + property_tax + home_insurance + maintenance + hoa + pmi


def calculate_home_equity(
    home_value: float,
    loan_balance: float,
) -> float:
    """Calculate home equity.

    Args:
        home_value: Current home value
        loan_balance: Current loan balance

    Returns:
        Home equity (value - balance)
    """
    return home_value - loan_balance


def calculate_selling_costs(
    sale_price: float,
    selling_costs_percent: float,
) -> float:
    """Calculate costs to sell the home.

    Includes real estate commission (5-6%) and closing costs (2-3%).

    Args:
        sale_price: Home sale price
        selling_costs_percent: Total selling costs as % of sale price

    Returns:
        Total selling costs
    """
    return sale_price * selling_costs_percent


def find_pmi_removal_month(
    loan_amount: float,
    purchase_price: float,
    mortgage_rate: float,
    loan_term_years: int,
    annual_appreciation: float,
    down_payment_percent: float,
) -> int | None:
    """Find the month when PMI is removed.

    PMI is removed when LTV <= 80% based on current appraised value.

    Args:
        loan_amount: Original loan amount
        purchase_price: Original purchase price
        mortgage_rate: Annual mortgage rate (decimal)
        loan_term_years: Loan term in years
        annual_appreciation: Annual home appreciation rate
        down_payment_percent: Down payment as % of purchase price

    Returns:
        Month number when PMI is removed, or None if no PMI or never removed
    """
    # No PMI if down payment >= 20%
    if down_payment_percent >= 0.20:
        return None

    total_months = loan_term_years * 12

    for month in range(1, total_months + 1):
        balance = calculate_loan_balance(
            principal=loan_amount,
            annual_rate=mortgage_rate,
            term_years=loan_term_years,
            month=month,
        )
        home_value = calculate_home_value(
            purchase_price=purchase_price,
            month=month,
            annual_appreciation=annual_appreciation,
        )
        ltv = balance / home_value

        if ltv <= PMI_LTV_THRESHOLD:
            return month

    return None  # PMI never removed (shouldn't happen normally)
