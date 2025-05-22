import { UpdateUserInterface } from "@/types";
import { useState } from "react";

interface UpdateModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  formData?: UpdateUserInterface;
  setFormData: React.Dispatch<
    React.SetStateAction<UpdateUserInterface | undefined>
  >;
}

const UpdateUserModal: React.FC<UpdateModalProps> = ({
  open,
  onClose,
  onConfirm,
  formData,
  setFormData,
}) => {
  if (!open || !formData) return null;

  const [errors, setErrors] = useState<Partial<UpdateUserInterface>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) =>
      prev
        ? { ...prev, [name]: value }
        : ({ [name]: value } as UpdateUserInterface)
    );
  };

  const validate = () => {
    const newErrors: Partial<UpdateUserInterface> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.mobile) newErrors.mobile = "Mobile number is required";
    if (!formData.role) newErrors.role = "Role is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="px-6 py-4 border-b bg-blue-300 rounded-t-lg">
          <h2 className="text-2xl font-bold text-stone-800 font-serif">
            Update User
          </h2>
        </div>

        <form
          className="space-y-6 px-6 py-8"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-stone-700 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border rounded-xl border-stone-300 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-stone-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border rounded-xl border-stone-300 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Mobile Field */}
          <div>
            <label
              htmlFor="mobile"
              className="block text-sm font-semibold text-stone-700 mb-1"
            >
              Mobile Number
            </label>
            <input
              type="text"
              name="mobile"
              id="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border rounded-xl border-stone-300 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="1234567890"
            />
            {errors.mobile && (
              <p className="text-sm text-red-600">{errors.mobile}</p>
            )}
          </div>

          {/* Role Field */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-semibold text-stone-700 mb-1"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border rounded-xl border-stone-300 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="operator">Operator</option>
            </select>
            {errors.role && (
              <p className="text-sm text-red-600">{errors.role}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white font-medium"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserModal;
