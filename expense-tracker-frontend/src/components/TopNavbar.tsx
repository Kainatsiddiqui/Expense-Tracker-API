import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function TopNavbar() {
  const location = useLocation();
  const { user } = useAuth();

  const pageConfig: Record<
    string,
    {
      title: string;
      subtitle: string;
    }
    >= {
      "/dashboard": {
        title: "Dashboard",
        subtitle: "Track your spending and financial insights",
      },
      "/expenses": {
        title: "Expenses",
        subtitle: "Manage and organize your transactions",
      },
      "/reports": {
        title: "Reports",
        subtitle: "Analyze spending patterns and trends",
      },
      "/profile": {
        title: "Profile",
        subtitle: "Manage your account and budget settings",
      },
    };
  const currentPage =
    pageConfig[location.pathname] ??
    pageConfig["/dashboard"];

  const today = new Date().toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "short",
      day: "numeric",
    }
  );
  
  return (
    <div className="bg-white border border-gray-200 rounded-2l px-6 py-4 shadow-sm sticky top-0 z-10">
      <div className="flex items-center justify-between text-left">
        <div>
          <h1 className="text-2l sm:text-3xlfont-bold text-black-900">
            {currentPage.title}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {currentPage.subtitle}
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              Welcome back
            </p>
            <p className="text-sm text-gray-600 font-semibold">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {today}
            </p>
          </div>

          <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopNavbar;