"""Tests for tax benefit calculations."""

import pytest

from ownvsrent.engine.taxes import (
    calculate_annual_tax_benefit,
    calculate_deductible_mortgage_interest,
    calculate_deductible_pmi,
    calculate_itemized_deductions,
)


class TestMortgageInterestDeduction:
    """Test mortgage interest deduction with $750K cap."""

    def test_loan_under_cap_full_deduction(self):
        """Loan under $750K: full interest is deductible."""
        # $500K loan, $30K interest paid
        deductible = calculate_deductible_mortgage_interest(
            interest_paid=30_000,
            loan_amount=500_000,
        )
        assert deductible == 30_000

    def test_loan_at_cap_full_deduction(self):
        """Loan exactly at $750K: full interest is deductible."""
        deductible = calculate_deductible_mortgage_interest(
            interest_paid=50_000,
            loan_amount=750_000,
        )
        assert deductible == 50_000

    def test_loan_over_cap_prorated(self):
        """Loan over $750K: interest is prorated."""
        # $1M loan, $60K interest -> only 75% deductible
        deductible = calculate_deductible_mortgage_interest(
            interest_paid=60_000,
            loan_amount=1_000_000,
        )
        assert deductible == 45_000  # 60K * (750K / 1M)

    def test_loan_double_cap(self):
        """Loan at $1.5M: only 50% of interest deductible."""
        deductible = calculate_deductible_mortgage_interest(
            interest_paid=100_000,
            loan_amount=1_500_000,
        )
        assert deductible == 50_000  # 100K * (750K / 1.5M)


class TestPMIDeductibility:
    """Test PMI deductibility rules (OBBBA 2025, effective 2026)."""

    def test_pmi_not_deductible_before_2026(self):
        """PMI is not deductible before 2026."""
        deductible = calculate_deductible_pmi(
            pmi_paid=2_000,
            year=2025,
            agi=80_000,
        )
        assert deductible == 0

    def test_pmi_deductible_from_2026(self):
        """PMI is deductible starting 2026 for AGI under $100K."""
        deductible = calculate_deductible_pmi(
            pmi_paid=2_000,
            year=2026,
            agi=80_000,
        )
        assert deductible == 2_000

    def test_pmi_phase_out_at_105k(self):
        """PMI is 50% deductible at AGI $105K (midpoint of phase-out)."""
        deductible = calculate_deductible_pmi(
            pmi_paid=2_000,
            year=2026,
            agi=105_000,
        )
        assert deductible == 1_000  # 50% of $2K

    def test_pmi_not_deductible_above_110k(self):
        """PMI is not deductible for AGI >= $110K."""
        deductible = calculate_deductible_pmi(
            pmi_paid=2_000,
            year=2026,
            agi=110_000,
        )
        assert deductible == 0

    def test_pmi_phase_out_at_102k(self):
        """PMI is 80% deductible at AGI $102K."""
        deductible = calculate_deductible_pmi(
            pmi_paid=2_000,
            year=2026,
            agi=102_000,
        )
        assert deductible == 1_600  # 80% of $2K


class TestItemizedDeductions:
    """Test total itemized deductions calculation."""

    def test_basic_itemized_under_salt_cap(self):
        """Basic case: SALT under cap, full deductions."""
        itemized = calculate_itemized_deductions(
            mortgage_interest=15_000,
            property_tax=6_000,
            state_income_tax=8_000,
            pmi=1_000,
            year=2026,
            loan_amount=500_000,
            agi=80_000,
        )
        # Mortgage interest: $15K (under $750K cap)
        # PMI: $1K (deductible in 2026)
        # SALT: $6K + $8K = $14K (under $40K cap)
        # Total: $30K
        assert itemized == 30_000

    def test_salt_cap_binding_2026(self):
        """SALT cap of $40K applies when property + state tax exceeds."""
        itemized = calculate_itemized_deductions(
            mortgage_interest=20_000,
            property_tax=25_000,  # High property tax state
            state_income_tax=25_000,  # High income tax state
            pmi=0,
            year=2026,
            loan_amount=500_000,
            agi=80_000,
        )
        # Mortgage interest: $20K
        # SALT: capped at ~$40.4K (2026 has 1% inflation adjustment)
        salt_cap_2026 = 40_000 * 1.01  # $40,400
        expected = 20_000 + salt_cap_2026
        assert itemized == pytest.approx(expected, rel=1e-6)

    def test_salt_cap_2030_reverts(self):
        """SALT cap reverts to $10K in 2030."""
        itemized = calculate_itemized_deductions(
            mortgage_interest=20_000,
            property_tax=25_000,
            state_income_tax=25_000,
            pmi=0,
            year=2030,
            loan_amount=500_000,
            agi=80_000,
        )
        # Mortgage interest: $20K
        # SALT: capped at $10K (2030)
        # PMI: $0 (deductible but none paid)
        assert itemized == 30_000


