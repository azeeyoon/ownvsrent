"""Health check endpoint tests."""


def test_health_check(client):
    """Health endpoint should return healthy status."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_calculate_stub(client):
    """Calculate endpoint should return stub response."""
    response = client.post("/api/calculate")
    assert response.status_code == 200
    assert "message" in response.json()
