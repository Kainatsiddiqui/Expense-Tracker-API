from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth import get_current_user
from app import models
from app.services import report_service
from app.schemas import MonthlyTrend, MonthComparison, HighestSpendingMonth
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

#Display under Monthly Analytics
router = APIRouter(
    prefix="/reports",
    tags=["Monthly analytics"]
)

@router.get(
    "/monthly-trend",
    response_model=list[MonthlyTrend]
)
def monthly_trend(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
    start: date | None = None,
    end: date | None = None
):
    return report_service.get_monthly_trend(
        db,
        current_user,
        start,
        end
    )

@router.get(
    "/month-comparison",
    response_model=MonthComparison
)
def month_comparison(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
    start: date | None = None,
    end: date | None = None
):
    return report_service.get_month_comparison(
        db,
        current_user,
        start,
        end
    )


@router.get(
    "/highest-spending-month",
    response_model=HighestSpendingMonth
)
def highest_spending_month(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
    start: date | None = None,
    end: date | None = None
):
    result = report_service.get_highest_spending_month(
        db,
        current_user,
        start,
        end
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="No expenses found"
        )

    return result
