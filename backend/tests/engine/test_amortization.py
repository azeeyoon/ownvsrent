"""Tests for amortization calculations."""

import pytest
from ownvsrent.engine.amortization import (
    calculate_monthly_payment,
    calculate_loan_balance,
    calculate_payment_breakdown,
    calculate_total_interest,
)


class TestMonthlyPayment:
    """Tests for monthly payment calculation."""

    def test_standard_30_year_mortgage(self):
        """Test against known Bankrate result for $320K at 6.8% for 30 years."""
        # Bankrate calculator: $2,085.96
        payment = calculate_monthly_payment(320_000, 0.068, 30)
        assert abs(payment - 2085.96) < 1  # Within $1

    def test_15_year_mortgage(self):
        """Test 15-year mortgage has higher payment than 30-year."""
        payment_15 = calculate_monthly_payment(320_000, 0.068, 15)
        payment_30 = calculate_monthly_payment(320_000, 0.068, 30)
        assert payment_15 > payment_30

    def test_zero_interest(self):
        """Test interest-free loan (edge case)."""
        payment = calculate_monthly_payment(120_000, 0, 10)
        assert payment == 1000  # $120K / 120 months

    def test_different_loan_amounts(self):
        """Payment should scale linearly with principal."""
        payment_200k = calculate_monthly_payment(200_000, 0.06, 30)
        payment_400k = calculate_monthly_payment(400_000, 0.06, 30)
        assert abs(payment_400k - 2 * payment_200k) < 0.01


class TestLoanBalance:
    """Tests for remaining balance calculation."""

    def test_balance_decreases(self):
        """Balance should decrease each month."""
        principal = 320_000
        rate = 0.068
        term = 30

        prev_balance = principal
        for month in range(1, 13):
            balance = calculate_loan_balance(principal, rate, term, month)
            assert balance < prev_balance
            prev_balance = balance

    def test_balance_at_end(self):
        """Balance should be zero at end of term."""
        balance = calculate_loan_balance(320_000, 0.068, 30, 360)
        assert balance < 1  # Essentially zero (floating point)

    def test_balance_at_start(self):
        """Balance at month 0 should be principal."""
        balance = calculate_loan_balance(320_000, 0.068, 30, 0)
        assert balance == 320_000

    def test_balance_midway(self):
        """Balance at midpoint should be roughly half (for 0% interest)."""
        # For zero interest, balance decreases linearly
        balance = calculate_loan_balance(120_000, 0, 10, 60)  # Halfway
        assert balance == 60_000


class TestPaymentBreakdown:
    """Tests for principal/interest split."""

    def test_early_payments_mostly_interest(self):
        """Early payments should be mostly interest."""
        principal_1, interest_1 = calculate_payment_breakdown(320_000, 0.068, 30, 1)
        assert interest_1 > principal_1
        # First month interest on $320K at 6.8%/12 ≈ $1,813.33
        assert abs(interest_1 - 1813.33) < 1

    def test_late_payments_mostly_principal(self):
        """Late payments should be mostly principal."""
        principal, interest = calculate_payment_breakdown(320_000, 0.068, 30, 350)
        assert principal > interest

    def test_breakdown_sums_to_payment(self):
        """Principal + interest should equal total payment."""
        payment = calculate_monthly_payment(320_000, 0.068, 30)
        for month in [1, 60, 180, 300, 360]:
            principal, interest = calculate_payment_breakdown(320_000, 0.068, 30, month)
            assert abs((principal + interest) - payment) < 0.01


class TestTotalInterest:
    """Tests for total interest calculation."""

    def test_total_interest_30_year(self):
        """Total interest should be roughly 1.3x principal for 30yr at 6.8%."""
        total = calculate_total_interest(320_000, 0.068, 30)
        # $320K loan at 6.8% for 30 years ≈ $430K total interest
        assert 400_000 < total < 460_000

    def test_15_year_less_interest(self):
        """15-year loan should have less total interest than 30-year."""
        total_15 = calculate_total_interest(320_000, 0.068, 15)
        total_30 = calculate_total_interest(320_000, 0.068, 30)
        assert total_15 < total_30

    def test_zero_interest_loan(self):
        """Zero interest loan should have zero total interest."""
        total = calculate_total_interest(320_000, 0, 30)
        assert total == 0
