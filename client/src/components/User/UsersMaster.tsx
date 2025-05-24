import { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { UpdateUserInterface, User } from "@/types";
import {
  deleteUserThunk,
  updateUserThunk,
  getUsersThunk,
} from "@/features/user";
import AlertModal from "../@/ui/AlertModal";
import UpdateUserModal from "./UpdateUserModal";
import CreateUserModal from "./CreateUserModal";

interface Column {
  key: keyof User;
  label: string;
}

const columns: Column[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "mobile", label: "Mobile" },
  { key: "role", label: "Role" },
];

const UsersMaster = () => {
  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector((state) => state.user);

  const [showAlert, setShowAlert] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showUpdateUserModal, setShowUpdateUserModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpdateUserInterface>();

  useEffect(() => {
    dispatch(getUsersThunk());
  }, [dispatch]);

  const handleCancelCreateUser = () => setShowCreateUserModal(false);
  const handleCancelUpdateUser = () => {
    setShowUpdateUserModal(false);
    setSelectedId(null);
  };
  const handleCancelDelete = () => {
    setShowAlert(false);
    setSelectedId(null);
  };

  const onUpdate = (id: string) => {
    const userData = users.find((user) => user.id === id);
    setSelectedId(id);
    setFormData(userData);
    setShowUpdateUserModal(true);
  };

  const handleConfirmUpdateUser = () => {
    if (selectedId && formData) {
      try {
        const { isEmailVerified, id, ...cleanedUser } = formData;
        dispatch(updateUserThunk({ id: selectedId, formData: cleanedUser }));
      } catch (error: any) {
        console.error(error);
        toast.error(error || "Update operation failed");
      }
    }
    setShowUpdateUserModal(false);
    setSelectedId(null);
  };

  const onDelete = (id: string) => {
    setSelectedId(id);
    setShowAlert(true);
  };

  const handleConfirmDelete = () => {
    if (selectedId) {
      try {
        dispatch(deleteUserThunk(selectedId));
      } catch (error: any) {
        console.error(error);
        toast.error(error || "Delete operation failed");
      }
    }
    setShowAlert(false);
    setSelectedId(null);
  };

  return (
    <>
      <AlertModal
        open={showAlert}
        message="Are you sure you want to delete this user?"
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
      <CreateUserModal
        open={showCreateUserModal}
        onClose={handleCancelCreateUser}
      />
      <UpdateUserModal
        open={showUpdateUserModal}
        onClose={handleCancelUpdateUser}
        onConfirm={handleConfirmUpdateUser}
        formData={formData}
        setFormData={setFormData}
      />

      <div className="max-w-7xl mx-auto my-10 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="flex justify-between items-center px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-400 shadow-md rounded-t-xl">
          <h2 className="text-3xl font-bold text-white font-serif tracking-wide">
            User Management
          </h2>
          <button
            type="button"
            onClick={() => setShowCreateUserModal(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 text-white font-semibold rounded-lg px-5 py-2 transition"
          >
            <FaUser className="w-4 h-4" />
            Create User
          </button>
        </div>

        {loading && (
          <p className="p-6 text-stone-500 italic text-center">
            Loading users...
          </p>
        )}
        {error && (
          <p className="p-6 text-red-600 font-medium text-center">
            Error: {error}
          </p>
        )}

        {users?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse table-auto">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="px-6 py-4 text-left text-md font-semibold text-gray-700 tracking-wide select-none"
                    >
                      {col.label}
                    </th>
                  ))}
                  <th className="px-6 py-4 text-left text-md font-semibold text-gray-700 tracking-wide select-none">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((row) => (
                  <tr
                    key={row.id}
                    className="even:bg-gray-50 hover:bg-blue-50 transition-colors"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="px-6 py-4 text-gray-800 text-sm whitespace-nowrap"
                      >
                        {row[col.key]}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onUpdate(row.id)}
                          className="text-blue-600 hover:text-blue-800 transition"
                          title="Edit"
                          aria-label={`Edit user ${row.name}`}
                        >
                          <FaEdit className="w-5 h-5 cursor-pointer" />
                        </button>
                        <button
                          onClick={() => onDelete(row.id)}
                          className="text-red-600 hover:text-red-800 transition"
                          title="Delete"
                          aria-label={`Delete user ${row.name}`}
                        >
                          <FaTrashAlt className="w-5 h-5 cursor-pointer" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !loading && (
            <p className="px-8 py-10 text-center text-stone-500 text-sm italic">
              No users found. Please add new users.
            </p>
          )
        )}
      </div>
    </>
  );
};

export default UsersMaster;
