"""Tests for buying cash flow calculations."""

import pytest

from ownvsrent.engine.buying import (
    calculate_buyer_monthly_cost,
    calculate_home_equity,
    calculate_home_insurance,
    calculate_home_value,
    calculate_maintenance,
    calculate_pmi,
    calculate_property_tax,
    calculate_selling_costs,
    find_pmi_removal_month,
)


class TestHomeValue:
    """Test home value appreciation."""

    def test_month_zero_is_purchase_price(self):
        """Month 0 should be purchase price."""
        value = calculate_home_value(
            purchase_price=400_000,
            month=0,
            annual_appreciation=0.03,
        )
        assert value == 400_000

    def test_one_year_appreciation(self):
        """After 12 months, should have ~3% appreciation."""
        value = calculate_home_value(
            purchase_price=400_000,
            month=12,
            annual_appreciation=0.03,
        )
        expected = 400_000 * 1.03
        assert value == pytest.approx(expected, rel=1e-6)

    def test_five_year_appreciation(self):
        """After 60 months, should have 5 years of appreciation."""
        value = calculate_home_value(
            purchase_price=400_000,
            month=60,
            annual_appreciation=0.03,
        )
        expected = 400_000 * (1.03**5)
        assert value == pytest.approx(expected, rel=1e-4)  # Allow small compound diff

    def test_zero_appreciation(self):
        """Zero appreciation means value stays constant."""
        value = calculate_home_value(
            purchase_price=400_000,
            month=120,
            annual_appreciation=0,
        )
        assert value == 400_000

    def test_negative_appreciation(self):
        """Negative appreciation (depreciation) decreases value."""
        value = calculate_home_value(
            purchase_price=400_000,
            month=12,
            annual_appreciation=-0.05,
        )
        expected = 400_000 * 0.95
        assert value == pytest.approx(expected, rel=1e-6)


class TestPMI:
    """Test PMI calculation and removal."""

    def test_pmi_when_ltv_above_80(self):
        """PMI is charged when LTV > 80%."""
        pmi = calculate_pmi(
            loan_balance=350_000,
            home_value=400_000,  # LTV = 87.5%
            original_loan_amount=350_000,
            pmi_rate=0.0075,
        )
        expected = 350_000 * 0.0075 / 12  # $218.75/month
        assert pmi == pytest.approx(expected, rel=1e-6)

    def test_no_pmi_at_80_ltv(self):
        """PMI is removed when LTV <= 80%."""
        pmi = calculate_pmi(
            loan_balance=320_000,
            home_value=400_000,  # LTV = 80%
            original_loan_amount=350_000,
            pmi_rate=0.0075,
        )
        assert pmi == 0

    def test_no_pmi_below_80_ltv(self):
        """PMI is 0 when LTV < 80%."""
        pmi = calculate_pmi(
            loan_balance=300_000,
            home_value=400_000,  # LTV = 75%
            original_loan_amount=350_000,
            pmi_rate=0.0075,
        )
        assert pmi == 0


class TestPropertyTax:
    """Test property tax calculation."""

    def test_basic_property_tax(self):
        """Property tax is calculated on current value."""
        tax = calculate_property_tax(
            home_value=400_000,
            property_tax_rate=0.011,
        )
        expected = 400_000 * 0.011 / 12  # $366.67/month
        assert tax == pytest.approx(expected, rel=1e-6)


class TestHomeInsurance:
    """Test home insurance calculation."""

    def test_basic_insurance(self):
        """Insurance is calculated on current value."""
        insurance = calculate_home_insurance(
            home_value=400_000,
            home_insurance_rate=0.005,
        )
        expected = 400_000 * 0.005 / 12  # $166.67/month
        assert insurance == pytest.approx(expected, rel=1e-6)


class TestMaintenance:
    """Test maintenance calculation."""

    def test_basic_maintenance(self):
        """Maintenance is calculated on current value."""
        maintenance = calculate_maintenance(
            home_value=400_000,
            maintenance_rate=0.015,
        )
        expected = 400_000 * 0.015 / 12  # $500/month
        assert maintenance == pytest.approx(expected, rel=1e-6)


class TestBuyerMonthlyCost:
    """Test total monthly cost calculation."""

    def test_all_components(self):
        """Total cost includes all components."""
        cost = calculate_buyer_monthly_cost(
            mortgage_payment=2000,
            property_tax=367,
            home_insurance=167,
            maintenance=500,
            hoa=200,
            pmi=219,
        )
        assert cost == 3453

    def test_no_pmi_no_hoa(self):
        """Cost without PMI and HOA."""
        cost = calculate_buyer_monthly_cost(
            mortgage_payment=2000,
            property_tax=367,
            home_insurance=167,
            maintenance=500,
            hoa=0,
            pmi=0,
        )
        assert cost == 3034


class TestHomeEquity:
    """Test home equity calculation."""

    def test_positive_equity(self):
        """Normal case: value > balance."""
        equity = calculate_home_equity(
            home_value=500_000,
            loan_balance=300_000,
        )
        assert equity == 200_000

    def test_underwater(self):
        """Underwater: balance > value (negative equity)."""
        equity = calculate_home_equity(
            home_value=300_000,
            loan_balance=350_000,
        )
        assert equity == -50_000


class TestSellingCosts:
    """Test selling costs calculation."""

    def test_standard_selling_costs(self):
        """8% of sale price."""
        costs = calculate_selling_costs(
            sale_price=500_000,
            selling_costs_percent=0.08,
        )
        assert costs == 40_000


class TestFindPMIRemovalMonth:
    """Test PMI removal month detection."""

    def test_no_pmi_with_20_percent_down(self):
        """20% down = no PMI ever."""
        month = find_pmi_removal_month(
            loan_amount=320_000,
            purchase_price=400_000,
            mortgage_rate=0.068,
            loan_term_years=30,
            annual_appreciation=0.03,
            down_payment_percent=0.20,
        )
        assert month is None

    def test_pmi_removal_with_appreciation(self):
        """PMI removed faster with appreciation."""
        month = find_pmi_removal_month(
            loan_amount=380_000,  # 5% down on $400K
            purchase_price=400_000,
            mortgage_rate=0.068,
            loan_term_years=30,
            annual_appreciation=0.03,
            down_payment_percent=0.05,
        )
        # With 3% appreciation and principal paydown, should hit 80% LTV
        # within first few years
        assert month is not None
        assert month < 60  # Should be within 5 years

    def test_pmi_removal_no_appreciation(self):
        """PMI removal with zero appreciation (slower)."""
        month = find_pmi_removal_month(
            loan_amount=380_000,
            purchase_price=400_000,
            mortgage_rate=0.068,
            loan_term_years=30,
            annual_appreciation=0,
            down_payment_percent=0.05,
        )
        # Without appreciation, takes longer
        assert month is not None
        assert month > 36  # More than 3 years

    def test_pmi_removal_10_percent_down(self):
        """10% down should hit 80% LTV reasonably quickly."""
        month = find_pmi_removal_month(
            loan_amount=360_000,  # 10% down on $400K
            purchase_price=400_000,
            mortgage_rate=0.068,
            loan_term_years=30,
            annual_appreciation=0.03,
            down_payment_percent=0.10,
        )
        assert month is not None
        assert month < 48  # Should be within 4 years with appreciation
