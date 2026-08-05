from pathlib import Path
import pandas as pd
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app import models
from datetime import datetime

EXCEL_FILE = Path("Expense Tracker.xlsx")
USER_EMAIL = "kainat@example.com"

def import_expenses():
    db: Session = SessionLocal()
    try:
        user = (
            db.query(models.User)
            .filter(models.User.email == USER_EMAIL)
            .first()
        )

        if not user:
            print(f"User '{USER_EMAIL}' not found.")
            return

        df = pd.read_excel(EXCEL_FILE)

        required_columns = {"Date", "Category", "Name", "Amount"}

        if not required_columns.issubset(df.columns):
            print("Excel file has missing columns.")
            return

        imported = 0
        skipped = 0

        for _, row in df.iterrows():
            expense_date = pd.to_datetime(row["Date"]).date()
            category = str(row["Category"]).strip()
            title = str(row["Name"]).strip()
            amount = float(row["Amount"])
            existing = (
                db.query(models.Expense)
                .filter(
                    models.Expense.owner_id == user.id,
                    models.Expense.date == expense_date,
                    models.Expense.title == title,
                    models.Expense.amount == amount,
                    models.Expense.category == category,
                )
                .first()
            )

            if existing:
                skipped += 1
                continue

            expense = models.Expense(
                title=title,
                amount=amount,
                category=category,
                date=expense_date,
                owner_id=user.id,
            )

            db.add(expense)
            imported += 1

        db.commit()

        print(f"Imported: {imported}")
        print(f"Skipped duplicates: {skipped}")

    finally:
        db.close()

if __name__ == "__main__":
    import_expenses()