class TestAnnualTaxBenefit:
    """Test the main tax benefit calculation."""

    def test_standard_deduction_wins_single(self):
        """When itemized < standard, tax benefit is ZERO."""
        benefit, itemization_beneficial = calculate_annual_tax_benefit(
            mortgage_interest=8_000,
            property_tax=4_000,
            state_income_tax=2_000,
            pmi=0,
            year=2026,
            loan_amount=400_000,
            marginal_tax_rate=0.22,
            filing_status="single",
            agi=80_000,
        )
        # Itemized: $8K + $4K + $2K = $14K
        # Standard (2026 single): ~$16,065
        # Standard wins, so benefit = 0
        assert benefit == 0
        assert itemization_beneficial is False

    def test_standard_deduction_wins_married(self):
        """Married couple: standard deduction usually wins."""
        benefit, itemization_beneficial = calculate_annual_tax_benefit(
            mortgage_interest=15_000,
            property_tax=8_000,
            state_income_tax=5_000,
            pmi=1_000,
            year=2026,
            loan_amount=500_000,
            marginal_tax_rate=0.22,
            filing_status="married",
            agi=150_000,
        )
        # Itemized: $15K + $8K + $5K + $1K = $29K
        # Standard (2026 married): ~$32,130
        # Standard wins
        assert benefit == 0
        assert itemization_beneficial is False

    def test_itemized_wins_high_cost(self):
        """High mortgage + SALT: itemizing wins."""
        benefit, itemization_beneficial = calculate_annual_tax_benefit(
            mortgage_interest=35_000,  # ~$700K mortgage at 5%
            property_tax=15_000,  # High property tax
            state_income_tax=10_000,  # High state income tax
            pmi=0,
            year=2026,
            loan_amount=700_000,
            marginal_tax_rate=0.32,
            filing_status="single",
            agi=200_000,
        )
        # Itemized: $35K + min($25K, $40.4K) = $35K + $25K = $60K
        # Standard (2026 single): ~$16,065
        # Excess: $60K - $16,065 = $43,935
        # Benefit: $43,935 * 0.32 = $14,059.20
        standard_2026 = 15_750 * 1.02  # $16,065
        excess = 60_000 - standard_2026
        expected_benefit = excess * 0.32
        assert benefit == pytest.approx(expected_benefit, rel=1e-6)
        assert itemization_beneficial is True

    def test_salt_cap_limits_benefit(self):
        """SALT cap limits the deduction even when itemizing wins."""
        benefit, itemization_beneficial = calculate_annual_tax_benefit(
            mortgage_interest=30_000,
            property_tax=30_000,  # Would be $60K SALT without cap
            state_income_tax=30_000,
            pmi=0,
            year=2026,
            loan_amount=500_000,
            marginal_tax_rate=0.24,
            filing_status="single",
            agi=100_000,
        )
        # Mortgage interest: $30K
        # SALT: capped at $40.4K (not $60K)
        # Total itemized: $70.4K
        salt_cap_2026 = 40_000 * 1.01
        itemized = 30_000 + salt_cap_2026
        standard_2026 = 15_750 * 1.02
        excess = itemized - standard_2026
        expected_benefit = excess * 0.24
        assert benefit == pytest.approx(expected_benefit, rel=1e-6)
        assert itemization_beneficial is True

    def test_mortgage_interest_cap_applied(self):
        """$750K mortgage interest cap is applied."""
        # $1M loan, paying ~$65K interest, but only 75% deductible
        benefit, itemization_beneficial = calculate_annual_tax_benefit(
            mortgage_interest=65_000,
            property_tax=10_000,
            state_income_tax=5_000,
            pmi=0,
            year=2026,
            loan_amount=1_000_000,  # Over $750K cap
            marginal_tax_rate=0.35,
            filing_status="single",
            agi=300_000,
        )
        # Deductible interest: $65K * 0.75 = $48.75K
        # SALT: $15K (under cap)
        # Total itemized: $63.75K
        deductible_interest = 65_000 * 0.75
        itemized = deductible_interest + 15_000
        standard_2026 = 15_750 * 1.02
        excess = itemized - standard_2026
        expected_benefit = excess * 0.35
        assert benefit == pytest.approx(expected_benefit, rel=1e-6)
        assert itemization_beneficial is True

    def test_pmi_included_from_2026(self):
        """PMI is included in itemized deductions from 2026."""
        # Same scenario with and without PMI
        benefit_without_pmi, _ = calculate_annual_tax_benefit(
            mortgage_interest=35_000,
            property_tax=10_000,
            state_income_tax=10_000,
            pmi=0,
            year=2026,
            loan_amount=500_000,
            marginal_tax_rate=0.24,
            filing_status="single",
            agi=80_000,
        )

        benefit_with_pmi, _ = calculate_annual_tax_benefit(
            mortgage_interest=35_000,
            property_tax=10_000,
            state_income_tax=10_000,
            pmi=3_000,  # $3K PMI
            year=2026,
            loan_amount=500_000,
            marginal_tax_rate=0.24,
            filing_status="single",
            agi=80_000,
        )

        # PMI adds $3K * 0.24 = $720 in benefit
        assert benefit_with_pmi == pytest.approx(benefit_without_pmi + 720, rel=1e-6)

    def test_year_2030_salt_cap_change(self):
        """2030 uses $10K SALT cap."""
        benefit_2029, _ = calculate_annual_tax_benefit(
            mortgage_interest=30_000,
            property_tax=20_000,
            state_income_tax=10_000,
            pmi=0,
            year=2029,
            loan_amount=500_000,
            marginal_tax_rate=0.24,
            filing_status="single",
            agi=100_000,
        )

        benefit_2030, _ = calculate_annual_tax_benefit(
            mortgage_interest=30_000,
            property_tax=20_000,
            state_income_tax=10_000,
            pmi=0,
            year=2030,
            loan_amount=500_000,
            marginal_tax_rate=0.24,
            filing_status="single",
            agi=100_000,
        )

        # 2030 has $10K cap vs 2029's ~$41.6K cap
        # 2030 loses $21.6K of SALT deductions at 24% = ~$5K less benefit
        assert benefit_2030 < benefit_2029
        # The difference should be roughly (30K SALT - 10K cap) * 0.24 = $4.8K less
        # But need to account for inflation differences too
        diff = benefit_2029 - benefit_2030
        assert diff > 4_000  # At least $4K difference


