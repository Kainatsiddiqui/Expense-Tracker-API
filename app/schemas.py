from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List
from enum import Enum
from datetime import datetime, date as dt_date

# Fixed Category for Expenses
class ExpenseCategory(str, Enum):
    FOOD = "Food"
    TRAVEL = "Travel"
    INVESTMENT = "Investment"
    RENT = "Rent"
    SHOPPING = "Shopping"
    GROCERY = "Grocery"
    MISCELLANEOUS = "Miscellaneous"
    HOUSESHOLD = "House Share"

#Space to create Pydantic Models
# Model for User Registration Request
class UserCreate(BaseModel):
    name: str
    email: str
    password: str

# Model for sending User details as API Response
class UserResponse(BaseModel):
    name : str
    id: int
    email: str

    model_config = ConfigDict(from_attributes=True)

class UserProfileUpdate(BaseModel):
    name: str
    
# Model to convert the User details into Token
class Token(BaseModel):
    access_token: str
    token_type: str

# ExpenseCreate is a model to Validate the incoming Requests
class ExpenseCreate(BaseModel):
    title: str
    amount: float
    category: ExpenseCategory
    date: dt_date = Field(default_factory=dt_date.today)

# ExpenseUpdate model is created to validate the incoming request while giving flexibility of all fields as optional
class ExpenseUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
    category: Optional[ExpenseCategory] = None
    date: Optional[dt_date] = None

# ExpenseResponse model created to receive SQLAlchemy objects (ORM) and convert them into API Response (JSON)
class ExpenseResponse(ExpenseCreate):
    id: int
    title: str
    amount: float
    category: str
    date: dt_date
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class BudgetResponse(BaseModel):
    monthly_budget: float

    class Config:
        from_attributes = True

class BudgetUpdate(BaseModel):
    monthly_budget: float

class BudgetSummary(BaseModel):
    monthly_budget: float
    spent: float
    remaining: float
    percentage_used: float

# DashboardSummary Model is a response model 
class DashboardSummary(BaseModel):
    selected_period_spent: float
    selected_month_spent: float
    average_monthly_spend: float
    top_category: Optional[str]

# Response Model
class CategorySpending(BaseModel):
    category: str
    total_spent: float

# Response Model
class MonthlyTrend(BaseModel):
    month: str
    total_spent: float

class CategoryBreakdown(BaseModel):
    category: str
    amount: float
    percentage: float

class MonthComparison(BaseModel):
    current_month: float
    previous_month: float
    difference: float
    percentage_change: float

# REsponse Model for Pagination
class PaginatedExpenses(BaseModel):
    items: List[ExpenseResponse]
    total: int
    page: int
    limit: int
    total_pages: int

class BiggestTransaction(BaseModel):
    id: int
    title: str
    amount: float
    category: ExpenseCategory
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class AverageDailySpending(BaseModel):
    start_date: dt_date
    end_date: dt_date
    total_spent: float
    days: int
    average_daily_spending: float

class WeekendWeekdaySpending(BaseModel):
    weekday_spending: float
    weekend_spending: float
    weekday_transactions: int
    weekend_transactions: int
    weekday_average: float
    weekend_average: float

class MonthlyCategoryAmount(BaseModel):
    month: str
    amount: float

class CategoryTrend(BaseModel):
    category: ExpenseCategory
    trend: list[MonthlyCategoryAmount]

class CategoryGrowth(BaseModel):
    category: ExpenseCategory
    previous_month: float
    current_month: float
    growth_amount: float
    growth_percentage: float

class YearComparison(BaseModel):
    current_year: int
    previous_year: int
    current_year_spending: float
    previous_year_spending: float
    difference: float
    percentage_change: float

class HighestSpendingMonth(BaseModel):
    month: str
    total_spent: float


class DashboardResponse(BaseModel):
    summary: DashboardSummary
    budget: BudgetSummary
    monthly_trend: List[MonthlyTrend]
    category_breakdown: List[CategoryBreakdown]
    highest_spending_month: Optional[HighestSpendingMonth]

