from datetime import datetime, timezone, date
from sqlalchemy import func
from sqlalchemy.orm import Session

from app import models, crud
from collections import defaultdict
from datetime import date
import csv
import io
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

# Function to calculate KPIs
def get_dashboard_summary(
    db: Session,
    user: models.User,
    start: date | None = None,
    end: date | None = None
):
    start, end = get_date_range(
        start,
        end,
    )
    #Total spent in the selected period
    selected_period_spent = (
        db.query(func.sum(models.Expense.amount))
        .filter(
            models.Expense.owner_id == user.id,
            models.Expense.date >= start,
            models.Expense.date <= end
        )
        .scalar()
    ) or 0

    #Average monthly spend in the selected period
    expenses = (
        db.query(models.Expense)
        .filter(
            models.Expense.owner_id == user.id,
            models.Expense.date >= start,
            models.Expense.date <= end
        )
        .all()
    )
    monthly_totals = defaultdict(float)
    for expense in expenses:
        key = expense.date.strftime("%Y-%m")
        monthly_totals[key] += expense.amount

    average_monthly_spend = (
        sum(monthly_totals.values()) / len(monthly_totals)
        if monthly_totals
        else 0
    )

    #Top category in the selected period
    top_category = (
        db.query(
            models.Expense.category,
            func.sum(models.Expense.amount).label("total"),
        )
        .filter(
            models.Expense.owner_id == user.id,
            models.Expense.date >= start,
            models.Expense.date <= end
        )
        .group_by(models.Expense.category)
        .order_by(func.sum(models.Expense.amount).desc())
        .first()
    )

    top_category_name = (
        top_category.category
        if top_category
        else None
    )

    # Get user budget
    budget = crud.get_budget(db, user)
    monthly_budget = (
        budget.monthly_budget
        if budget
        else 0
    )
    # Current month spending (always current month)
    today = date.today()
    current_month_start = date(today.year, today.month, 1)
    this_month_spent = (
        db.query(func.sum(models.Expense.amount))
            .filter(
                models.Expense.owner_id == user.id,
                models.Expense.date >= current_month_start,
                models.Expense.date <= today,
            )
        .scalar()
    ) or 0
    
    remaining = monthly_budget - this_month_spent

    percentage_used = (
        (this_month_spent / monthly_budget) * 100
        if monthly_budget > 0
        else 0
    )
    return {
        "summary": {
            "selected_period_spent": round(
                selected_period_spent,
                2,
            ),
            "selected_month_spent": round(
                this_month_spent,
                2,
            ),
            "average_monthly_spend": round(
                average_monthly_spend,
                2,
            ),
            "top_category": top_category_name,
        },
        "budget": {
            "monthly_budget": round(
                monthly_budget,
                2
            ),
            "spent": round(
                this_month_spent,
                2
            ),
            "remaining": round(
                remaining,
                2
            ),
            "percentage_used": round(
                percentage_used,
                2
            )
        }
    }


def get_category_spending(
    db: Session,
    user: models.User,
    start: date | None = None,
    end: date | None = None
):
    start, end = get_date_range(
        start,
        end,
    )
    
    results = (
        db.query(
            models.Expense.category,
            func.sum(models.Expense.amount)
        )
        .filter(
            models.Expense.owner_id == user.id,
            models.Expense.date >= start,
            models.Expense.date <= end
            )
        .group_by(models.Expense.category)
        .order_by(func.sum(models.Expense.amount).desc())
        .all()
    )

    return [
        {
            "category": category,
            "total_spent": total
        }
        for category, total in results
    ]


def get_monthly_trend(
    db: Session,
    user: models.User,
    start: date | None = None,
    end: date | None = None
):
    start, end = get_date_range(
        start,
        end,
    )
    results = (
        db.query(
            func.strftime(
                "%Y-%m",
                models.Expense.date
            ).label("month"),
            func.sum(models.Expense.amount).label("total_spent")
        )
        .filter(
            models.Expense.owner_id == user.id,
            models.Expense.date >= start,
            models.Expense.date <= end
            )
        .group_by(
            func.strftime(
                "%Y-%m",
                models.Expense.date,
            )
        )
        .order_by(
            func.strftime(
                "%Y-%m",
                models.Expense.date,
            )
        )
        .all()
    )

    return [
        {
            "month": row.month,
            "total_spent": round(
                row.total_spent,
                2,
            ),
        }
        for row in results
    ]

