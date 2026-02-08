"""API route definitions."""

from fastapi import APIRouter, HTTPException
from pydantic import ValidationError

from ownvsrent.engine import (
    CalculatorInputs,
    CalculatorResults,
    MonteCarloResult,
    SensitivityResult,
    calculate,
    run_monte_carlo,
    run_sensitivity_analysis,
)

router = APIRouter()


@router.post("/calculate", response_model=CalculatorResults)
async def calculate_endpoint(inputs: CalculatorInputs) -> CalculatorResults:
    """Calculate rent vs buy comparison.

    Args:
        inputs: Calculator input parameters

    Returns:
        Complete calculation results including verdict, snapshots, and statistics
    """
    try:
        result = calculate(inputs)
        return result
    except ValidationError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Calculation error: {str(e)}")


@router.post("/sensitivity", response_model=list[SensitivityResult])
async def sensitivity_endpoint(inputs: CalculatorInputs) -> list[SensitivityResult]:
    """Calculate sensitivity analysis for tornado chart.

    Varies key parameters to show their impact on the rent vs. buy decision.

    Args:
        inputs: Calculator input parameters

    Returns:
        List of sensitivity results sorted by impact
    """
    try:
        results = run_sensitivity_analysis(inputs)
        return results
    except ValidationError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sensitivity analysis error: {str(e)}")


@router.post("/montecarlo", response_model=MonteCarloResult)
async def montecarlo_endpoint(
    inputs: CalculatorInputs,
    simulations: int = 1000,
) -> MonteCarloResult:
    """Run Monte Carlo simulation.

    Runs multiple simulations with randomized inputs to show
    the distribution of possible outcomes.

    Args:
        inputs: Calculator input parameters
        simulations: Number of simulations to run (default 1000)

    Returns:
        Monte Carlo results with statistics and distribution
    """
    if simulations < 10:
        raise HTTPException(status_code=400, detail="Minimum 10 simulations required")
    if simulations > 10000:
        raise HTTPException(status_code=400, detail="Maximum 10000 simulations allowed")

    try:
        result = run_monte_carlo(inputs, simulations=simulations)
        return result
    except ValidationError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Monte Carlo error: {str(e)}")
