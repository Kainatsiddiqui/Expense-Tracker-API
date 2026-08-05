import { useEffect, useState } from "react";
import type { Expense } from "../types/expense";
import {
  createExpense,
  updateExpense,
} from "../services/expenseService";
import { EXPENSE_CATEGORIES } from "../constants/categories";

type ExpenseFormModalProps = {
  isOpen: boolean;
  expense?: Expense | null;
  onClose: () => void;
  onSuccess: () => void;
};

function ExpenseFormModal({
  isOpen,
  expense,
  onClose,
  onSuccess,
}: ExpenseFormModalProps) {

  //Defining States
  const [title, setTitle] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [date, setDate] = useState(
    new Date()
      .toISOString()
      .split("T")[0]
  );

  const [saving, setSaving] =
    useState(false);

  const [errors, setErrors] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
  });

  //Defining UseEffects
  useEffect(() => {
    if (expense) {
      setTitle(expense.title);
      setAmount(
        expense.amount.toString()
      );
      setCategory(expense.category);
      setDate(expense.date);
    } else {
      setTitle("");
      setAmount("");
      setCategory("");
      setDate(
        new Date()
          .toISOString()
          .split("T")[0]
      );
    }
  }, [expense, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(
      event: KeyboardEvent
    ) {
      if (
        event.key === "Escape" &&
        !saving
      ) {
        onClose();
      }
    }
    document.addEventListener(
      "keydown",
      handleEscape
    );
    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [isOpen, onClose, saving]);

async function handleSubmit() 
  {
      const newErrors = {
        title: "",
        amount: "",
        category: "",
        date: "",
      };

      if (!title.trim()) {
        newErrors.title =
          "Title is required";
      }

      if (!amount || Number(amount) <= 0) {
        newErrors.amount =
          "Enter a valid amount";
      }

      if (!category) {
        newErrors.category =
          "Select a category";
      }

      if (!date) {
        newErrors.date =
          "Select a date";
      }

      setErrors(newErrors);

      if (
        Object.values(newErrors).some(
          (error) => error !== ""
        )
      ) {
        return;
      }

      try {
        setSaving(true);

        const expenseData = {
          title: title.trim(),
          amount: Number(amount),
          category,
          date,
        };

        if (expense) {
          await updateExpense(
            expense.id,
            expenseData
          );
        } else {
          await createExpense(
            expenseData
          );
        }

        onSuccess();
        onClose();
      } catch (error) {
        console.error(
          "Failed to save expense",
          error
        );
        alert("Failed to save expense");
      } finally {
        setSaving(false);
      }
  }
  if (!isOpen) return null;

  return ( 
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={() => {
        if (!saving) onClose();
      }}
    >
    <div
      className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-6"> 
      <h2 className="text-xl font-semibold">
        {expense
        ? "Edit Expense"
        : "Add Expense"}
      </h2>
        <button
          onClick={() => {
            if (!saving) onClose();
          }}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);

              if (errors.title) {
                setErrors((prev) => ({
                  ...prev,
                  title: "",
                }));
              }
            }}
            placeholder="Enter expense title"
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
              errors.title
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }` }          
          />
          {errors.title && (
            <p className="text-red-600 text-sm mt-1">
              {errors.title}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
              errors.amount
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }` }
          />
          {errors.amount && (
            <p className="text-red-600 text-sm mt-1">
              {errors.amount}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
              errors.category
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }` }
          >
            <option value="">
              Select category
            </option>

            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-600 text-sm mt-1">
              {errors.category}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
              errors.date
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }` }
          />
          {errors.date && (
            <p className="text-red-600 text-sm mt-1">
              {errors.date}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => {
            if (!saving) onClose();
          }}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving
          ? "Saving..."
          : expense
          ? "Update Expense"
          : "Add Expense"}
        </button>
      </div>
    </div>
  </div>
  );
}
export default ExpenseFormModal;
