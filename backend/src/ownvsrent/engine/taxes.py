"""Tax benefit calculations for mortgage interest and property taxes.

This module implements:
- Mortgage interest deduction with $750K cap (IRC Section 163(h), TCJA)
- SALT deduction with caps (OBBBA 2025: $40K 2025-2029, $10K 2030+)
- PMI deductibility (OBBBA 2025, effective 2026)
- Standard vs. itemized comparison
"""

from ownvsrent.engine.defaults import (
    MORTGAGE_INTEREST_CAP,
    PMI_DEDUCTIBLE_START_YEAR,
    PMI_PHASE_OUT_AGI_END,
    PMI_PHASE_OUT_AGI_START,
    get_salt_cap,
    get_standard_deduction,
)


def calculate_deductible_mortgage_interest(
    interest_paid: float,
    loan_amount: float,
) -> float:
    """Calculate deductible mortgage interest with $750K cap.

    Per IRC Section 163(h) as modified by TCJA, mortgage interest is only
    deductible on the first $750K of acquisition indebtedness.

    Args:
        interest_paid: Total interest paid during the year
        loan_amount: Original loan principal (not current balance)

    Returns:
        Deductible portion of mortgage interest
    """
    if loan_amount <= 0:
        return 0.0

    if loan_amount <= MORTGAGE_INTEREST_CAP:
        return interest_paid

    # Prorate: only (750K / loan_amount) of interest is deductible
    proration_factor = MORTGAGE_INTEREST_CAP / loan_amount
    return interest_paid * proration_factor


def calculate_deductible_pmi(
    pmi_paid: float,
    year: int,
    agi: float,
) -> float:
    """Calculate deductible PMI premiums.

    Per OBBBA 2025, PMI premiums are deductible as mortgage interest
    starting tax year 2026. Phase-out applies for AGI $100K-$110K.

    Args:
        pmi_paid: Total PMI paid during the year
        year: Tax year
        agi: Adjusted gross income

    Returns:
        Deductible portion of PMI
    """
    if year < PMI_DEDUCTIBLE_START_YEAR:
        return 0.0

    if pmi_paid <= 0:
        return 0.0

    if agi <= PMI_PHASE_OUT_AGI_START:
        return pmi_paid

    if agi >= PMI_PHASE_OUT_AGI_END:
        return 0.0

    # Linear phase-out between $100K and $110K
    phase_out_range = PMI_PHASE_OUT_AGI_END - PMI_PHASE_OUT_AGI_START
    excess_agi = agi - PMI_PHASE_OUT_AGI_START
    phase_out_pct = excess_agi / phase_out_range
    deductible_pct = 1.0 - phase_out_pct

    return pmi_paid * deductible_pct


def calculate_itemized_deductions(
    mortgage_interest: float,
    property_tax: float,
    state_income_tax: float,
    pmi: float,
    year: int,
    loan_amount: float,
    agi: float,
    filing_status: str = "single",
) -> float:
    """Calculate total itemized deductions for housing.

    Applies all relevant caps and limitations:
    - Mortgage interest cap at $750K
    - SALT cap ($40K 2025-2029, $10K 2030+)
    - PMI deductibility (2026+, with phase-out)

    Args:
        mortgage_interest: Total mortgage interest paid
        property_tax: Property taxes paid
        state_income_tax: State/local income taxes paid
        pmi: PMI premiums paid
        year: Tax year
        loan_amount: Original loan principal
        agi: Adjusted gross income
        filing_status: "single", "married", or "married_separately"

    Returns:
        Total itemized deductions
    """
    # Mortgage interest (with $750K cap)
    deductible_interest = calculate_deductible_mortgage_interest(
        interest_paid=mortgage_interest,
        loan_amount=loan_amount,
    )

    # PMI (deductible from 2026, with phase-out)
    deductible_pmi = calculate_deductible_pmi(
        pmi_paid=pmi,
        year=year,
        agi=agi,
    )

    # SALT (capped)
    total_salt = property_tax + state_income_tax
    salt_cap = get_salt_cap(year=year, filing_status=filing_status, magi=agi)
    deductible_salt = min(total_salt, salt_cap)

    return deductible_interest + deductible_pmi + deductible_salt


def calculate_annual_tax_benefit(
    mortgage_interest: float,
    property_tax: float,
    state_income_tax: float,
    pmi: float,
    year: int,
    loan_amount: float,
    marginal_tax_rate: float,
    filing_status: str,
    agi: float,
) -> tuple[float, bool]:
    """Calculate annual tax benefit from itemizing vs. standard deduction.

    CRITICAL: Tax benefit is ONLY the excess of itemized over standard.
    If itemized <= standard, the tax benefit from mortgage interest is ZERO.

    This is the #1 mistake in competing calculators. We model it correctly:
        tax_benefit = max(0, (itemized - standard)) * marginal_rate

    Args:
        mortgage_interest: Total mortgage interest paid for the year
        property_tax: Property taxes paid
        state_income_tax: State/local income taxes paid
        pmi: PMI premiums paid
        year: Tax year
        loan_amount: Original loan principal
        marginal_tax_rate: Federal marginal tax rate (decimal)
        filing_status: "single" or "married"
        agi: Adjusted gross income

    Returns:
        Tuple of (tax_benefit_amount, itemization_beneficial)
    """
    # Calculate itemized deductions
    itemized = calculate_itemized_deductions(
        mortgage_interest=mortgage_interest,
        property_tax=property_tax,
        state_income_tax=state_income_tax,
        pmi=pmi,
        year=year,
        loan_amount=loan_amount,
        agi=agi,
        filing_status=filing_status,
    )

    # Get standard deduction for the year
    standard = get_standard_deduction(year=year, filing_status=filing_status)

    # Tax benefit is ONLY the excess over standard deduction
    if itemized <= standard:
        return (0.0, False)

    excess = itemized - standard
    tax_benefit = excess * marginal_tax_rate

    return (tax_benefit, True)
