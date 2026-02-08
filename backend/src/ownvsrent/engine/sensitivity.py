"""Sensitivity analysis for tornado chart visualization.

This module varies key input parameters to show their impact on the
rent vs. buy decision.
"""

from ownvsrent.engine.calculator import calculate
from ownvsrent.engine.types import CalculatorInputs, SensitivityResult


# Variables to analyze with their display labels and default delta ranges
SENSITIVITY_VARIABLES = [
    ("annual_appreciation", "Home Appreciation", 0.02),  # ±2%
    ("annual_investment_return", "Investment Return", 0.02),  # ±2%
    ("mortgage_rate", "Mortgage Rate", 0.01),  # ±1%
    ("annual_rent_increase", "Rent Growth", 0.01),  # ±1%
    ("holding_period_years", "Holding Period", 2),  # ±2 years
    ("property_tax_rate", "Property Tax Rate", 0.005),  # ±0.5%
    ("selling_costs_percent", "Selling Costs", 0.02),  # ±2%
    ("maintenance_rate", "Maintenance Rate", 0.005),  # ±0.5%
]


def run_sensitivity_analysis(
    inputs: CalculatorInputs,
    variables: list[tuple[str, str, float]] | None = None,
) -> list[SensitivityResult]:
    """Run sensitivity analysis on key variables.

    For each variable, calculates the net benefit at low and high values
    to show how sensitive the outcome is to that parameter.

    Args:
        inputs: Base calculator inputs
        variables: Optional list of (variable_name, label, delta) tuples.
                   Defaults to SENSITIVITY_VARIABLES.

    Returns:
        List of SensitivityResult sorted by impact (highest first)
    """
    if variables is None:
        variables = SENSITIVITY_VARIABLES

    # Calculate base case
    base_result = calculate(inputs)
    base_outcome = base_result.net_benefit_at_horizon

    results: list[SensitivityResult] = []

    for var_name, label, delta in variables:
        base_value = getattr(inputs, var_name)

        # Calculate low and high values
        if var_name == "holding_period_years":
            # Integer variable
            low_value = max(1, int(base_value - delta))
            high_value = min(30, int(base_value + delta))
        else:
            # Float variable
            low_value = max(0, base_value - delta)
            high_value = base_value + delta

            # Apply upper bounds for rate variables
            if var_name == "annual_appreciation":
                high_value = min(0.15, high_value)
                low_value = max(-0.10, low_value)
            elif var_name in ("mortgage_rate", "annual_investment_return"):
                high_value = min(0.15, high_value)
            elif var_name == "annual_rent_increase":
                high_value = min(0.20, high_value)
            elif var_name in ("property_tax_rate", "maintenance_rate"):
                high_value = min(0.05, high_value)
            elif var_name == "selling_costs_percent":
                high_value = min(0.15, high_value)

        # Calculate outcomes at low and high values
        low_inputs = inputs.model_copy(update={var_name: low_value})
        high_inputs = inputs.model_copy(update={var_name: high_value})

        try:
            low_result = calculate(low_inputs)
            low_outcome = low_result.net_benefit_at_horizon
        except Exception:
            low_outcome = base_outcome

        try:
            high_result = calculate(high_inputs)
            high_outcome = high_result.net_benefit_at_horizon
        except Exception:
            high_outcome = base_outcome

        # Calculate impact (absolute spread)
        impact = abs(high_outcome - low_outcome)

        results.append(
            SensitivityResult(
                variable=var_name,
                label=label,
                low_value=low_value,
                high_value=high_value,
                low_outcome=low_outcome,
                high_outcome=high_outcome,
                base_outcome=base_outcome,
                impact=impact,
            )
        )

    # Sort by impact (highest first)
    results.sort(key=lambda r: r.impact, reverse=True)

    return results
