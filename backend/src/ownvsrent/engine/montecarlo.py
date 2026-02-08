"""Monte Carlo simulation for probabilistic outcomes.

This module runs multiple simulations with randomized inputs to show
the distribution of possible outcomes.
"""

import random
from statistics import median, quantiles

from ownvsrent.engine.calculator import calculate
from ownvsrent.engine.types import CalculatorInputs, MonteCarloResult


# Default standard deviations for random variables
DEFAULT_STD_DEVS = {
    "annual_appreciation": 0.05,  # High volatility in home prices
    "annual_investment_return": 0.15,  # Stock market volatility
    "annual_rent_increase": 0.02,  # Moderate rent variation
}


def run_monte_carlo(
    inputs: CalculatorInputs,
    simulations: int = 1000,
    seed: int | None = None,
    std_devs: dict[str, float] | None = None,
) -> MonteCarloResult:
    """Run Monte Carlo simulation for rent vs buy analysis.

    Uses normal distributions for key variables to model uncertainty:
    - Home appreciation: high volatility
    - Investment returns: high volatility
    - Rent growth: moderate volatility

    Args:
        inputs: Base calculator inputs (means for distributions)
        simulations: Number of simulations to run
        seed: Optional random seed for reproducibility
        std_devs: Optional custom standard deviations

    Returns:
        MonteCarloResult with distribution statistics
    """
    if seed is not None:
        random.seed(seed)

    if std_devs is None:
        std_devs = DEFAULT_STD_DEVS

    distribution: list[float] = []
    buy_wins_count = 0

    for _ in range(simulations):
        # Sample random values for each variable
        sampled_values = {}

        for var_name, std_dev in std_devs.items():
            mean = getattr(inputs, var_name)
            sampled = random.gauss(mean, std_dev)

            # Apply bounds
            if var_name == "annual_appreciation":
                sampled = max(-0.15, min(0.20, sampled))
            elif var_name == "annual_investment_return":
                sampled = max(-0.10, min(0.25, sampled))
            elif var_name == "annual_rent_increase":
                sampled = max(0, min(0.15, sampled))

            sampled_values[var_name] = sampled

        # Create modified inputs
        sim_inputs = inputs.model_copy(update=sampled_values)

        try:
            result = calculate(sim_inputs)
            net_benefit = result.net_benefit_at_horizon
            distribution.append(net_benefit)

            if result.verdict == "buy":
                buy_wins_count += 1
        except Exception:
            # Skip failed simulations
            continue

    if not distribution:
        # All simulations failed - return base case
        base_result = calculate(inputs)
        return MonteCarloResult(
            simulations=0,
            buy_wins_pct=0.5,
            median=base_result.net_benefit_at_horizon,
            p10=base_result.net_benefit_at_horizon,
            p90=base_result.net_benefit_at_horizon,
            distribution=[base_result.net_benefit_at_horizon],
        )

    # Calculate statistics
    distribution.sort()
    actual_sims = len(distribution)

    # Calculate percentiles
    if actual_sims >= 4:
        # Use quantiles for sufficient data
        qs = quantiles(distribution, n=10)
        p10 = qs[0]  # 10th percentile
        p90 = qs[-1]  # 90th percentile
    else:
        # Not enough data for percentiles
        p10 = distribution[0]
        p90 = distribution[-1]

    return MonteCarloResult(
        simulations=actual_sims,
        buy_wins_pct=buy_wins_count / actual_sims * 100,
        median=median(distribution),
        p10=p10,
        p90=p90,
        distribution=distribution,
    )
