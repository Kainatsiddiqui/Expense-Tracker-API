import { useEffect, useState } from "react";

type EditProfileModalProps = {
  isOpen: boolean;
  currentName: string;
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
};

function EditProfileModal({
  isOpen,
  currentName,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const [name, setName] =
    useState(currentName);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    setName(currentName);
    setError("");
  }, [currentName, isOpen]);

  if (!isOpen) return null;

  async function handleSave() {
    if (!name.trim()) {
      setError(
        "Name is required"
      );
      return;
    }
    if (name.trim().length < 2) {
      setError(
        "Name must be at least 2 characters"
      );
      return;
    }
    setError("");
    try {
      setSaving(true);
      await onSave(name.trim());
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
            Edit profile 
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
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
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
              : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default EditProfileModal;