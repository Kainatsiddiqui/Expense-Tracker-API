from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.database import get_db
from app.auth import get_current_user

router = APIRouter(
    prefix="/budget",
    tags=["Budget"],
)


@router.get(
    "",
    response_model=schemas.BudgetResponse,
)
def get_budget(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    budget = crud.get_budget(
        db,
        current_user,
    )

    if budget is None:
        budget = crud.update_budget(
            db,
            current_user,
            0,
        )

    return budget


@router.put(
    "",
    response_model=schemas.BudgetResponse,
)
def update_budget(
    budget_data: schemas.BudgetUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.update_budget(
        db,
        current_user,
        budget_data.monthly_budget,
    )