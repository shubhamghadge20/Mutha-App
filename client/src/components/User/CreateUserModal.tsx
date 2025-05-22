import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import type { CreateUserInterface } from "@types";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { createUserThunk } from "@/features/user";

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
}

const initialData: CreateUserInterface = {
  name: "",
  email: "",
  role: "",
  mobile: "",
  password: "",
};

const CreateUserModal: React.FC<CreateUserModalProps> = ({ open, onClose }) => {
  if (!open) return null;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<CreateUserInterface>(initialData);
  const [errors, setErrors] = useState<Partial<CreateUserInterface>>({});

  const validateForm = () => {
    const newErrors: Partial<CreateUserInterface> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.role.trim()) newErrors.role = "Role is required";
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      dispatch(createUserThunk(formData));

      onClose();
      navigate("/users");
    } catch (error: any) {
      toast.error(error?.message || "Registration failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl max-h-screen overflow-y-auto">
        {/* Modal Header */}
        <div className="px-4 py-4 border-b bg-blue-300 rounded-t-lg">
          <h2 className="text-xl font-bold text-stone-800 font-serif">
            Create User
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 px-12 py-4">
          {/* Full Name */}
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
              className="w-full px-4 py-2 border rounded-xl border-stone-300 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email */}
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
              className="w-full px-4 py-2 border rounded-xl border-stone-300 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Mobile */}
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
              className="w-full px-4 py-2 border rounded-xl border-stone-300 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="1234567890"
            />
            {errors.mobile && (
              <p className="text-sm text-red-600">{errors.mobile}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-semibold text-stone-700 mb-1"
            >
              Role
            </label>
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl border-stone-300 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="operator">Operator</option>
            </select>
            {errors.role && (
              <p className="text-sm text-red-600">{errors.role}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-stone-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl border-stone-300 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-700 hover:bg-green-800 text-white font-medium"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
