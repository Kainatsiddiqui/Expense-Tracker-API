from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import ExpenseCreate, ExpenseResponse, ExpenseUpdate, PaginatedExpenses
from app import crud, models
from app.auth import get_current_user
from datetime import date

router = APIRouter()

# Router to get all the expenses of the current user
@router.get(
    "/expenses",
    response_model=PaginatedExpenses
)
def get_expenses(
    page: int = 1,
    limit: int = 10,
    search: str | None = None,
    category: str | None = None,
    start_date: date | None = None,
    end_date: date | None = None,
    sort: str = "date_desc",
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.get_expenses(
        db=db,
        user=current_user,
        page=page,
        limit=limit,
        search=search,
        category=category,
        start_date=start_date,
        end_date=end_date,
        sort=sort,
    )

# Router to get a specific expense of the current user
@router.get(
    "/expenses/{expense_id}",
    response_model=ExpenseResponse
)
def get_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    expense = crud.get_expense(
        db,
        expense_id,
        current_user
    )

    if expense is None:
        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    return expense

# Router to add new expense in the table for the current user
@router.post(
    "/expenses",
    response_model=ExpenseResponse,
    status_code=status.HTTP_201_CREATED
)
def create_expense(
    expense: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.create_expense(
        db,
        expense,
        current_user
    )

# Router to delete a specific expense of current User.
@router.delete("/expenses/{expense_id}", response_model=ExpenseResponse)
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    expense = crud.delete_expense(db, expense_id, current_user)

    if expense is None:
        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    return expense

# Router to update a specific expense of the current user.
@router.patch("/expenses/{expense_id}", response_model=ExpenseResponse)
def update_expense(
    expense_id: int,
    expense_update: ExpenseUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    expense = crud.update_expense(
        db,
        expense_id,
        expense_update,
        current_user
    )

    if expense is None:
        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    return expense