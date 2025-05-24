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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="px-6 py-4 border-b border-blue-500 bg-blue-600 rounded-t-lg">
          <h2 className="text-xl font-bold text-white font-serif">
            Create User
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-10 py-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-blue-900 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-xl bg-blue-50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? "border-red-500" : "border-blue-300"
              }`}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-blue-900 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-xl bg-blue-50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? "border-red-500" : "border-blue-300"
              }`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="mobile"
              className="block text-sm font-semibold text-blue-900 mb-1"
            >
              Mobile Number
            </label>
            <input
              type="text"
              name="mobile"
              id="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-xl bg-blue-50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.mobile ? "border-red-500" : "border-blue-300"
              }`}
              placeholder="1234567890"
            />
            {errors.mobile && (
              <p className="text-sm text-red-600 mt-1">{errors.mobile}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-semibold text-blue-900 mb-1"
            >
              Role
            </label>
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-xl bg-blue-50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.role ? "border-red-500" : "border-blue-300"
              }`}
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="operator">Operator</option>
            </select>
            {errors.role && (
              <p className="text-sm text-red-600 mt-1">{errors.role}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-blue-900 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-xl bg-blue-50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? "border-red-500" : "border-blue-300"
              }`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password}</p>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold transition"
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
