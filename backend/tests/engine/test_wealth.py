"""Tests for wealth comparison calculations."""

import pytest

from ownvsrent.engine.wealth import (
    calculate_buyer_final_wealth,
    calculate_home_sale_proceeds,
    calculate_renter_final_wealth,
    determine_verdict,
    find_break_even_year,
)


class TestHomeSaleProceeds:
    """Test home sale proceeds calculation."""

    def test_basic_sale_no_gain(self):
        """Sale with no capital gain."""
        proceeds = calculate_home_sale_proceeds(
            sale_price=400_000,
            loan_balance=200_000,
            selling_costs=32_000,  # 8%
            purchase_price=400_000,
            capital_gains_tax_rate=0.15,
            filing_status="single",
            years_owned=5,
        )
        # Equity: 200K, minus selling: 168K, no gain tax
        assert proceeds == 168_000

    def test_sale_with_exempt_gain(self):
        """Sale with gain under exemption threshold."""
        proceeds = calculate_home_sale_proceeds(
            sale_price=600_000,
            loan_balance=200_000,
            selling_costs=48_000,  # 8%
            purchase_price=400_000,
            capital_gains_tax_rate=0.15,
            filing_status="single",
            years_owned=5,
        )
        # Equity: 400K, minus selling: 352K
        # Gain: 200K (under 250K exemption for single), no tax
        assert proceeds == 352_000

    def test_sale_with_taxable_gain_single(self):
        """Sale with gain exceeding single exemption."""
        proceeds = calculate_home_sale_proceeds(
            sale_price=800_000,
            loan_balance=200_000,
            selling_costs=64_000,
            purchase_price=400_000,
            capital_gains_tax_rate=0.15,
            filing_status="single",
            years_owned=5,
        )
        # Equity: 600K, minus selling: 536K
        # Gain: 400K, taxable: 150K (400K - 250K exemption)
        # Tax: 22.5K
        # Net: 536K - 22.5K = 513.5K
        assert proceeds == pytest.approx(513_500, rel=1e-6)

    def test_sale_with_taxable_gain_married(self):
        """Sale with gain exceeding married exemption."""
        proceeds = calculate_home_sale_proceeds(
            sale_price=1_200_000,
            loan_balance=200_000,
            selling_costs=96_000,
            purchase_price=400_000,
            capital_gains_tax_rate=0.15,
            filing_status="married",
            years_owned=5,
        )
        # Equity: 1M, minus selling: 904K
        # Gain: 800K, taxable: 300K (800K - 500K exemption)
        # Tax: 45K
        # Net: 904K - 45K = 859K
        assert proceeds == pytest.approx(859_000, rel=1e-6)

    def test_sale_under_2_years_no_exemption(self):
        """Sale under 2 years: no capital gains exemption."""
        proceeds = calculate_home_sale_proceeds(
            sale_price=500_000,
            loan_balance=300_000,
            selling_costs=40_000,
            purchase_price=400_000,
            capital_gains_tax_rate=0.15,
            filing_status="single",
            years_owned=1,
        )
        # Equity: 200K, minus selling: 160K
        # Gain: 100K, fully taxable (no exemption under 2 years)
        # Tax: 15K
        # Net: 160K - 15K = 145K
        assert proceeds == pytest.approx(145_000, rel=1e-6)

    def test_sale_at_loss(self):
        """Sale at a loss: no capital gains tax."""
        proceeds = calculate_home_sale_proceeds(
            sale_price=350_000,
            loan_balance=200_000,
            selling_costs=28_000,
            purchase_price=400_000,
            capital_gains_tax_rate=0.15,
            filing_status="single",
            years_owned=5,
        )
        # Equity: 150K, minus selling: 122K
        # Loss: 50K (no tax owed)
        assert proceeds == 122_000


class TestBuyerFinalWealth:
    """Test buyer's total wealth calculation."""

    def test_with_portfolio_gains(self):
        """Buyer has both home proceeds and portfolio."""
        wealth = calculate_buyer_final_wealth(
            home_sale_proceeds=300_000,
            investment_portfolio=50_000,
            portfolio_cost_basis=30_000,
            capital_gains_tax_rate=0.15,
        )
        # Portfolio gain: 20K, tax: 3K
        # Total: 300K + 47K = 347K
        assert wealth == pytest.approx(347_000, rel=1e-6)

    def test_no_portfolio(self):
        """Buyer with no investment portfolio."""
        wealth = calculate_buyer_final_wealth(
            home_sale_proceeds=300_000,
            investment_portfolio=0,
            portfolio_cost_basis=0,
            capital_gains_tax_rate=0.15,
        )
        assert wealth == 300_000


class TestRenterFinalWealth:
    """Test renter's total wealth calculation."""

    def test_with_gains_and_deposit(self):
        """Renter has portfolio gains and security deposit."""
        wealth = calculate_renter_final_wealth(
            investment_portfolio=200_000,
            portfolio_cost_basis=100_000,
            capital_gains_tax_rate=0.15,
            security_deposit_returned=2_000,
        )
        # Gain: 100K, tax: 15K
        # After tax: 185K + 2K deposit = 187K
        assert wealth == pytest.approx(187_000, rel=1e-6)

    def test_no_gains(self):
        """Renter with no investment gains."""
        wealth = calculate_renter_final_wealth(
            investment_portfolio=100_000,
            portfolio_cost_basis=100_000,
            capital_gains_tax_rate=0.15,
            security_deposit_returned=2_000,
        )
        assert wealth == 102_000


class TestDetermineVerdict:
    """Test verdict determination."""

    def test_buy_wins(self):
        """Positive net benefit = buy wins."""
        verdict = determine_verdict(net_benefit=50_000)
        assert verdict == "buy"

    def test_rent_wins(self):
        """Negative net benefit = rent wins."""
        verdict = determine_verdict(net_benefit=-50_000)
        assert verdict == "rent"

    def test_toss_up_positive(self):
        """Small positive benefit = toss-up."""
        verdict = determine_verdict(net_benefit=500, threshold=1000)
        assert verdict == "toss-up"

    def test_toss_up_negative(self):
        """Small negative benefit = toss-up."""
        verdict = determine_verdict(net_benefit=-500, threshold=1000)
        assert verdict == "toss-up"

    def test_exactly_at_threshold(self):
        """At threshold = still toss-up."""
        verdict = determine_verdict(net_benefit=1000, threshold=1000)
        assert verdict == "toss-up"


class TestFindBreakEvenYear:
    """Test break-even year detection."""

    def test_break_even_in_year_3(self):
        """Break-even in year 3."""
        year = find_break_even_year([-10_000, -5_000, 2_000, 10_000])
        assert year == 3

    def test_break_even_year_1(self):
        """Buying wins immediately."""
        year = find_break_even_year([5_000, 10_000, 15_000])
        assert year == 1

    def test_never_breaks_even(self):
        """Renting always wins."""
        year = find_break_even_year([-10_000, -8_000, -5_000, -2_000])
        assert year is None

    def test_empty_list(self):
        """Empty list returns None."""
        year = find_break_even_year([])
        assert year is None
