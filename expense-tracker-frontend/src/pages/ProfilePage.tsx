import { useEffect, useState } from "react";
import type { UserProfile } from "../types/user";
import EditProfileModal from "../components/EditProfileModal";
import { getProfile, updateProfile } from "../services/userService";
import Toast from "../components/Toast";
import UpdateBudgetModal from "../components/UpdateBudgetModal";
import {
  getBudget,
  updateBudget,
} from "../services/budgetService";
import type { BudgetResponse } from "../types/budget";
import { formatCurrency } from "../utils/formatCurrency"
import { useAuth } from "../context/AuthContext";

function ProfilePage() {
  const [profile, setProfile] =
  useState<UserProfile | null>(null);

  const [loading, setLoading] =
  useState(false);

  const [isEditOpen, setIsEditOpen] =
    useState(false);

  const { refreshUser } =
    useAuth();

  const [toast, setToast] = useState({
  message: "",
  type: "success" as
    | "success"
    | "error",
  visible: false,
});

const [budget, setBudget] =
  useState<BudgetResponse | null>(null);

const [isBudgetOpen, setIsBudgetOpen] =
  useState(false);

  
  useEffect(() => {
    loadProfile();
  }, []);


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

  async function loadProfile() {
    try {
    setLoading(true);

    const [profileData, budgetData] =
      await Promise.all([
        getProfile(),
        getBudget(),
      ]);

  setProfile(profileData);
    setBudget(budgetData);
} catch (error) {
  console.error(
    "Failed to load profile",
    error
  );
} finally {
  setLoading(false);
}

}
async function handleUpdateProfile(
  name: string
) {
  try {
    const updated =
      await updateProfile(name);

    setProfile(updated);

    await refreshUser();

    showToast(
      "Profile updated successfully",
      "success"
    );
  } catch (error) {
    showToast(
      "Failed to update profile",
      "error"
    );

    throw error;
  }
}

async function handleUpdateBudget(
  value: number
) {
  try {
    const updated =
      await updateBudget(value);

    setBudget(updated);

    showToast(
      "Budget updated successfully"
    );
  } catch (error) {
    showToast(
      "Failed to update budget",
      "error"
    );

    throw error;
  }
}

if (loading) {
  return (  
    <div className="flex items-center justify-center min-h-[40vh]"> 
      <p className="text-gray-500">
        Loading profile... 
      </p> 
  </div> 
  );
}


return (
  <div className="space-y-6">
    {/* Profile hero */}
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-2xl sm:text-3xl font-bold shadow-sm flex-shrink-0">
            {profile?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <div className="text-left min-w-0">
            <h1 className="text-3xl sm:text-xl font-bold text-gray-900 tracking-tight truncate">
              {profile?.name || "User"}
            </h1>
          </div>
        </div>

    <div className="flex flex-col items-center sm:items-end gap-3 w-full sm:w-auto">
        <button
          onClick={() => setIsEditOpen(true)}
          className="w-full sm:w-auto px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Edit profile
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium">
          <div className="w-2 h-2 rounded-full bg-green-600" />
          Account active
        </div>
      </div>
      </div>
    </div>

      {/* Content cards */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.0fr_1.0fr] gap-6">
        {/* Budget card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900">
                Monthly Budget
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Your monthly spending limit
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
              ₹
            </div>
          </div>

          <p className="text-3xl sm:text-4xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-5 p-2">
            {formatCurrency(budget?.monthly_budget ?? 0)}
          </p>

          <div className="bg-gray-50 rounded-xl p-4 mb-5">
            <p className="text-sm text-gray-500">
              Budget status
            </p>

            <p className="text-sm font-medium text-gray-900 mt-1">
              Configured and active
            </p>
          </div>

          <button
            onClick={() => setIsBudgetOpen(true)}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            Update budget
          </button>
        </div>

        {/* Account information */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-5 text-left">
            Account information
          </h3>

          <div className="space-y-5">
            <div className="flex justify-between items-center text-left">
              <span className="text-gray-500">
                Full name
              </span>

              <span className="font-medium text-gray-900 text-left">
                {profile?.name || "-"}
              </span>
            </div>

          <div className="border-t border-gray-200" />

          <div className="flex justify-between text-left items-center">
              <span className="text-gray-500">
                Email address
              </span>

              <span className="font-medium text-gray-900 text-right">
                {profile?.email || "-"}
              </span>
          </div>

          <div className="border-t border-gray-200" />

          <div className="flex justify-between items-center text-left">
              <span className="text-gray-500">
                Account status
              </span>

              <span className="font-medium text-green-600 text-right">
                Active
              </span>
          </div>
        </div>
      </div>
    </div>

<EditProfileModal
  isOpen={isEditOpen}
  currentName={profile?.name || ""}
  onClose={() => setIsEditOpen(false)}
  onSave={handleUpdateProfile}
/>

<UpdateBudgetModal
  isOpen={isBudgetOpen}
  currentBudget={budget?.monthly_budget ?? 0}
  onClose={() => setIsBudgetOpen(false)}
  onSave={handleUpdateBudget}
/>

{toast.visible && (
  <div className="fixed top-4 right-4 left-4 sm:left-auto sm:right-6 z-50">
    <Toast
      message={toast.message}
      type={toast.type}
    />
  </div>
)}


  </div>
);
}

export default ProfilePage;
