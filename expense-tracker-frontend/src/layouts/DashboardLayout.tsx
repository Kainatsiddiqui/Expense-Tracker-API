import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TopNavbar from "../components/TopNavbar";
import { useState } from "react";
import ConfirmationModal from "../components/ConfirmationModal";
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  User,
  LogOut,
} from "lucide-react";

function DashboardLayout(){
    const navigate = useNavigate();
    const [isLogoutOpen, setIsLogoutOpen] =
        useState(false);

    const [loggingOut, setLoggingOut] =
        useState(false);

    const {
        logout,
        user,
    } = useAuth();

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 border-l-4 ${
        isActive
        ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold"
        : "border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

    const mobileNavClass = ({
    isActive,
    }: {
    isActive: boolean;
    }) =>
    `flex-1 text-center px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
        isActive
        ? "bg-blue-600 text-white"
        : "text-gray-600 hover:bg-gray-100"
    }`;
    
    async function handleLogout() {
        try {
            setLoggingOut(true);

            logout();

            navigate("/login");
        } finally {
            setLoggingOut(false);
            setIsLogoutOpen(false);
        }
    }

    return (
        <div className="min-h-screen flex bg-gray-100">
            <div className="flex">
            {/* Sidebar */}

            <aside className="hidden lg:flex w-72 p-5 h-screen sticky top-0 bg-white border-r border-gray-200 flex-col justify-between p-6">
            <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                ₹
                </div>

                <div>
                <h2 className="text-xl font-bold text-gray-900">
                    Expense Tracker
                </h2>
                <p className="text-xs text-gray-500 text-left">
                    Personal finance
                </p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
                <NavLink to="/dashboard" className={navLinkClass}>
                <LayoutDashboard size={18}/>
                Dashboard
                </NavLink>

                <NavLink to="/expenses" className={navLinkClass}>
                <Receipt size={18} />
                Expenses
                </NavLink>

                <NavLink to="/reports" className={navLinkClass}>
                <BarChart3 size={18} />
                Reports
                </NavLink>

                <NavLink to="/profile" className={navLinkClass}>
                <User size={18} />
                Profile
                </NavLink>
            </nav>
            </div>
            
            {/* User profile */}
            <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>

                <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                    {user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                    {user?.email || ""}
                    </p>
                </div>
                </div>

                <button
                onClick={() => setIsLogoutOpen(true)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                <LogOut size={18} />
                Logout
                </button>
            </div>
                        
            </aside>

            {/* Main content */}
            <main className="flex-1 min-w-0 h-screen overflow-y-auto  bg-gray-100">
                <TopNavbar />
                    {/* Mobile navigation */} 
                    <div className="lg:hidden px-4 pt-4"> 
                        <div className="bg-white rounded-2xl border border-gray-200 p-2 flex justify-around"> 
                            <NavLink to="/dashboard" className={mobileNavClass} > Dashboard </NavLink> 
                            <NavLink to="/expenses" className={mobileNavClass} > Expenses </NavLink> 
                            <NavLink to="/reports" className={mobileNavClass} > Reports </NavLink> 
                            <NavLink to="/profile" className={mobileNavClass} > Profile </NavLink>
                        </div> 
                    </div>
                    {/*<!-- Mobile account bar -->*/}
                    <div className="lg:hidden px-4 pt-3">
                    <div className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                            {user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>

                        <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                            {user?.name || "User"}
                            </p>

                            <p className="text-xs text-gray-500 truncate">
                            {user?.email || ""}
                            </p>
                        </div>
                        </div>

                        <button
                        onClick={() =>
                            setIsLogoutOpen(true)
                        }
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                        >
                        <LogOut size={18} />
                        <span className="text-sm font-medium">
                            Logout
                        </span>
                        </button>
                    </div>
                    </div>
                <div className="p-4 sm:p-6 lg:p-8">
                    <div className="w-full max-w-6xl mx-auto">
                    <Outlet />
                    </div>
                </div>
            </main>
            </div>
            <ConfirmationModal
            isOpen={isLogoutOpen}
            title="Log out?"
            message="Are you sure you want to log out of your account?"
            confirmText="Log out"
            loading={loggingOut}
            onClose={() => setIsLogoutOpen(false)}
            onConfirm={handleLogout}
            />
        </div>
    );

}

export default DashboardLayout;