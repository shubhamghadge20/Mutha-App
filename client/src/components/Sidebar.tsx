import { FaAngleDoubleLeft } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 1, item: "Dashboard", path: "/" },
    { id: 2, item: "Users", path: "/users" },
    { id: 3, item: "Products", path: "/product" },
    { id: 4, item: "Data History", path: "/history" },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold text-stone-800">Menu</h2>
        <button
          onClick={onClose}
          className="text-blue-700 font-bold text-lg cursor-pointer"
        >
          <FaAngleDoubleLeft />
        </button>
      </div>
      <ul className="p-4 space-y-2">
        {navItems.map((entry) => (
          <li
            key={entry.id}
            onClick={() => {
              navigate(entry.path);
              onClose();
            }}
            className={`py-2 px-4 rounded-lg cursor-pointer transition-colors ${
              location.pathname === entry.path
                ? "bg-blue-200 text-black font-semibold"
                : "hover:bg-blue-100"
            }`}
          >
            {entry.item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
