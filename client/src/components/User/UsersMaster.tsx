import { useState } from "react";
import { FaEdit, FaTrashAlt, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { UpdateUserInterface, User } from "@/types";
import { deleteUserThunk, updateUserThunk } from "@/features/user";
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

  const handleCancelCreateUser = () => {
    setShowCreateUserModal(false);
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
        console.log(error);
        toast.error(error || "Update operation failed");
      }
    }
    setShowUpdateUserModal(false);
    setSelectedId(null);
  };

  const handleCancelUpdateUser = () => {
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
        console.log(error);
        toast.error(error || "Delete operation failed");
      }
    }
    setShowAlert(false);
    setSelectedId(null);
  };

  const handleCancelDelete = () => {
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

      <div className="w-full max-w-8xl mx-auto bg-white shadow-xl border border-gray-200 overflow-hidden m-8">
        <div className="flex justify-between px-8 py-6 border-b bg-green-100">
          <h2 className="text-3xl font-bold text-stone-800 font-serif">
            User Management
          </h2>
          <button
            type="button"
            onClick={() => setShowCreateUserModal(true)}
            className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            <FaUser className="w-3.5 h-3.5 me-2" />
            Create User
          </button>
        </div>

        {loading && <p className="p-6 text-stone-600">Loading users...</p>}
        {error && (
          <p className="p-6 text-red-600 font-medium">Error: {error}</p>
        )}

        {users?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="px-6 py-3 border-b text-left text-xl font-medium text-stone-700 bg-gray-50"
                    >
                      {col.label}
                    </th>
                  ))}
                  <th className="px-6 py-3 border-b text-left text-xl font-medium text-stone-700 bg-gray-50">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-stone-50 transition-colors"
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-4 border-b text-sm">
                        {row[col.key]}
                      </td>
                    ))}
                    <td className="px-6 py-4 border-b text-sm">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => onUpdate(row.id)}
                          className="text-blue-600 hover:text-blue-800 transition-colors mx-2"
                          title="Edit"
                        >
                          <FaEdit className="text-lg cursor-pointer" />
                        </button>
                        <button
                          onClick={() => onDelete(row.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete"
                        >
                          <FaTrashAlt className="text-lg cursor-pointer" />
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
            <p className="px-8 py-6 text-stone-500 text-sm">
              No users found. Please add new users.
            </p>
          )
        )}
      </div>
    </>
  );
};

export default UsersMaster;
