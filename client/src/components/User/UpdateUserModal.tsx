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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-blue-600 bg-blue-700 rounded-t-lg">
          <h2 className="text-2xl font-semibold text-white font-serif">
            Update User
          </h2>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-6 px-8 py-8"
          noValidate
        >
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-semibold text-blue-900"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.name ? "border-red-500" : "border-blue-300"
              } bg-blue-50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition`}
              autoComplete="name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 font-medium">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-semibold text-blue-900"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.email ? "border-red-500" : "border-blue-300"
              } bg-blue-50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition`}
              autoComplete="email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 font-medium">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="mobile"
              className="block mb-2 text-sm font-semibold text-blue-900"
            >
              Mobile Number
            </label>
            <input
              type="text"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="1234567890"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.mobile ? "border-red-500" : "border-blue-300"
              } bg-blue-50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition`}
              autoComplete="tel"
            />
            {errors.mobile && (
              <p className="mt-1 text-sm text-red-600 font-medium">
                {errors.mobile}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="role"
              className="block mb-2 text-sm font-semibold text-blue-900"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.role ? "border-red-500" : "border-blue-300"
              } bg-blue-50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition`}
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="admin">Admin</option>
              <option value="operator">Operator</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600 font-medium">
                {errors.role}
              </p>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-blue-100 text-blue-800 font-semibold hover:bg-blue-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-700 text-white font-semibold hover:bg-blue-800 transition"
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
