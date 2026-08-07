import { useEffect, useState } from "react";

type UpdateBudgetModalProps = {
  isOpen: boolean;
  currentBudget: number;
  onClose: () => void;
  onSave: (budget: number) => Promise<void>;
};

function UpdateBudgetModal({
  isOpen,
  currentBudget,
  onClose,
  onSave,
}: UpdateBudgetModalProps) {
  const [budget, setBudget] =
    useState(currentBudget.toString());

  const [error, setError] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    setBudget(
      currentBudget.toString()
    );
    setError("");
  }, [currentBudget, isOpen]);

  if (!isOpen) return null;

  async function handleSave() {
    const value = Number(budget);

    if (!budget.trim()) {
      setError(
        "Budget is required"
      );
      return;
    }

    if (
      Number.isNaN(value) ||
      value < 0
    ) {
      setError(
        "Budget must be a valid amount"
      );
      return;
    }
    setError("");
    try {
      setSaving(true);
      await onSave(value);
      onClose();
    } finally {
        setSaving(false);
    }
  }

  return ( 
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
        onClick={(e) =>
          e.stopPropagation()
        }
      > 
        <div className="flex justify-between items-center mb-6"> 
          <h2 className="text-xl font-semibold">
            Update budget 
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly budget
            </label>

            <input
              type="number"
              value={budget}
              onChange={(e) =>
                setBudget(
                  e.target.value
                )
              }
              placeholder="30000"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {error && (
              <p className="text-red-500 text-sm mt-1">
                {error}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save budget"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default UpdateBudgetModal;