def get_total_for_period(
    db: Session,
    user: models.User,
    start: date | None = None,
    end: date | None = None
):
    start, end = get_date_range(
        start,
        end,
    )
    return (
        db.query(func.sum(models.Expense.amount))
        .filter(
            models.Expense.owner_id == user.id,
            models.Expense.date >= start,
            models.Expense.date < end
        )
        .scalar()
    ) or 0

def get_month_comparison(
    db: Session,
    user: models.User,
    start: date | None = None,
    end: date | None = None
):
    start, end = get_date_range(
        start,
        end,
    )
    today = date.today()
    current_month_start = today.replace(day=1)

    if current_month_start.month == 12:
        next_month = date(current_month_start.year + 1, 1, 1)
    else:
        next_month = date(current_month_start.year, current_month_start.month + 1, 1)

    if current_month_start.month == 1:
        previous_month_start = date(current_month_start.year - 1, 12, 1)
    else:
        previous_month_start = date(current_month_start.year, current_month_start.month - 1, 1)
    
    current_total = get_total_for_period(
    db,
    user,
    current_month_start,
    next_month
    )

    previous_total = get_total_for_period(
        db,
        user,
        previous_month_start,
        current_month_start
    )

    difference = current_total - previous_total

    if previous_total == 0:
        percentage_change = 0   
    else:
        percentage_change = (
            difference / previous_total
        ) * 100

    return {
        "current_month": current_total,
        "previous_month": previous_total,
        "difference": difference,
        "percentage_change": round(
            percentage_change,
            2
        )
    }

def get_biggest_transaction(
    db: Session,
    user: models.User,
    start: date | None = None,
    end: date | None = None
):
    start, end = get_date_range(
        start,
        end,
    )
    return (
        db.query(models.Expense)
        .filter(
            models.Expense.owner_id == user.id,
            models.Expense.date >= start,
            models.Expense.date < end
        )
        .order_by(models.Expense.amount.desc())
        .first()
    )

def get_category_percentage(
    db: Session,
    user: models.User,
    start: date | None = None,
    end: date | None = None
):
    start, end = get_date_range(
        start,
        end,
    )
    total_spent = (
        db.query(func.sum(models.Expense.amount))
        .filter(
            models.Expense.owner_id == user.id,
            models.Expense.date >= start,
            models.Expense.date <= end
            )
        .scalar()
    ) or 0

    if total_spent == 0:
        return []

    results = (
        db.query(
            models.Expense.category,
            func.sum(models.Expense.amount).label("amount"),
        )
        .filter(
            models.Expense.owner_id == user.id,
            models.Expense.date >= start,
            models.Expense.date <= end
        )
        .group_by(models.Expense.category)
        .order_by(
            func.sum(models.Expense.amount).desc()
        )
        .all()
    )

    return [
        {
            "category": row.category,
            "amount": round(
                row.amount,
                2,
            ),
            "percentage": round(
                (row.amount / total_spent) * 100,
                2,
            ),
        }
        for row in results
    ]

def get_average_daily_spending(
    db: Session,
    user: models.User,
    start: date | None = None,
    end: date | None = None
):
    start, end = get_date_range(
        start,
        end,
    )
    total_spent = (
        db.query(func.sum(models.Expense.amount))
        .filter(
            models.Expense.owner_id == user.id,
            models.Expense.date >= start,
            models.Expense.date <= end
        )
        .scalar()
    ) or 0

    days = (end - start).days
    average = (
        total_spent / days
        if days > 0
        else 0
    )

    return {
        "start_date": start,
        "end_date": end,
        "total_spent": total_spent,
        "days": days,
        "average_daily_spending": round(
            average,
            2
        )
    }

