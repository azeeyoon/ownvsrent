"""Mortgage amortization calculations."""


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
        monthly_payment = principal / (term_years * 12)
        return max(0, principal - monthly_payment * month)

    monthly_rate = annual_rate / 12
    num_payments = term_years * 12

    if month >= num_payments:
        return 0

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
    """Calculate total interest paid over life of loan.

    Args:
        principal: Original loan amount
        annual_rate: Annual interest rate (decimal)
        term_years: Loan term in years

    Returns:
        Total interest paid
    """
    monthly_payment = calculate_monthly_payment(principal, annual_rate, term_years)
    total_payments = monthly_payment * term_years * 12
    return total_payments - principal


def calculate_cumulative_interest(
    principal: float, annual_rate: float, term_years: int, through_month: int
) -> float:
    """Calculate cumulative interest paid through a specific month.

    Args:
        principal: Original loan amount
        annual_rate: Annual interest rate (decimal)
        term_years: Loan term in years
        through_month: Calculate interest through this month (inclusive)

    Returns:
        Cumulative interest paid
    """
    total_interest = 0.0
    for month in range(1, through_month + 1):
        _, interest = calculate_payment_breakdown(principal, annual_rate, term_years, month)
        total_interest += interest
    return total_interest
