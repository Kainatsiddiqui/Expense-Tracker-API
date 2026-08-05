from sqlalchemy.orm import Session

from app.database import SessionLocal
from app import models

USER_EMAIL = "kainat@example.com"


def clear_expenses():
    db: Session = SessionLocal()

    try:
        user = (
            db.query(models.User)
            .filter(models.User.email == USER_EMAIL)
            .first()
        )

        if not user:
            print("User not found")
            return

        deleted = (
            db.query(models.Expense)
            .filter(models.Expense.owner_id == user.id)
            .delete()
        )

        db.commit()

        print(f"Deleted {deleted} expenses")

    finally:
        db.close()


if __name__ == "__main__":
    clear_expenses()