"""Tests for sensitivity analysis."""

import pytest

from ownvsrent.engine.sensitivity import SENSITIVITY_VARIABLES, run_sensitivity_analysis
from ownvsrent.engine.types import CalculatorInputs


def make_inputs(**overrides) -> CalculatorInputs:
    """Create test inputs with defaults."""
    defaults = {
        "monthly_rent": 2000,
        "annual_rent_increase": 0.03,
        "renter_insurance": 30,
        "security_deposit": 1.0,
        "broker_fee": 0.0,
        "purchase_price": 400_000,
        "down_payment_percent": 0.20,
        "mortgage_rate": 0.068,
        "loan_term_years": 30,
        "property_tax_rate": 0.011,
        "home_insurance_rate": 0.005,
        "hoa_monthly": 0,
        "maintenance_rate": 0.015,
        "pmi_rate": 0.0075,
        "buyer_closing_costs_percent": 0.03,
        "selling_costs_percent": 0.08,
        "holding_period_years": 7,
        "annual_appreciation": 0.035,
        "annual_investment_return": 0.07,
        "marginal_tax_rate": 0.22,
        "state_tax_rate": 0.05,
        "filing_status": "single",
        "capital_gains_tax_rate": 0.15,
    }
    defaults.update(overrides)
    return CalculatorInputs(**defaults)


class TestSensitivityAnalysis:
    """Test sensitivity analysis functionality."""

    def test_returns_results_for_all_variables(self):
        """Should return results for all default variables."""
        inputs = make_inputs()
        results = run_sensitivity_analysis(inputs)

        assert len(results) == len(SENSITIVITY_VARIABLES)

    def test_results_sorted_by_impact(self):
        """Results should be sorted by impact (highest first)."""
        inputs = make_inputs()
        results = run_sensitivity_analysis(inputs)

        for i in range(len(results) - 1):
            assert results[i].impact >= results[i + 1].impact

    def test_result_structure(self):
        """Each result should have proper structure."""
        inputs = make_inputs()
        results = run_sensitivity_analysis(inputs)

        for result in results:
            assert result.variable in [v[0] for v in SENSITIVITY_VARIABLES]
            assert result.label != ""
            assert result.low_value != result.high_value
            assert result.impact >= 0

    def test_appreciation_has_high_impact(self):
        """Home appreciation should have significant impact."""
        inputs = make_inputs()
        results = run_sensitivity_analysis(inputs)

        appreciation_result = next(r for r in results if r.variable == "annual_appreciation")
        assert appreciation_result.impact > 10_000  # At least $10K impact

    def test_directional_correctness_appreciation(self):
        """Higher appreciation should improve net benefit for buyer."""
        inputs = make_inputs()
        results = run_sensitivity_analysis(inputs)

        appreciation_result = next(r for r in results if r.variable == "annual_appreciation")
        # Higher appreciation = better for buyer (higher outcome)
        assert appreciation_result.high_outcome > appreciation_result.low_outcome

    def test_directional_correctness_investment_return(self):
        """Higher investment return should improve net benefit for renter."""
        inputs = make_inputs()
        results = run_sensitivity_analysis(inputs)

        investment_result = next(
            r for r in results if r.variable == "annual_investment_return"
        )
        # Higher investment return = better for renter (lower net benefit for buyer)
        assert investment_result.high_outcome < investment_result.low_outcome

    def test_directional_correctness_mortgage_rate(self):
        """Higher mortgage rate should hurt buyer."""
        inputs = make_inputs()
        results = run_sensitivity_analysis(inputs)

        mortgage_result = next(r for r in results if r.variable == "mortgage_rate")
        # Higher mortgage rate = worse for buyer (lower net benefit)
        assert mortgage_result.high_outcome < mortgage_result.low_outcome

    def test_custom_variables(self):
        """Should work with custom variable list."""
        inputs = make_inputs()
        custom_vars = [
            ("annual_appreciation", "Appreciation", 0.03),
        ]
        results = run_sensitivity_analysis(inputs, variables=custom_vars)

        assert len(results) == 1
        assert results[0].variable == "annual_appreciation"

    def test_base_outcome_consistent(self):
        """All results should have same base outcome."""
        inputs = make_inputs()
        results = run_sensitivity_analysis(inputs)

        base_outcomes = [r.base_outcome for r in results]
        assert len(set(base_outcomes)) == 1  # All same value

    def test_holding_period_integer_bounds(self):
        """Holding period should stay within valid bounds."""
        inputs = make_inputs(holding_period_years=2)
        results = run_sensitivity_analysis(inputs)

        holding_result = next(r for r in results if r.variable == "holding_period_years")
        assert holding_result.low_value >= 1
        assert holding_result.high_value <= 30
