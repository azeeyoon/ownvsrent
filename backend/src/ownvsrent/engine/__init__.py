"""Calculation engine package.

This package contains pure calculation logic with no FastAPI dependencies.
All modules here must be importable and testable without any web framework.
"""

from ownvsrent.engine.amortization import (
    calculate_loan_balance,
    calculate_monthly_payment,
    calculate_payment_breakdown,
    calculate_total_interest,
)
from ownvsrent.engine.calculator import calculate
from ownvsrent.engine.defaults import (
    DEFAULTS,
    get_capital_gains_exemption,
    get_salt_cap,
    get_standard_deduction,
)
from ownvsrent.engine.montecarlo import run_monte_carlo
from ownvsrent.engine.sensitivity import run_sensitivity_analysis
from ownvsrent.engine.taxes import (
    calculate_annual_tax_benefit,
    calculate_deductible_mortgage_interest,
    calculate_deductible_pmi,
    calculate_itemized_deductions,
)
from ownvsrent.engine.types import (
    CalculatorInputs,
    CalculatorResults,
    MonteCarloResult,
    MonthlySnapshot,
    SensitivityResult,
    YearlySnapshot,
)

__all__ = [
    # Main calculator
    "calculate",
    # Sensitivity & Monte Carlo
    "run_sensitivity_analysis",
    "run_monte_carlo",
    # Types
    "CalculatorInputs",
    "CalculatorResults",
    "MonteCarloResult",
    "MonthlySnapshot",
    "SensitivityResult",
    "YearlySnapshot",
    # Amortization
    "calculate_loan_balance",
    "calculate_monthly_payment",
    "calculate_payment_breakdown",
    "calculate_total_interest",
    # Defaults
    "DEFAULTS",
    "get_capital_gains_exemption",
    "get_salt_cap",
    "get_standard_deduction",
    # Taxes
    "calculate_annual_tax_benefit",
    "calculate_deductible_mortgage_interest",
    "calculate_deductible_pmi",
    "calculate_itemized_deductions",
]
