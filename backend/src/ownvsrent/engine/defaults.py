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
    """Get inflation-adjusted standard deduction for a given year.

    Args:
        year: Tax year
        filing_status: "single" or "married"

    Returns:
        Standard deduction amount
    """
    base = (
        STANDARD_DEDUCTION_MARRIED_2025
        if filing_status == "married"
        else STANDARD_DEDUCTION_SINGLE_2025
    )
    years_from_base = max(0, year - 2025)
    return base * (1 + STANDARD_DEDUCTION_INFLATION) ** years_from_base


def get_salt_cap(year: int, filing_status: str = "single", magi: float = 0) -> float:
    """Get SALT cap for a given year, accounting for phase-outs.

    Args:
        year: Tax year
        filing_status: "single", "married", or "married_separately"
        magi: Modified adjusted gross income (for phase-out calculation)

    Returns:
        SALT deduction cap
    """
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


def get_capital_gains_exemption(filing_status: str) -> float:
    """Get capital gains exemption for home sale.

    Args:
        filing_status: "single" or "married"

    Returns:
        Exemption amount ($250K single, $500K married)
    """
    if filing_status == "married":
        return CAP_GAINS_EXEMPTION_MARRIED
    return CAP_GAINS_EXEMPTION_SINGLE
