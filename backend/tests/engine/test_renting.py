"""Tests for renting cash flow calculations."""

import pytest

from ownvsrent.engine.renting import (
    calculate_monthly_rent,
    calculate_renter_initial_investment,
    calculate_renter_monthly_cost,
    calculate_renter_portfolio_after_tax,
    grow_portfolio,
)


class TestMonthlyRent:
    """Test rent escalation over time."""

    def test_first_month_base_rent(self):
        """First month uses base rent."""
        rent = calculate_monthly_rent(
            base_rent=2000,
            month=1,
            annual_rent_increase=0.03,
        )
        assert rent == 2000

    def test_month_12_still_base_rent(self):
        """Month 12 is still year 1, base rent."""
        rent = calculate_monthly_rent(
            base_rent=2000,
            month=12,
            annual_rent_increase=0.03,
        )
        assert rent == 2000

    def test_month_13_first_increase(self):
        """Month 13 (year 2) has first increase."""
        rent = calculate_monthly_rent(
            base_rent=2000,
            month=13,
            annual_rent_increase=0.03,
        )
        assert rent == pytest.approx(2060, rel=1e-6)  # 2000 * 1.03

    def test_year_5_compounded(self):
        """Year 5 has 4 increases compounded."""
        rent = calculate_monthly_rent(
            base_rent=2000,
            month=49,  # First month of year 5
            annual_rent_increase=0.03,
        )
        expected = 2000 * (1.03**4)  # 4 years of increases
        assert rent == pytest.approx(expected, rel=1e-6)

    def test_zero_increase(self):
        """Zero rent increase means constant rent."""
        rent_month_1 = calculate_monthly_rent(base_rent=2000, month=1, annual_rent_increase=0)
        rent_month_60 = calculate_monthly_rent(base_rent=2000, month=60, annual_rent_increase=0)
        assert rent_month_1 == rent_month_60 == 2000


class TestRenterMonthlyCost:
    """Test total monthly cost calculation."""

    def test_basic_cost(self):
        """Total cost is rent + insurance."""
        cost = calculate_renter_monthly_cost(rent=2000, renter_insurance=30)
        assert cost == 2030

    def test_zero_insurance(self):
        """No insurance means just rent."""
        cost = calculate_renter_monthly_cost(rent=1500, renter_insurance=0)
        assert cost == 1500


class TestRenterInitialInvestment:
    """Test initial investment calculation."""

    def test_basic_investment(self):
        """Renter invests down payment + closing - broker fee."""
        investment = calculate_renter_initial_investment(
            down_payment=80_000,
            closing_costs=10_000,
            security_deposit=2_000,  # Not included (returned)
            broker_fee=1_500,
        )
        # 80K + 10K - 1.5K = 88.5K
        assert investment == 88_500

    def test_no_broker_fee(self):
        """No broker fee means full down + closing invested."""
        investment = calculate_renter_initial_investment(
            down_payment=100_000,
            closing_costs=15_000,
            security_deposit=2_000,
            broker_fee=0,
        )
        assert investment == 115_000


class TestPortfolioGrowth:
    """Test portfolio growth with contributions."""

    def test_growth_with_contribution(self):
        """Portfolio grows and adds contribution."""
        # 100K at 0.5% monthly return + 1K contribution
        new_value = grow_portfolio(
            current_value=100_000,
            monthly_contribution=1_000,
            monthly_return_rate=0.005,
        )
        # 100K * 1.005 + 1K = 101,500
        assert new_value == pytest.approx(101_500, rel=1e-6)

    def test_no_contribution(self):
        """Just growth, no contribution."""
        new_value = grow_portfolio(
            current_value=100_000,
            monthly_contribution=0,
            monthly_return_rate=0.005,
        )
        assert new_value == pytest.approx(100_500, rel=1e-6)

    def test_portfolio_cannot_go_negative(self):
        """Portfolio floors at zero."""
        new_value = grow_portfolio(
            current_value=1_000,
            monthly_contribution=-2_000,  # Withdraw more than balance
            monthly_return_rate=0.005,
        )
        assert new_value == 0


class TestRenterPortfolioAfterTax:
    """Test after-tax portfolio calculation."""

    def test_gains_taxed(self):
        """Only gains are taxed."""
        after_tax = calculate_renter_portfolio_after_tax(
            portfolio_value=150_000,
            initial_investment=100_000,
            capital_gains_tax_rate=0.15,
        )
        # Gain: 50K, Tax: 7.5K, After-tax: 142.5K
        assert after_tax == pytest.approx(142_500, rel=1e-6)

    def test_no_gains_no_tax(self):
        """No gains means no tax."""
        after_tax = calculate_renter_portfolio_after_tax(
            portfolio_value=90_000,
            initial_investment=100_000,
            capital_gains_tax_rate=0.15,
        )
        # Lost money, no tax
        assert after_tax == 90_000

    def test_break_even_no_tax(self):
        """Break even means no tax."""
        after_tax = calculate_renter_portfolio_after_tax(
            portfolio_value=100_000,
            initial_investment=100_000,
            capital_gains_tax_rate=0.15,
        )
        assert after_tax == 100_000
