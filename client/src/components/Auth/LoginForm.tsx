import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import type { LoginFormInterface } from "@types";
import { useAuth } from "@/hooks/auth/useAuth";
import { useAppSelector } from "@/hooks/reduxHooks";
import { RootState } from "@/store";

const initialData: LoginFormInterface = {
  email: "",
  password: "",
};

const LoginForm = () => {
  const navigate = useNavigate();
  const { handleLogin } = useAuth();

  const { loading, error, isAuthenticated } = useAppSelector(
    (state: RootState) => state.auth
  );

  const [formData, setFormData] = useState<LoginFormInterface>(initialData);
  const [errors, setErrors] = useState<Partial<LoginFormInterface>>({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors: Partial<LoginFormInterface> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      await handleLogin(formData);
      toast.success("Login successfully");
      navigate("/");
    } catch (error: any) {
      console.log(error);
      toast.error(error || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-xl p-10 sm:p-12 md:p-14 bg-white rounded-3xl shadow-2xl border border-stone-300">
        <h2 className="mb-5 text-3xl font-bold text-center text-stone-800 font-serif tracking-wide">
          Sign In
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-4 mb-8">
            <label
              htmlFor="email"
              className="w-32 text-sm font-semibold text-stone-700 text-left"
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
              className="flex-1 px-4 py-2.5 border rounded-xl border-stone-300 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              placeholder="you@example.com"
            />
          </div>
          {errors.email && (
            <p className="ml-36 text-sm text-red-600">{errors.email}</p>
          )}

          <div className="flex items-center gap-4 mb-8">
            <label
              htmlFor="password"
              className="w-32 text-sm font-semibold text-stone-700 text-left"
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
              className="flex-1 px-4 py-2.5 border rounded-xl border-stone-300 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              placeholder="••••••••"
            />
          </div>
          {errors.password && (
            <p className="ml-36 text-sm text-red-600">{errors.password}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 font-semibold text-white bg-green-600 rounded-2xl hover:bg-green-700 transition duration-300 shadow-md"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          {error && (
            <div className="text-red-600 mt-2 text-center">{error}</div>
          )}
        </form>

        <p className="mt-6 text-sm text-center text-stone-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-green-600 hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
