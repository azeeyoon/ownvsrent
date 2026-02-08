"""Tests for Monte Carlo simulation."""

import pytest

from ownvsrent.engine.montecarlo import run_monte_carlo
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


class TestMonteCarloBasic:
    """Basic Monte Carlo functionality tests."""

    def test_returns_correct_number_of_simulations(self):
        """Should run specified number of simulations."""
        inputs = make_inputs()
        result = run_monte_carlo(inputs, simulations=100, seed=42)

        assert result.simulations == 100

    def test_distribution_has_correct_length(self):
        """Distribution should match simulation count."""
        inputs = make_inputs()
        result = run_monte_carlo(inputs, simulations=50, seed=42)

        assert len(result.distribution) == 50

    def test_buy_wins_pct_between_0_and_100(self):
        """Buy wins percentage should be between 0 and 100."""
        inputs = make_inputs()
        result = run_monte_carlo(inputs, simulations=100, seed=42)

        assert 0 <= result.buy_wins_pct <= 100

    def test_percentiles_ordered(self):
        """P10 should be less than median, median less than P90."""
        inputs = make_inputs()
        result = run_monte_carlo(inputs, simulations=100, seed=42)

        assert result.p10 <= result.median <= result.p90

    def test_distribution_sorted(self):
        """Distribution should be sorted ascending."""
        inputs = make_inputs()
        result = run_monte_carlo(inputs, simulations=100, seed=42)

        for i in range(len(result.distribution) - 1):
            assert result.distribution[i] <= result.distribution[i + 1]


class TestMonteCarloReproducibility:
    """Test reproducibility with seed."""

    def test_same_seed_same_results(self):
        """Same seed should produce same results."""
        inputs = make_inputs()

        result1 = run_monte_carlo(inputs, simulations=50, seed=123)
        result2 = run_monte_carlo(inputs, simulations=50, seed=123)

        assert result1.median == result2.median
        assert result1.p10 == result2.p10
        assert result1.p90 == result2.p90
        assert result1.buy_wins_pct == result2.buy_wins_pct

    def test_different_seeds_different_results(self):
        """Different seeds should produce different results."""
        inputs = make_inputs()

        result1 = run_monte_carlo(inputs, simulations=100, seed=100)
        result2 = run_monte_carlo(inputs, simulations=100, seed=200)

        # Results should differ (extremely unlikely to be identical)
        assert result1.median != result2.median


class TestMonteCarloScenarios:
    """Test specific scenarios."""

    def test_buy_favored_scenario(self):
        """Scenario strongly favoring buying should show high buy_wins_pct."""
        inputs = make_inputs(
            monthly_rent=3500,  # Very high rent
            purchase_price=400_000,
            annual_appreciation=0.05,  # Good appreciation
            annual_investment_return=0.04,  # Low market returns
        )
        result = run_monte_carlo(inputs, simulations=100, seed=42)

        assert result.buy_wins_pct > 70

    def test_rent_favored_scenario(self):
        """Scenario strongly favoring renting should show low buy_wins_pct."""
        inputs = make_inputs(
            monthly_rent=1500,  # Low rent
            purchase_price=600_000,  # Expensive home
            annual_appreciation=0.02,  # Low appreciation
            annual_investment_return=0.10,  # High market returns
        )
        result = run_monte_carlo(inputs, simulations=100, seed=42)

        assert result.buy_wins_pct < 30

    def test_median_near_deterministic(self):
        """Median should be reasonably close to deterministic result."""
        inputs = make_inputs()

        from ownvsrent.engine.calculator import calculate

        deterministic = calculate(inputs)
        monte_carlo = run_monte_carlo(inputs, simulations=200, seed=42)

        # Median should be within reasonable range of deterministic
        # (allowing for randomness impact)
        diff = abs(monte_carlo.median - deterministic.net_benefit_at_horizon)
        # Within $50K is reasonable given volatility
        assert diff < 50_000


class TestMonteCarloCustomStdDevs:
    """Test custom standard deviations."""

    def test_zero_volatility(self):
        """Zero volatility should produce identical results."""
        inputs = make_inputs()
        zero_std_devs = {
            "annual_appreciation": 0,
            "annual_investment_return": 0,
            "annual_rent_increase": 0,
        }
        result = run_monte_carlo(
            inputs, simulations=10, seed=42, std_devs=zero_std_devs
        )

        # All outcomes should be identical
        assert len(set(result.distribution)) == 1

    def test_high_volatility_wider_spread(self):
        """Higher volatility should produce wider spread."""
        inputs = make_inputs()

        low_vol = {
            "annual_appreciation": 0.01,
            "annual_investment_return": 0.02,
            "annual_rent_increase": 0.005,
        }
        high_vol = {
            "annual_appreciation": 0.08,
            "annual_investment_return": 0.20,
            "annual_rent_increase": 0.05,
        }

        result_low = run_monte_carlo(inputs, simulations=100, seed=42, std_devs=low_vol)
        result_high = run_monte_carlo(inputs, simulations=100, seed=42, std_devs=high_vol)

        spread_low = result_low.p90 - result_low.p10
        spread_high = result_high.p90 - result_high.p10

        assert spread_high > spread_low
