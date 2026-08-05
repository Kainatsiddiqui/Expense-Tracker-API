from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth import get_current_user
from app import models
from app.services import report_service
from app.schemas import CategorySpending, CategoryBreakdown, CategoryTrend, CategoryGrowth
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

# Display Under Category Analytics
router = APIRouter(
    prefix="/reports",
    tags=["Category analytics"]
)

@router.get(
    "/category",
    response_model=list[CategorySpending]
)
def category_spending(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
    start: date | None = None,
    end: date | None = None
):
    return report_service.get_category_spending(
        db,
        current_user,
        start,
        end
    )

@router.get(
    "/category-percentage",
    response_model=list[CategoryBreakdown]
)
def category_percentage(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
    start: date | None = None,
    end: date | None = None
):
    return report_service.get_category_percentage(
        db,
        current_user,
        start,
        end
    )

@router.get(
    "/category-trends",
    response_model=list[CategoryTrend]
)
def category_trends(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
    start: date | None = None,
    end: date | None = None
):
    return report_service.get_category_trends(
        db,
        current_user,
        start,
        end
    )

@router.get(
    "/fastest-growing-category",
    response_model=list[CategoryGrowth]
)
def fastest_growing_category(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
    start: date | None = None,
    end: date | None = None
):
    return report_service.get_fastest_growing_category(
        db,
        current_user,
        start,
        end
    )

