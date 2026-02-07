"""API route definitions."""

from fastapi import APIRouter

router = APIRouter()


@router.post("/calculate")
async def calculate():
    """Calculate rent vs buy comparison."""
    return {"message": "Not implemented yet"}


@router.post("/sensitivity")
async def sensitivity():
    """Calculate sensitivity analysis."""
    return {"message": "Not implemented yet"}


@router.post("/montecarlo")
async def montecarlo():
    """Run Monte Carlo simulation."""
    return {"message": "Not implemented yet"}
