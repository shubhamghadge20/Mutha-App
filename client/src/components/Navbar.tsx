import { useState } from "react";
import { FaBars, FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { RootState } from "@/store";
import { useAppSelector } from "@/hooks/reduxHooks";
import { useAuth } from "@/hooks/auth/useAuth";
import Sidebar from "@components/Sidebar";
import machineWiseLogo from "@/assets/logo1.png";

const Navbar = () => {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  const { user, isAuthenticated } = useAppSelector(
    (state: RootState) => state.auth
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      <nav className="bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-6 cursor-pointer">
            <button
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              className="text-white hover:text-yellow-300 rounded"
            >
              <FaBars className="text-3xl" />
            </button>

            <img
              src={machineWiseLogo}
              alt="MachineWise Logo"
              className="h-10 w-auto select-none"
            />
          </div>

          <div className="flex items-center gap-8">
            {isAuthenticated ? (
              <>
                <button
                  className="text-white hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
                  aria-label="Notifications"
                >
                  <FaBell className="text-2xl" />
                </button>

                <div className="flex items-center gap-2 text-white select-none">
                  <FaUserCircle className="text-3xl" />
                  <span className="font-semibold text-lg truncate max-w-xs">
                    {user?.name || "User"}
                  </span>
                </div>

                <button
                  className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-6 py-2 rounded-md text-sm font-semibold flex items-center gap-2 transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                  onClick={handleLogout}
                  aria-label="Logout"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </>
            ) : (
              <button
                className="bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-stone-800 px-6 py-2 rounded-md text-sm font-semibold flex items-center gap-2 transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-300"
                onClick={() => navigate("/login")}
                aria-label="Login"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
    </>
  );
};

export default Navbar;
