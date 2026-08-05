from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth import get_current_user
from app import models
from app.services import report_service
from app.schemas import DashboardResponse
from datetime import date
from fastapi.responses import StreamingResponse


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

#Display Under Dashboard in Swagger
router = APIRouter(
    prefix="/reports",
    tags=["Dashboard"]
)

@router.get(
    "/dashboard",
    response_model=DashboardResponse
)
def dashboard(
    start: date | None = None,
    end: date | None = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    summary = report_service.get_dashboard_summary(
        db,
        current_user,
        start,
        end,
    )

    trend = report_service.get_monthly_trend(
        db,
        current_user,
        start,
        end,
    )

    category = report_service.get_category_percentage(
        db,
        current_user,
        start,
        end,
    )

    highest = report_service.get_highest_spending_month(
        db,
        current_user,
        start,
        end,
    )

    return {
        **summary,
        "monthly_trend": trend,
        "category_breakdown": category,
        "highest_spending_month": highest,
    }


@router.get(
    "/export",
    response_class=StreamingResponse,
)
def export_report(
    start: date | None = None,
    end: date | None = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return report_service.export_report_csv(
        db=db,
        user=current_user,
        start=start,
        end=end,
    )