class TestEdgeCases:
    """Test edge cases."""

    def test_zero_mortgage_interest(self):
        """No mortgage (paid cash): only SALT deductions."""
        benefit, itemization_beneficial = calculate_annual_tax_benefit(
            mortgage_interest=0,
            property_tax=20_000,
            state_income_tax=15_000,
            pmi=0,
            year=2026,
            loan_amount=0,
            marginal_tax_rate=0.32,
            filing_status="single",
            agi=200_000,
        )
        # SALT: capped at $40.4K, but only $35K paid
        # Standard (2026): ~$16,065
        # Excess: $35K - $16,065 = $18,935
        # Benefit: $18,935 * 0.32 = $6,059.20
        standard_2026 = 15_750 * 1.02
        excess = 35_000 - standard_2026
        expected_benefit = excess * 0.32
        assert benefit == pytest.approx(expected_benefit, rel=1e-6)
        assert itemization_beneficial is True

    def test_zero_everything(self):
        """No deductions at all: benefit is zero."""
        benefit, itemization_beneficial = calculate_annual_tax_benefit(
            mortgage_interest=0,
            property_tax=0,
            state_income_tax=0,
            pmi=0,
            year=2026,
            loan_amount=0,
            marginal_tax_rate=0.22,
            filing_status="single",
            agi=50_000,
        )
        assert benefit == 0
        assert itemization_beneficial is False

    def test_high_agi_salt_phase_out(self):
        """High MAGI triggers SALT cap phase-out."""
        benefit, _ = calculate_annual_tax_benefit(
            mortgage_interest=30_000,
            property_tax=25_000,
            state_income_tax=25_000,
            pmi=0,
            year=2026,
            loan_amount=500_000,
            marginal_tax_rate=0.35,
            filing_status="single",
            agi=600_000,  # Above $500K phase-out threshold
        )
        # SALT cap is reduced by 30%: $40.4K * 0.70 = $28.28K
        # But floored at $10K, so $28.28K is used
        # Itemized: $30K + $28.28K = $58.28K
        salt_cap = 40_000 * 1.01 * 0.70
        itemized = 30_000 + salt_cap
        standard = 15_750 * 1.02
        excess = itemized - standard
        expected = excess * 0.35
        assert benefit == pytest.approx(expected, rel=1e-6)
