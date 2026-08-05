from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth import get_current_user
from app import models
from app.services import report_service
from app.schemas import BiggestTransaction, AverageDailySpending, WeekendWeekdaySpending
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

# Display Under Behavioural Analytics
router = APIRouter(
    prefix="/reports",
    tags=["Behavioural analytics"]
)

@router.get(
    "/biggest-transaction",
    response_model=BiggestTransaction
)
def biggest_transaction(
    start: date | None = None,
    end: date | None = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    expense = report_service.get_biggest_transaction(
        db,
        current_user,
        start,
        end
    )

    if expense is None:
        raise HTTPException(
            status_code=404,
            detail="No expenses found"
        )

    return expense


@router.get(
    "/average-daily",
    response_model=AverageDailySpending
)
def average_daily_spending(
    start: date | None = None,
    end: date | None = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return report_service.get_average_daily_spending(
        db,
        current_user,
        start,
        end
    )

@router.get(
    "/weekend-vs-weekday",
    response_model=WeekendWeekdaySpending
)
def weekend_vs_weekday(
    start: date | None = None,
    end: date | None = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return report_service.get_weekend_vs_weekday(
        start,
        end,
        db,
        current_user
    )