"""Tests for the main calculator module."""

import pytest

from ownvsrent.engine.calculator import calculate
from ownvsrent.engine.types import CalculatorInputs


def make_inputs(**overrides) -> CalculatorInputs:
    """Create test inputs with defaults."""
    defaults = {
        # Renting
        "monthly_rent": 2000,
        "annual_rent_increase": 0.03,
        "renter_insurance": 30,
        "security_deposit": 1.0,
        "broker_fee": 0.0,
        # Buying
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
        # Financial
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


class TestCalculatorBasic:
    """Basic calculator functionality tests."""

    def test_produces_results(self):
        """Calculator returns complete results."""
        inputs = make_inputs()
        results = calculate(inputs)

        assert results.verdict in ["buy", "rent", "toss-up"]
        assert results.monthly_rent == 2000
        assert results.monthly_mortgage_payment > 0
        assert results.monthly_ownership_cost > 0
        assert len(results.monthly_snapshots) == 7 * 12  # 7 years
        assert len(results.yearly_snapshots) == 7

    def test_monthly_snapshots_complete(self):
        """Monthly snapshots have all required fields."""
        inputs = make_inputs(holding_period_years=1)
        results = calculate(inputs)

        snapshot = results.monthly_snapshots[0]
        assert snapshot.month == 1
        assert snapshot.rent > 0
        assert snapshot.renter_insurance >= 0
        assert snapshot.total_rent_cost > 0
        assert snapshot.renter_portfolio > 0
        assert snapshot.mortgage_payment > 0
        assert snapshot.principal > 0
        assert snapshot.interest > 0
        assert snapshot.property_tax > 0
        assert snapshot.home_value > 0
        assert snapshot.home_equity > 0

    def test_yearly_snapshots_complete(self):
        """Yearly snapshots have all required fields."""
        inputs = make_inputs(holding_period_years=3)
        results = calculate(inputs)

        for year in range(1, 4):
            snapshot = results.yearly_snapshots[year - 1]
            assert snapshot.year == year
            assert snapshot.total_rent_paid > 0
            assert snapshot.total_buy_cost_paid > 0
            assert snapshot.home_equity > 0
            assert snapshot.renter_portfolio > 0
            assert snapshot.renter_wealth > 0
            assert snapshot.buyer_wealth > 0


class TestCalculatorScenarios:
    """Test specific scenarios with known outcomes."""

    def test_high_rent_favors_buying(self):
        """Very high rent should favor buying."""
        inputs = make_inputs(
            monthly_rent=4000,  # Very high rent
            purchase_price=400_000,  # Reasonable price
            holding_period_years=10,
        )
        results = calculate(inputs)

        assert results.verdict == "buy"
        assert results.net_benefit_at_horizon > 0

    def test_low_rent_favors_renting(self):
        """Very low rent should favor renting."""
        inputs = make_inputs(
            monthly_rent=1000,  # Low rent
            purchase_price=600_000,  # Expensive home
            holding_period_years=5,
        )
        results = calculate(inputs)

        assert results.verdict == "rent"
        assert results.net_benefit_at_horizon < 0

    def test_short_hold_typically_favors_renting(self):
        """Short holding period usually favors renting."""
        inputs = make_inputs(
            holding_period_years=2,
            selling_costs_percent=0.08,
        )
        results = calculate(inputs)

        # Transaction costs dominate short holds
        assert results.verdict == "rent"

    def test_long_hold_often_favors_buying(self):
        """Long holding period often favors buying when rent is comparable to ownership."""
        inputs = make_inputs(
            monthly_rent=2800,  # Rent closer to ownership cost
            holding_period_years=15,
            annual_appreciation=0.04,
            annual_investment_return=0.05,  # Lower market returns
        )
        results = calculate(inputs)

        assert results.verdict == "buy"


class TestPMIHandling:
    """Test PMI-related calculations."""

    def test_no_pmi_with_20_percent_down(self):
        """20% down payment means no PMI."""
        inputs = make_inputs(down_payment_percent=0.20)
        results = calculate(inputs)

        assert results.pmi_removed_month is None
        # First month PMI should be 0
        assert results.monthly_snapshots[0].pmi == 0

    def test_pmi_with_10_percent_down(self):
        """10% down payment has PMI that gets removed."""
        inputs = make_inputs(
            down_payment_percent=0.10,
            annual_appreciation=0.03,
        )
        results = calculate(inputs)

        assert results.pmi_removed_month is not None
        assert results.monthly_snapshots[0].pmi > 0

    def test_pmi_actually_removed(self):
        """PMI should be 0 after removal month."""
        inputs = make_inputs(
            down_payment_percent=0.05,
            annual_appreciation=0.05,  # High appreciation
            holding_period_years=10,
        )
        results = calculate(inputs)

        if results.pmi_removed_month:
            # PMI before removal should be > 0
            assert results.monthly_snapshots[0].pmi > 0
            # PMI after removal should be 0
            if results.pmi_removed_month < len(results.monthly_snapshots):
                assert results.monthly_snapshots[results.pmi_removed_month].pmi == 0


class TestRenterInvestsDifference:
    """Test that renter invests the difference correctly."""

    def test_renter_starts_with_down_payment_invested(self):
        """Renter's portfolio starts with down payment + closing costs."""
        inputs = make_inputs(
            purchase_price=400_000,
            down_payment_percent=0.20,  # $80K down
            buyer_closing_costs_percent=0.03,  # 3% of $320K loan = $9.6K
        )
        results = calculate(inputs)

        # First month portfolio should be close to $89.6K (grew one month)
        initial_expected = 80_000 + (320_000 * 0.03)  # ~$89.6K
        first_month = results.monthly_snapshots[0].renter_portfolio
        assert first_month > initial_expected * 0.95  # Allow for contribution

    def test_renter_portfolio_grows(self):
        """Renter's portfolio should grow over time."""
        inputs = make_inputs(holding_period_years=10)
        results = calculate(inputs)

        first = results.monthly_snapshots[0].renter_portfolio
        last = results.monthly_snapshots[-1].renter_portfolio
        assert last > first


class TestBreakEven:
    """Test break-even year calculation."""

    def test_break_even_exists(self):
        """Scenario where break-even eventually occurs."""
        inputs = make_inputs(
            holding_period_years=15,
            annual_appreciation=0.04,
        )
        results = calculate(inputs)

        if results.verdict == "buy":
            assert results.break_even_year is not None
            assert 1 <= results.break_even_year <= 15

    def test_no_break_even_when_renting_wins(self):
        """No break-even when renting always wins."""
        inputs = make_inputs(
            monthly_rent=1000,
            purchase_price=800_000,
            holding_period_years=5,
        )
        results = calculate(inputs)

        if results.verdict == "rent":
            assert results.break_even_year is None


class TestEdgeCases:
    """Test edge cases."""

    def test_zero_down_payment(self):
        """0% down payment (maximum PMI)."""
        inputs = make_inputs(
            down_payment_percent=0.03,  # Minimum 3% for conventional
            pmi_rate=0.01,  # Higher PMI rate
        )
        results = calculate(inputs)

        assert results.monthly_snapshots[0].pmi > 0
        assert results.pmi_removed_month is not None

    def test_very_high_appreciation(self):
        """Very high appreciation strongly favors buying."""
        inputs = make_inputs(
            annual_appreciation=0.10,  # 10% annual
            holding_period_years=5,
        )
        results = calculate(inputs)

        assert results.verdict == "buy"
        assert results.buyer_wealth_at_horizon > results.renter_wealth_at_horizon

    def test_negative_appreciation(self):
        """Negative appreciation (depreciation) scenario."""
        inputs = make_inputs(
            annual_appreciation=-0.03,  # 3% annual decline
            holding_period_years=5,
        )
        results = calculate(inputs)

        # Home value should decrease
        assert results.monthly_snapshots[-1].home_value < inputs.purchase_price
        # Renting likely wins in declining market
        assert results.verdict == "rent"

    def test_one_year_holding_period(self):
        """Minimum holding period of 1 year."""
        inputs = make_inputs(holding_period_years=1)
        results = calculate(inputs)

        assert len(results.monthly_snapshots) == 12
        assert len(results.yearly_snapshots) == 1
