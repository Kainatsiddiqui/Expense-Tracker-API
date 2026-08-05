from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Date
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime, timezone, date


# Model to generate User Table in the Database
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    expenses = relationship("Expense", back_populates="owner")
    budget = relationship(
        "Budget",
        back_populates="owner",
        uselist=False,
    )

# Model to generate a Expense Table with particular rows
class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    category = Column(String, nullable=False)
    date = Column(
            Date,
            default=date.today,
            nullable=False
        )
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    created_at = Column(
    DateTime(timezone=True),
    default=lambda: datetime.now(timezone.utc)
    )
    owner = relationship("User", back_populates="expenses")

# Model to generate Budget table in the Database
class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)

    monthly_budget = Column(Float, nullable=False)

    owner_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        unique=True,
    )
    created_at = Column(
            DateTime(timezone=True),
            default=lambda: datetime.now(timezone.utc)
            )

    owner = relationship(
        "User",
        back_populates="budget",
    )