def get_weekend_vs_weekday(
    db: Session,
    user: models.User,
    start: date | None = None,
    end: date | None = None
):
    start, end = get_date_range(
        start,
        end,
    )
    results = (
        db.query(
            func.strftime(
                "%w",
                models.Expense.date
            ).label("day_of_week"),
            func.sum(models.Expense.amount),
            func.count(models.Expense.id)
        )
        .filter(
            models.Expense.owner_id == user.id,
            models.Expense.date >= start,
            models.Expense.date < end
            )
        .group_by("day_of_week")
        .all()
    )
    #combine the totals
    weekday_spending = 0
    weekend_spending = 0

    weekday_transactions = 0
    weekend_transactions = 0

    for day, total, count in results:
        if day in ("0", "6"):
            weekend_spending += total
            weekend_transactions += count
        else:
            weekday_spending += total
            weekday_transactions += count

    #calculate average
    weekday_average = (
        weekday_spending / weekday_transactions
        if weekday_transactions > 0
        else 0
    )

    weekend_average = (
        weekend_spending / weekend_transactions
        if weekend_transactions > 0
        else 0
    )
    return {
        "weekday_spending": weekday_spending,
        "weekend_spending": weekend_spending,
        "weekday_transactions": weekday_transactions,
        "weekend_transactions": weekend_transactions,
        "weekday_average": round(
            weekday_average,
            2
        ),
        "weekend_average": round(
            weekend_average,
            2
        )
    }

def get_category_trends(
    db: Session,
    user: models.User,
    start: date | None = None,
    end: date | None = None
):
    start, end = get_date_range(
        start,
        end,
    )
    results = (
        db.query(
            models.Expense.category,
            func.strftime(
                "%Y-%m",
                models.Expense.date
            ).label("month"),
            func.sum(models.Expense.amount).label("amount")
        )
        .filter(
            models.Expense.owner_id == user.id,
            models.Expense.date >= start,
            models.Expense.date < end
        )
        .group_by(
            models.Expense.category,
            "month"
        )
        .order_by(
            models.Expense.category,
            "month"
        )
        .all()
    )
    #Transform rows  into nested data
    trends = {}

    for category, month, amount in results:
        if category not in trends:
            trends[category] = []

        trends[category].append(
            {
                "month": month,
                "amount": amount
            }
        )
    #convert to API response
    return [
        {
            "category": category,
            "trend": trend
        }
        for category, trend in trends.items()
    ]

def get_fastest_growing_category(
    db: Session,
    user: models.User,
    start: date | None = None,
    end: date | None = None
):
    start, end = get_date_range(
        start,
        end,
    )
    now = datetime.now(timezone.utc)

    current_month_start = now.replace(
        day=1,
        hour=0,
        minute=0,
        second=0,
        microsecond=0
    )

    if current_month_start.month == 12:
        next_month_start = current_month_start.replace(
            year=current_month_start.year + 1,
            month=1
        )
    else:
        next_month_start = current_month_start.replace(
            month=current_month_start.month + 1
        )

    if current_month_start.month == 1:
        previous_month_start = current_month_start.replace(
            year=current_month_start.year - 1,
            month=12
        )
    else:
        previous_month_start = current_month_start.replace(
            month=current_month_start.month - 1
        )
    #query current months total
    current_results = (
        db.query(
            models.Expense.category,
            func.sum(models.Expense.amount)
        )
        .filter(
            models.Expense.owner_id == user.id,
            models.Expense.date >= current_month_start,
            models.Expense.date < next_month_start
        )
        .group_by(models.Expense.category)
        .all()
    )
    #query previous months total
    previous_results = (
        db.query(
            models.Expense.category,
            func.sum(models.Expense.amount)
        )
        .filter(
            models.Expense.owner_id == user.id,
            models.Expense.date >= previous_month_start,
            models.Expense.date < current_month_start
        )
        .group_by(models.Expense.category)
        .all()
    )
    #convert to dictionary
    current = {
        category: amount
        for category, amount in current_results
    }

    previous = {
        category: amount
        for category, amount in previous_results
    }
    #compare categories
    all_categories = set(current.keys()) | set(previous.keys())

    growth = []

    for category in all_categories:
        current_amount = current.get(category, 0)
        previous_amount = previous.get(category, 0)

        growth_amount = current_amount - previous_amount

        if previous_amount == 0:
            growth_percentage = 100 if current_amount > 0 else 0
        else:
            growth_percentage = (
                growth_amount / previous_amount
            ) * 100

        growth.append(
            {
                "category": category,
                "previous_month": previous_amount,
                "current_month": current_amount,
                "growth_amount": growth_amount,
                "growth_percentage": round(
                    growth_percentage,
                    2
                )
            }
        )
    #sort by growth
    growth.sort(
        key=lambda x: x["growth_percentage"],
        reverse=True
    )

    return growth

