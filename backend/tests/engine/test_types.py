"""Tests for type definitions."""

import pytest
from pydantic import ValidationError
from ownvsrent.engine.types import CalculatorInputs, MonthlySnapshot, CalculatorResults


class TestCalculatorInputs:
    """Tests for CalculatorInputs validation."""

    def test_valid_inputs(self):
        """Valid inputs should pass validation."""
        inputs = CalculatorInputs(
            monthly_rent=2000,
            annual_rent_increase=0.03,
            renter_insurance=30,
            security_deposit=1,
            broker_fee=0,
            purchase_price=400000,
            down_payment_percent=0.20,
            mortgage_rate=0.068,
            loan_term_years=30,
            property_tax_rate=0.011,
            home_insurance_rate=0.005,
            hoa_monthly=0,
            maintenance_rate=0.015,
            pmi_rate=0.0075,
            buyer_closing_costs_percent=0.03,
            selling_costs_percent=0.08,
            holding_period_years=7,
            annual_appreciation=0.035,
            annual_investment_return=0.07,
            marginal_tax_rate=0.22,
            state_tax_rate=0.05,
            filing_status="single",
            capital_gains_tax_rate=0.15,
        )
        assert inputs.purchase_price == 400000
        assert inputs.filing_status == "single"

    def test_invalid_rent_increase_rate(self):
        """Rent increase above 20% should fail."""
        with pytest.raises(ValidationError):
            CalculatorInputs(
                monthly_rent=2000,
                annual_rent_increase=0.25,  # Invalid: 25% > 20%
                renter_insurance=30,
                security_deposit=1,
                broker_fee=0,
                purchase_price=400000,
                down_payment_percent=0.20,
                mortgage_rate=0.068,
                loan_term_years=30,
                property_tax_rate=0.011,
                home_insurance_rate=0.005,
                hoa_monthly=0,
                maintenance_rate=0.015,
                pmi_rate=0.0075,
                buyer_closing_costs_percent=0.03,
                selling_costs_percent=0.08,
                holding_period_years=7,
                annual_appreciation=0.035,
                annual_investment_return=0.07,
                marginal_tax_rate=0.22,
                state_tax_rate=0.05,
                filing_status="single",
                capital_gains_tax_rate=0.15,
            )

    def test_invalid_loan_term(self):
        """Invalid loan terms should fail."""
        with pytest.raises(ValidationError):
            CalculatorInputs(
                monthly_rent=2000,
                annual_rent_increase=0.03,
                renter_insurance=30,
                security_deposit=1,
                broker_fee=0,
                purchase_price=400000,
                down_payment_percent=0.20,
                mortgage_rate=0.068,
                loan_term_years=12,  # Invalid: not 10/15/20/25/30
                property_tax_rate=0.011,
                home_insurance_rate=0.005,
                hoa_monthly=0,
                maintenance_rate=0.015,
                pmi_rate=0.0075,
                buyer_closing_costs_percent=0.03,
                selling_costs_percent=0.08,
                holding_period_years=7,
                annual_appreciation=0.035,
                annual_investment_return=0.07,
                marginal_tax_rate=0.22,
                state_tax_rate=0.05,
                filing_status="single",
                capital_gains_tax_rate=0.15,
            )

    def test_invalid_filing_status(self):
        """Invalid filing status should fail."""
        with pytest.raises(ValidationError):
            CalculatorInputs(
                monthly_rent=2000,
                annual_rent_increase=0.03,
                renter_insurance=30,
                security_deposit=1,
                broker_fee=0,
                purchase_price=400000,
                down_payment_percent=0.20,
                mortgage_rate=0.068,
                loan_term_years=30,
                property_tax_rate=0.011,
                home_insurance_rate=0.005,
                hoa_monthly=0,
                maintenance_rate=0.015,
                pmi_rate=0.0075,
                buyer_closing_costs_percent=0.03,
                selling_costs_percent=0.08,
                holding_period_years=7,
                annual_appreciation=0.035,
                annual_investment_return=0.07,
                marginal_tax_rate=0.22,
                state_tax_rate=0.05,
                filing_status="head_of_household",  # Invalid
                capital_gains_tax_rate=0.15,
            )

    def test_negative_purchase_price(self):
        """Negative purchase price should fail."""
        with pytest.raises(ValidationError):
            CalculatorInputs(
                monthly_rent=2000,
                annual_rent_increase=0.03,
                renter_insurance=30,
                security_deposit=1,
                broker_fee=0,
                purchase_price=-100000,  # Invalid: negative
                down_payment_percent=0.20,
                mortgage_rate=0.068,
                loan_term_years=30,
                property_tax_rate=0.011,
                home_insurance_rate=0.005,
                hoa_monthly=0,
                maintenance_rate=0.015,
                pmi_rate=0.0075,
                buyer_closing_costs_percent=0.03,
                selling_costs_percent=0.08,
                holding_period_years=7,
                annual_appreciation=0.035,
                annual_investment_return=0.07,
                marginal_tax_rate=0.22,
                state_tax_rate=0.05,
                filing_status="single",
                capital_gains_tax_rate=0.15,
            )
