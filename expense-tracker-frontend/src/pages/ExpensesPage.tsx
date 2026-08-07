import { useEffect, useState } from "react";
import ExpenseTable from "../components/ExpenseTable";
import { getExpenses, deleteExpense } from "../services/expenseService";
import type { Expense } from "../types/expense";
import Pagination from "../components/Pagination";
import { EXPENSE_CATEGORIES } from "../constants/categories";
import ExpenseFormModal from "../components/ExpenseFormModal";
import Toast from "../components/Toast";
import TableSkeleton from "../components/TableSkeleton";
import ConfirmationModal from "../components/ConfirmationModal";
import { Plus } from "lucide-react";

function ExpensesPage() {
    const [isAddModalOpen, setIsAddModalOpen] =
        useState(false);

    const [editingExpense, setEditingExpense] =
        useState<Expense | null>(null);
    
    const [search, setSearch] = useState("");
    
    const [searchInput, setSearchInput] =
        useState("");
    
    const [category, setCategory] =
        useState("");

    const [startDate, setStartDate] =
        useState("");

    const [endDate, setEndDate] =
        useState("");

    const [sortBy, setSortBy] =
        useState("date_desc");

    const [expenses, setExpenses] =
        useState<Expense[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [page, setPage] = useState(1);

    const [totalPages, setTotalPages] =
        useState(1);

    const [totalExpenses, setTotalExpenses] =
        useState(0);

    const limit = 10;

    const [deleting, setDeleting] =
        useState(false);

    const [expenseToDelete, setExpenseToDelete] =
        useState<Expense | null>(null);

    const [toast, setToast] = useState({
        message: "",
        type: "success" as
            | "success"
            | "error",
        visible: false,
    });

    function showToast(
        message: string,
        type: "success" | "error" = "success"
        ) {
        setToast({
            message,
            type,
            visible: true,
        });

        setTimeout(() => {
            setToast((prev) => ({
            ...prev,
            visible: false,
            }));
        }, 3000);
    }
    async function handleDelete() {
        if (!expenseToDelete) return;

        try {
            setDeleting(true);

            setExpenses((prev) =>
            prev.filter(
                (e) =>
                e.id !== expenseToDelete.id
            )
            );

            await deleteExpense(
                expenseToDelete.id
            );

            setTotalExpenses(
                (prev) => prev - 1
            );

            showToast(
                "Expense deleted successfully"
            );

            setExpenseToDelete(null);

            const remainingExpenses =
                expenses.length - 1;

            if (
                remainingExpenses === 0 &&
                page > 1
            ) {
                setPage(page - 1);
            } else {
                loadExpenses();
            }
        } catch (error) {
            loadExpenses();

            showToast(
                "Failed to delete expense",
                "error"
            );
        } finally {
            setDeleting(false);
        }
    }
    function handleClearFilters() {
        setSearchInput("");
        setSearch("");
        setCategory("");
        setStartDate("");
        setEndDate("");
        setSortBy("date_desc");
        setPage(1);
    }

   async function loadExpenses() {
    try {
        setLoading(true);
        const data = await getExpenses({
            page,
            limit,
            search,
            category,
            startDate,
            endDate,
            sort: sortBy,
        });
        setExpenses(data.items);
        setTotalPages(data.total_pages);
        setTotalExpenses(data.total);
        } catch (error) {
            console.error(
                "Failed to load expenses",
                error
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadExpenses();
    }, [
        page,
        search,
        category,
        startDate,
        endDate,
        sortBy,
    ]);

    useEffect(() => {
        setPage(1);
    }, [
        search,
        category,
        startDate,
        endDate,
        sortBy,
    ]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput);
    }, 500);

        return () => clearTimeout(timer);
    }, [searchInput]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
        <div className="space-y-6">
        {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-4">
                <div className="text-left">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Transactions
                    </h2>
                    <p className="text-gray-500 mt-1">
                        Search, filter and manage your expenses
                    </p>
                </div>
                <button
                onClick={() =>
                    setIsAddModalOpen(true)
                }
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm text-center justify-center"
                >
                <Plus size={18} />
                    Add expense
                </button>
            </div>
        </div>
        <div className="space-y-4">

        {/* Filters row */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
                <div>
                    <h3 className="text-left text-lg font-semibold text-gray-900">
                        Filter Expenses
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Search and narrow down your transactions
                    </p>
                </div>
                <button
                    onClick={handleClearFilters}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 self-start lg:self-center"
                >
                    Clear filters
                </button>
            </div>
            <div className="border-t border-gray-200 pt-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                    {/* Search */}
                        <div className="flex-1 min-w-[180px]">
                            <input
                                type="text"
                                placeholder="Search expenses..."
                                value={searchInput}
                                onChange={(e) =>
                                setSearchInput(e.target.value)
                                }
                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                        {/* Category */}
                        <div className="w-44">
                            <select
                                value={category}
                                onChange={(e) =>
                                    setCategory(e.target.value)
                                }
                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            >
                                <option value="">
                                    All categories
                                </option>

                                {EXPENSE_CATEGORIES.map((cat) => (
                                <option
                                    key={cat}
                                    value={cat}
                                >
                                    {cat}
                                </option>
                                ))}
                            </select>
                        </div>
                
                        {/* Sort */}
                        <div className="w-44">
                            <select
                                value={sortBy}
                                onChange={(e) =>
                                setSortBy(e.target.value)
                                }
                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            >
                                <option value="date_desc">
                                    Newest first
                                </option>

                                <option value="date_asc">
                                    Oldest first
                                </option>

                                <option value="amount_desc">
                                    Highest amount
                                </option>

                                <option value="amount_asc">
                                    Lowest amount
                                </option>
                            </select>
                        </div>

                        {/* Start date */}
                        <div className="w-40">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) =>
                                setStartDate(e.target.value)
                                }
                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                    
                        {/* End date */}
                        <div className="w-40">
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) =>
                                setEndDate(e.target.value)
                                }
                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="mt-4 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                    {loading ? (
                        <TableSkeleton />
                    ) : (
                        <ExpenseTable
                            expenses={expenses}
                            onEdit={(expense) =>
                                setEditingExpense(expense)
                            }
                            onDelete={(expense) =>
                                setExpenseToDelete(expense)
                            }
                        />
                    )}
                </table>
            </div>
        </div>
        <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={totalExpenses}
            limit={limit}
            onPageChange={setPage}
        />
        </div>
        <ExpenseFormModal
            isOpen={
                isAddModalOpen ||
                editingExpense !== null
            }
            expense={editingExpense}
            onClose={() => {
                setIsAddModalOpen(false);
                setEditingExpense(null);
            }}
            onSuccess={() => {
                loadExpenses();
                showToast(
                    editingExpense
                    ? "Expense updated successfully"
                    : "Expense added successfully",
                    "success"
                );
                setIsAddModalOpen(false);
                setEditingExpense(null);
            }}
        />
        <ConfirmationModal
            isOpen={expenseToDelete !== null}
            title="Delete expense?"
            message={`Are you sure you want to delete "${expenseToDelete?.title}"? This action cannot be undone.`}
            confirmText="Delete"
            loading={deleting}
            onClose={() =>
                setExpenseToDelete(null)
            }
            onConfirm={handleDelete}
        />
        {toast.visible && (
            <div className="fixed top-6 right-6 z-50">
                <Toast
                    message={toast.message}
                    type={toast.type}
                />
            </div>
        )}
    </div>
    );
}


export default ExpensesPage;