def get_year_comparison(
    db: Session,
    user: models.User,
    start: date | None = None,
    end: date | None = None
):
    start, end = get_date_range(
        start,
        end,
    )
    now = datetime.now(timezone.utc)

    current_year = now.year
    previous_year = current_year - 1

    current_year_start = datetime(
        current_year,
        1,
        1,
        tzinfo=timezone.utc
    )

    next_year_start = datetime(
        current_year + 1,
        1,
        1,
        tzinfo=timezone.utc
    )

    previous_year_start = datetime(
        previous_year,
        1,
        1,
        tzinfo=timezone.utc
    )

    current_total = get_total_for_period(
        db,
        user,
        current_year_start,
        next_year_start
    )

    previous_total = get_total_for_period(
        db,
        user,
        previous_year_start,
        current_year_start
    )

    difference = current_total - previous_total

    if previous_total == 0:
        percentage_change = 0
    else:
        percentage_change = (
            difference / previous_total
        ) * 100

    return {
        "current_year": current_year,
        "previous_year": previous_year,
        "current_year_spending": current_total,
        "previous_year_spending": previous_total,
        "difference": difference,
        "percentage_change": round(
            percentage_change,
            2
        )
    }

def get_highest_spending_month(
    db: Session,
    user: models.User,
    start: date | None = None,
    end: date | None = None
):
    start, end = get_date_range(
        start,
        end,
    )
    result = (
        db.query(
            func.strftime(
                "%Y-%m",
                models.Expense.date,
            ).label("month"),
            func.sum(models.Expense.amount).label("total_spent"),
        )
        .filter(
            models.Expense.owner_id == user.id,
            models.Expense.date >= start,
            models.Expense.date <= end,
        )
        .group_by(
            func.strftime(
                "%Y-%m",
                models.Expense.date,
            )
        )
        .order_by(
            func.sum(models.Expense.amount).desc()
        )
        .first()
    )

    if result is None:
        return None

    return {
        "month": result.month,
        "total_spent": round(
            result.total_spent,
            2,
        ),
    }

def get_dashboard_data(
    db: Session,
    user: models.User,
    start: date | None = None,
    end: date | None = None

):
    summary = get_dashboard_summary(
        start,
        end,
        db,
        user
    )

    month_comparison = get_month_comparison(
        start,
        end,
        db,
        user
    )

    biggest_transaction = (
        get_biggest_transaction(start, end, db, user)
        or {
            "id": 0,
            "title": "No expenses",
            "amount": 0,
            "category": "Miscellaneous",
            "date": datetime.now(timezone.utc)
        }
    )

    highest_spending_month = (
        get_highest_spending_month(start, end, db, user)
        or {
            "month": "",
            "total_spent": 0
        }
    )

    category_percentage = get_category_percentage(
        start,
        end,
        db,
        user
    )

    return {
        "summary": summary,
        "month_comparison": month_comparison,
        "biggest_transaction": biggest_transaction,
        "highest_spending_month": highest_spending_month,
        "category_percentage": category_percentage
    }

def export_report_csv(
    db: Session,
    user: models.User,
    start: date | None = None,
    end: date | None = None,
):
    expenses = crud.get_expenses_for_export(
        db=db,
        user=user,
        start=start,
        end=end,
    )

    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow(
        [
            "Date",
            "Title",
            "Category",
            "Amount",
        ]
    )

    for expense in expenses:
        writer.writerow(
            [
                expense.date,
                expense.title,
                expense.category,
                expense.amount,
            ]
        )

    output.seek(0)

    filename = "expense_report.csv"

    if start and end:
        filename = (
            f"expense_report_{start}_to_{end}.csv"
        )

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition": (
                f"attachment; filename={filename}"
            )
        },
    )