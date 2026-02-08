"""Health check and API endpoint tests."""


def test_health_check(client):
    """Health endpoint should return healthy status."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_calculate_endpoint(client):
    """Calculate endpoint should return valid results."""
    payload = {
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
    response = client.post("/api/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["verdict"] in ["buy", "rent", "toss-up"]
    assert "net_benefit_at_horizon" in data
    assert "monthly_snapshots" in data
    assert "yearly_snapshots" in data


def test_calculate_missing_fields(client):
    """Calculate endpoint should return 422 for missing fields."""
    response = client.post("/api/calculate", json={})
    assert response.status_code == 422


def test_sensitivity_endpoint(client):
    """Sensitivity endpoint should return results."""
    payload = {
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
    response = client.post("/api/sensitivity", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "variable" in data[0]
    assert "impact" in data[0]


def test_montecarlo_endpoint(client):
    """Monte Carlo endpoint should return results."""
    payload = {
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
    response = client.post("/api/montecarlo?simulations=50", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["simulations"] == 50
    assert "buy_wins_pct" in data
    assert "median" in data
    assert "distribution" in data
