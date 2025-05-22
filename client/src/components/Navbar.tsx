import { useState } from "react";
import { FaBars, FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { RootState } from "@/store";
import { useAppSelector } from "@/hooks/reduxHooks";
import { useAuth } from "@/hooks/auth/useAuth";
import Sidebar from "@components/Sidebar";

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
      <nav className="bg-blue-400 shadow-md px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 cursor-pointer">
            <button
              onClick={toggleSidebar}
              className="text-white hover:text-blue-100"
            >
              <FaBars className="text-2xl" />
            </button>
            <h1 className="text-xl font-bold text-white">MachineWise</h1>
          </div>

          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <button className="relative text-white hover:text-yellow-300">
                  <FaBell className="text-xl" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-600" />
                </button>

                <div className="flex items-center gap-1 text-white">
                  <FaUserCircle className="text-2xl" />
                  <span className="font-medium">{user?.name}</span>
                </div>

                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 h-10 rounded-md text-sm font-semibold flex items-center gap-1"
                  onClick={() => handleLogout()}
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </>
            ) : (
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 h-10 rounded-md text-sm font-semibold flex items-center gap-1"
                onClick={() => navigate("/login")}
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
