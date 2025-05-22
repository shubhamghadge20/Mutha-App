import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import type { RegisterFormInterface } from "@types";
import { useAuth } from "@/hooks/auth/useAuth";

const initialData: RegisterFormInterface = {
  name: "",
  email: "",
  mobile: "",
  password: "",
};

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { loading, handleRegister } = useAuth();

  const [formData, setFormData] = useState<RegisterFormInterface>(initialData);
  const [errors, setErrors] = useState<Partial<RegisterFormInterface>>({});

  const validateForm = () => {
    const newErrors: Partial<RegisterFormInterface> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

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
      [name]: value.trim(),
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      await handleRegister(formData);
      toast.success("Registered successfully");
      navigate("/");
    } catch (error: any) {
      console.log(error);
      toast.error(error || "Registration failed");
    }
  };

  return (
    <div
      className="flex items-center justify-center"
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      <div className="w-full max-w-xl p-10 sm:p-12 md:p-14 bg-white rounded-3xl shadow-2xl border border-stone-300">
        <h2 className="mb-5 text-3xl font-bold text-center text-stone-800 tracking-wide">
          Create Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-4 mb-8">
            <label
              htmlFor="name"
              className="w-32 text-sm font-semibold text-stone-700 text-left"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="flex-1 px-4 py-2.5 border rounded-xl border-stone-300 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
          </div>
          {errors.name && (
            <p className="ml-36 text-sm text-red-600">{errors.name}</p>
          )}

          <div className="flex items-center gap-4 mb-8">
            <label
              htmlFor="email"
              className="w-32 text-sm font-semibold text-stone-700 text-left"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="flex-1 px-4 py-2.5 border rounded-xl border-stone-300 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>
          {errors.email && (
            <p className="ml-36 text-sm text-red-600">{errors.email}</p>
          )}

          <div className="flex items-center gap-4 mb-8">
            <label
              htmlFor="mobile"
              className="w-32 text-sm font-semibold text-stone-700 text-left"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              required
              value={formData.mobile}
              onChange={handleChange}
              className="flex-1 px-4 py-2.5 border rounded-xl border-stone-300 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1234567890"
            />
          </div>
          {errors.mobile && (
            <p className="ml-36 text-sm text-red-600">{errors.mobile}</p>
          )}

          <div className="flex items-center gap-4 mb-8">
            <label
              htmlFor="password"
              className="w-32 text-sm font-semibold text-stone-700 text-left"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="flex-1 px-4 py-2.5 border rounded-xl border-stone-300 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>
          {errors.password && (
            <p className="ml-36 text-sm text-red-600">{errors.password}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 font-semibold text-white bg-blue-500 rounded-2xl hover:bg-blue-600 transition duration-300 shadow-md"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-stone-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
