"""Main calculator orchestrator.

This module runs the month-by-month simulation comparing renting vs buying,
producing detailed snapshots and final wealth comparison.
"""

from ownvsrent.engine.amortization import (
    calculate_loan_balance,
    calculate_monthly_payment,
    calculate_payment_breakdown,
)
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
from ownvsrent.engine.renting import (
    calculate_monthly_rent,
    calculate_renter_initial_investment,
    calculate_renter_monthly_cost,
    grow_portfolio,
)
from ownvsrent.engine.taxes import calculate_annual_tax_benefit
from ownvsrent.engine.types import (
    CalculatorInputs,
    CalculatorResults,
    MonthlySnapshot,
    YearlySnapshot,
)
from ownvsrent.engine.wealth import (
    calculate_buyer_final_wealth,
    calculate_home_sale_proceeds,
    calculate_renter_final_wealth,
    determine_verdict,
    find_break_even_year,
)


def calculate(inputs: CalculatorInputs) -> CalculatorResults:
    """Run the full rent vs buy calculation.

    Performs month-by-month simulation for the holding period, tracking:
    - Monthly costs for both scenarios
    - Portfolio growth for both parties
    - Tax benefits from homeownership
    - Final wealth comparison

    Args:
        inputs: Calculator inputs

    Returns:
        Complete calculation results with snapshots and verdict
    """
    # Derived values
    down_payment = inputs.purchase_price * inputs.down_payment_percent
    loan_amount = inputs.purchase_price - down_payment
    buyer_closing_costs = loan_amount * inputs.buyer_closing_costs_percent
    total_months = inputs.holding_period_years * 12
    monthly_investment_return = (1 + inputs.annual_investment_return) ** (1 / 12) - 1

    # Monthly mortgage payment (P&I)
    mortgage_payment = calculate_monthly_payment(
        principal=loan_amount,
        annual_rate=inputs.mortgage_rate,
        term_years=inputs.loan_term_years,
    )

    # Find PMI removal month
    pmi_removed_month = find_pmi_removal_month(
        loan_amount=loan_amount,
        purchase_price=inputs.purchase_price,
        mortgage_rate=inputs.mortgage_rate,
        loan_term_years=inputs.loan_term_years,
        annual_appreciation=inputs.annual_appreciation,
        down_payment_percent=inputs.down_payment_percent,
    )

    # Initial portfolios
    renter_initial = calculate_renter_initial_investment(
        down_payment=down_payment,
        closing_costs=buyer_closing_costs,
        security_deposit=inputs.monthly_rent * inputs.security_deposit,
        broker_fee=inputs.monthly_rent * inputs.broker_fee,
    )
    renter_portfolio = renter_initial
    renter_contributions = renter_initial

    buyer_portfolio = 0.0
    buyer_contributions = 0.0

    # Track monthly and yearly data
    monthly_snapshots: list[MonthlySnapshot] = []
    yearly_data: dict[int, dict] = {}

    # Month-by-month simulation
    for month in range(1, total_months + 1):
        year = (month - 1) // 12 + 1
        tax_year = 2025 + year  # Assuming calculation starts in 2026

        # === RENTER CALCULATIONS ===
        rent = calculate_monthly_rent(
            base_rent=inputs.monthly_rent,
            month=month,
            annual_rent_increase=inputs.annual_rent_increase,
        )
        renter_cost = calculate_renter_monthly_cost(
            rent=rent,
            renter_insurance=inputs.renter_insurance,
        )

        # === BUYER CALCULATIONS ===
        home_value = calculate_home_value(
            purchase_price=inputs.purchase_price,
            month=month,
            annual_appreciation=inputs.annual_appreciation,
        )
        loan_balance = calculate_loan_balance(
            principal=loan_amount,
            annual_rate=inputs.mortgage_rate,
            term_years=inputs.loan_term_years,
            month=month,
        )
        principal, interest = calculate_payment_breakdown(
            principal=loan_amount,
            annual_rate=inputs.mortgage_rate,
            term_years=inputs.loan_term_years,
            month=month,
        )
        property_tax = calculate_property_tax(
            home_value=home_value,
            property_tax_rate=inputs.property_tax_rate,
        )
        home_insurance = calculate_home_insurance(
            home_value=home_value,
            home_insurance_rate=inputs.home_insurance_rate,
        )
        maintenance = calculate_maintenance(
            home_value=home_value,
            maintenance_rate=inputs.maintenance_rate,
        )
        pmi = calculate_pmi(
            loan_balance=loan_balance,
            home_value=home_value,
            original_loan_amount=loan_amount,
            pmi_rate=inputs.pmi_rate,
        )
        buyer_cost = calculate_buyer_monthly_cost(
            mortgage_payment=mortgage_payment,
            property_tax=property_tax,
            home_insurance=home_insurance,
            maintenance=maintenance,
            hoa=inputs.hoa_monthly,
            pmi=pmi,
        )
        home_equity = calculate_home_equity(
            home_value=home_value,
            loan_balance=loan_balance,
        )

        # === PORTFOLIO UPDATES ===
        # Both parties invest their monthly savings (fair comparison)
        monthly_difference = buyer_cost - renter_cost

        if monthly_difference > 0:
            # Renting is cheaper - renter invests the difference
            renter_contribution = monthly_difference
            buyer_contribution = 0
        else:
            # Buying is cheaper - buyer invests the difference
            renter_contribution = 0
            buyer_contribution = -monthly_difference

        renter_portfolio = grow_portfolio(
            current_value=renter_portfolio,
            monthly_contribution=renter_contribution,
            monthly_return_rate=monthly_investment_return,
        )
        renter_contributions += renter_contribution

        buyer_portfolio = grow_portfolio(
            current_value=buyer_portfolio,
            monthly_contribution=buyer_contribution,
            monthly_return_rate=monthly_investment_return,
        )
        buyer_contributions += buyer_contribution

        # === TRACK YEARLY DATA ===
        if year not in yearly_data:
            yearly_data[year] = {
                "total_rent_paid": 0,
                "total_buy_cost_paid": 0,
                "mortgage_interest": 0,
                "property_tax": 0,
                "pmi": 0,
            }

        yearly_data[year]["total_rent_paid"] += renter_cost
        yearly_data[year]["total_buy_cost_paid"] += buyer_cost
        yearly_data[year]["mortgage_interest"] += interest
        yearly_data[year]["property_tax"] += property_tax
        yearly_data[year]["pmi"] += pmi

        # Store snapshot
        monthly_snapshots.append(
            MonthlySnapshot(
                month=month,
                rent=rent,
                renter_insurance=inputs.renter_insurance,
                total_rent_cost=renter_cost,
                renter_portfolio=renter_portfolio,
                mortgage_payment=mortgage_payment,
                principal=principal,
                interest=interest,
                property_tax=property_tax,
                home_insurance=home_insurance,
                maintenance=maintenance,
                hoa=inputs.hoa_monthly,
                pmi=pmi,
                total_buy_cost=buyer_cost,
                loan_balance=loan_balance,
                home_value=home_value,
                home_equity=home_equity,
                buyer_portfolio=buyer_portfolio,
            )
        )

    # === YEARLY SNAPSHOTS WITH TAX BENEFITS ===
    yearly_snapshots: list[YearlySnapshot] = []
    cumulative_rent = 0.0
    cumulative_buy = 0.0

    for year in range(1, inputs.holding_period_years + 1):
        tax_year = 2025 + year
        year_data = yearly_data[year]

        cumulative_rent += year_data["total_rent_paid"]
        cumulative_buy += year_data["total_buy_cost_paid"]

        # Get end-of-year snapshot
        month_idx = year * 12 - 1
        eoy_snapshot = monthly_snapshots[month_idx]

        # Calculate tax benefit for the year
        # Estimate state income tax (simplified - based on marginal rate * estimated income)
        estimated_agi = 100_000  # Simplified assumption
        state_income_tax = estimated_agi * inputs.state_tax_rate

        tax_benefit, itemization_beneficial = calculate_annual_tax_benefit(
            mortgage_interest=year_data["mortgage_interest"],
            property_tax=year_data["property_tax"],
            state_income_tax=state_income_tax,
            pmi=year_data["pmi"],
            year=tax_year,
            loan_amount=loan_amount,
            marginal_tax_rate=inputs.marginal_tax_rate,
            filing_status=inputs.filing_status,
            agi=estimated_agi,
        )

        # Calculate wealth at this point
        selling_costs = calculate_selling_costs(
            sale_price=eoy_snapshot.home_value,
            selling_costs_percent=inputs.selling_costs_percent,
        )

        buyer_sale_proceeds = calculate_home_sale_proceeds(
            sale_price=eoy_snapshot.home_value,
            loan_balance=eoy_snapshot.loan_balance,
            selling_costs=selling_costs,
            purchase_price=inputs.purchase_price,
            capital_gains_tax_rate=inputs.capital_gains_tax_rate,
            filing_status=inputs.filing_status,
            years_owned=year,
        )

        buyer_wealth = calculate_buyer_final_wealth(
            home_sale_proceeds=buyer_sale_proceeds,
            investment_portfolio=eoy_snapshot.buyer_portfolio,
            portfolio_cost_basis=buyer_contributions,
            capital_gains_tax_rate=inputs.capital_gains_tax_rate,
        )

        security_deposit_returned = inputs.monthly_rent * inputs.security_deposit
        renter_wealth = calculate_renter_final_wealth(
            investment_portfolio=eoy_snapshot.renter_portfolio,
            portfolio_cost_basis=renter_contributions,
            capital_gains_tax_rate=inputs.capital_gains_tax_rate,
            security_deposit_returned=security_deposit_returned,
        )

        net_benefit = buyer_wealth - renter_wealth

        yearly_snapshots.append(
            YearlySnapshot(
                year=year,
                total_rent_paid=cumulative_rent,
                total_buy_cost_paid=cumulative_buy,
                home_equity=eoy_snapshot.home_equity,
                renter_portfolio=eoy_snapshot.renter_portfolio,
                buyer_portfolio=eoy_snapshot.buyer_portfolio,
                tax_benefit=tax_benefit,
                renter_wealth=renter_wealth,
                buyer_wealth=buyer_wealth,
                net_benefit=net_benefit,
            )
        )

    # === FINAL RESULTS ===
    final_year = yearly_snapshots[-1]
    final_month = monthly_snapshots[-1]

    # Determine itemization status for year 1
    year1_tax_benefit, itemization_beneficial = calculate_annual_tax_benefit(
        mortgage_interest=yearly_data[1]["mortgage_interest"],
        property_tax=yearly_data[1]["property_tax"],
        state_income_tax=100_000 * inputs.state_tax_rate,
        pmi=yearly_data[1]["pmi"],
        year=2026,
        loan_amount=loan_amount,
        marginal_tax_rate=inputs.marginal_tax_rate,
        filing_status=inputs.filing_status,
        agi=100_000,
    )

    # Find break-even year
    yearly_net_benefits = [ys.net_benefit for ys in yearly_snapshots]
    break_even_year = find_break_even_year(yearly_net_benefits)

    return CalculatorResults(
        verdict=determine_verdict(final_year.net_benefit),
        break_even_year=break_even_year,
        net_benefit_at_horizon=final_year.net_benefit,
        renter_wealth_at_horizon=final_year.renter_wealth,
        buyer_wealth_at_horizon=final_year.buyer_wealth,
        monthly_snapshots=monthly_snapshots,
        yearly_snapshots=yearly_snapshots,
        monthly_rent=inputs.monthly_rent,
        monthly_ownership_cost=monthly_snapshots[0].total_buy_cost,
        monthly_mortgage_payment=mortgage_payment,
        itemization_beneficial=itemization_beneficial,
        pmi_removed_month=pmi_removed_month,
    )
