from sqlalchemy.orm import Session
from app import models
from app.schemas import ExpenseCreate, ExpenseUpdate, UserCreate
from app.auth import hash_password, verify_password
from datetime import date
from . import models

# Function to create user using the UserCreate Model
def create_user(db: Session, user: UserCreate):
    hashed_password = hash_password(user.password)

    db_user = models.User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user

# Function to get the current users email id
def get_user_by_email(db: Session, email: str):
    return (
        db.query(models.User)
        .filter(models.User.email == email)
        .first()
    )

# Function to authenticate user
def authenticate_user(
    db: Session,
    email: str,
    password: str
):
    user = get_user_by_email(db, email)

    if user is None:
        return None

    if not verify_password(
        password,
        user.hashed_password
    ):
        return None

    return user

# Function that performs like authorization gate to get the specific expense related to the current user
def get_user_expense(
    db: Session,
    expense_id: int,
    user: models.User
):
    return (
        db.query(models.Expense)
        .filter(
            models.Expense.id == expense_id,
            models.Expense.owner_id == user.id
        )
        .first()
    )

# Function to create expense for the current user and add it in the db
def create_expense(
    db: Session,
    expense: ExpenseCreate,
    user: models.User
):
    db_expense = models.Expense(
        title=expense.title,
        amount=expense.amount,
        category=expense.category,
        date=expense.date,
        owner_id=user.id
    )

    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)

    return db_expense

# Function to return all the expenses added by current user
def get_expenses(
    db: Session,
    user: models.User,
    page: int = 1,
    limit: int = 10,
    search: str | None = None,
    category: str | None = None,
    start_date: date | None = None,
    end_date: date | None = None,
    sort: str = "date_desc",
):
    query = db.query(models.Expense).filter(
        models.Expense.owner_id == user.id
    )

    if search:
        query = query.filter(
            models.Expense.title.ilike(
                f"%{search}%"
            )
        )

    if category:
        query = query.filter(
            models.Expense.category == category
        )

    if start_date:
        query = query.filter(
            models.Expense.date >= start_date
        )

    if end_date:
        query = query.filter(
            models.Expense.date <= end_date
        )

    if sort == "date_desc":
        query = query.order_by(
            models.Expense.date.desc()
        )

    elif sort == "date_asc":
        query = query.order_by(
            models.Expense.date.asc()
        )

    elif sort == "amount_desc":
        query = query.order_by(
            models.Expense.amount.desc()
        )

    elif sort == "amount_asc":
        query = query.order_by(
            models.Expense.amount.asc()
        )

    total = query.count()

    expenses = (
        query.offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return {
        "items": expenses,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (
            total + limit - 1
        ) // limit,
    }

# Function that uses the autorization gate and returns the 1 expense
def get_expense(
    db: Session,
    expense_id: int,
    user: models.User
):
     return get_user_expense(
        db,
        expense_id,
        user
    )

# Function that uses the authorization gate and delete the specific expense of the current user 
def delete_expense(
    db: Session, 
    expense_id: int, 
    user: models.User
):
    expense = get_user_expense(
        db,
        expense_id,
        user
    )
    if expense is None:
        return None
    db.delete(expense)
    db.commit()
    return expense

# Function that uses the authorization gate and update the specific expense of the current user 
def update_expense(
    db: Session,
    expense_id: int,
    expense_update: ExpenseUpdate,
    user: models.User
):
    expense = get_user_expense(
        db,
        expense_id,
        user
    )
    if expense is None:
        return None
    update_data = expense_update.model_dump(
        exclude_unset=True
    )
    for field, value in update_data.items():
        setattr(expense, field, value)
    db.commit()
    db.refresh(expense)
    return expense

# Get the current user's budget
def get_budget(
    db: Session,
    user: models.User,
):
    budget = (
        db.query(models.Budget)
        .filter(models.Budget.owner_id == user.id)
        .first()
    )

    return budget


# Create or update the user's budget
def update_budget(
    db: Session,
    user: models.User,
    monthly_budget: float,
):
    budget = (
        db.query(models.Budget)
        .filter(models.Budget.owner_id == user.id)
        .first()
    )

    if budget:
        budget.monthly_budget = monthly_budget
    else:
        budget = models.Budget(
            monthly_budget=monthly_budget,
            owner_id=user.id,
        )
        db.add(budget)

    db.commit()
    db.refresh(budget)

    return budget

def get_expenses_for_export(
    db: Session,
    user: models.User,
    start: date | None = None,
    end: date | None = None,
):
    query = (
        db.query(models.Expense)
        .filter(models.Expense.owner_id == user.id)
    )

    if start:
        query = query.filter(
            models.Expense.date >= start
        )

    if end:
        query = query.filter(
            models.Expense.date <= end
        )

    return query.order_by(
        models.Expense.date.desc()
    ).all()