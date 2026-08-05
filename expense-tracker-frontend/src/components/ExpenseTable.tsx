import type { Expense } from "../types/expense";
import { formatCurrency } from "../utils/formatCurrency";
import { formatDate } from "../utils/formatDate";
import { Pencil, Trash2 } from "lucide-react";

type ExpenseTableProps = {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
};

function ExpenseTable({
  expenses,
    onEdit,
  onDelete,
}: ExpenseTableProps) {

    const categoryColors: Record<
        string,
        string
        > = {
        Food: "bg-red-50 text-red-700",
        Grocery:
            "bg-green-50 text-green-700",
        Investment:
            "bg-blue-50 text-blue-700",
        Rent:
            "bg-purple-50 text-purple-700",
        "House Share":
            "bg-indigo-50 text-indigo-700",
        Shopping:
            "bg-pink-50 text-pink-700",
        Travel:
            "bg-cyan-50 text-cyan-700",
        Miscellaneous:
            "bg-yellow-100 text-yellow-700",
    };
    
    return (
        <table className="w-full table-fixed">
        <thead className="bg-gray-50 border-b">
            <tr>
                <th className="px-6 py-4 text-center text-xs font-medium uppercase text-black-500">
                Date
                </th>

                <th className="px-6 py-4 text-center text-xs font-medium uppercase text-black-500">
                Title
                </th>

                <th className="px-6 py-4 text-center text-xs font-medium uppercase text-black-500">
                Category
                </th>

                <th className="px-6 py-4 text-center text-xs font-medium uppercase text-black-500">
                Amount
                </th>

                <th className="px-6 py-4 text-center text-xs font-medium uppercase text-black-500">
                Actions
                </th>
            </tr>
        </thead>

        <tbody>
            {expenses.length === 0 ? (
            <tr>
                <td
                colSpan={5}
                className="text-center py-12 text-gray-500"
                >
                No expenses found.
                </td>
            </tr>
            ) : (
                expenses.map((expense) => (
                <tr
                    key={expense.id}
                    className="border-b last:border-b-0 hover:bg-blue-50/40 transition-colors"
                    >
                    <td className="px-6 py-4 text-xs text-gray-700 font-medium">
                        {formatDate(expense.date)}
                    </td>

                    <td className="px-6 py-4 text-xs text-gray-700 font-medium">
                        {expense.title}
                    </td>

                    <td className="px-6 py-4 text-xs text-gray-700 font-medium">
                        <span
                            className={`inline-flex rounded-full px-3 py-3 text-gray-700 font-medium ${
                                categoryColors[
                                expense.category
                                ] ||
                                "bg-gray-100 text-gray-700"
                            }`}
                            >
                            {expense.category}
                        </span>
                    </td>

                    <td className="text-right text-xs px-6 py-4 text-gray-700 font-medium text-gray-900 tabular-nums">
                            {formatCurrency(expense.amount)}
                    </td>

                    <td className="px-6 py-4" >
                        <div className="flex items-center justify-center gap-2">
                            <button
                            onClick={() =>
                                onEdit(expense)
                            }
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Edit expense"
                            >
                            <Pencil size={16} />
                            </button>

                            <button
                            onClick={() =>
                                onDelete(expense)
                            }
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete expense"
                            >
                            <Trash2 size={16} />
                            </button>
                        </div>
                    </td>
                </tr>
                ))
            )}        
        </tbody>
      </table>
  );
}

export default ExpenseTable;