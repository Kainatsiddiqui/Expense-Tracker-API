from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth import get_current_user
from app import models
from app.services import report_service
from app.schemas import YearComparison

from datetime import date

def get_date_range(
    start: date | None,
    end: date | None,
):
    today = date.today()

    if start is None:
        start = date(today.year, 1, 1)

    if end is None:
        end = today

    return start, end
# ================================================

# Display Under Yearly Analytics
router = APIRouter(
    prefix="/reports",
    tags=["Yearly analytics"]
)

@router.get(
    "/year-comparison",
    response_model=YearComparison
)
def year_comparison(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return report_service.get_year_comparison(
        db,
        current_user
    )
