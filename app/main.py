from fastapi import FastAPI
from app.routers import (
    expenses,
    auth,
    dashboard,
    monthly_reports,
    category_reports,
    yearly_reports,
    behavioural_reports,
    budget
)
from fastapi.middleware.cors import CORSMiddleware
from app.routers import user

# Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Expense Tracker API",
    description="A personal finance and analytics API built with FastAPI",
    version="1.0.0"
)
# Allow react app to call the API
app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:5173",
            "https://expense-tracker-api-dusky.vercel.app/login",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
app.include_router(user.router)
app.include_router(expenses.router)
app.include_router(auth.router)
app.include_router(budget.router)
app.include_router(dashboard.router)
app.include_router(monthly_reports.router)
app.include_router(category_reports.router)
app.include_router(yearly_reports.router)
app.include_router(behavioural_reports.router)

@app.get("/")
def root():
    return {
        "project": "Expense Tracker API",
        "status": "online",
        "docs": "/docs"
    }

@app.get("/about")
def about():
    return {
        "project": "Expense Tracker API",
        "developer": "Kainat Siddiqui",
        "version": "0.1.0"
    }

