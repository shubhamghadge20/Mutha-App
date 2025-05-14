import { useAppDispatch, useAppSelector } from "../reduxHooks";
import {
  loginThunk,
  logoutThunk,
  registerThunk,
  setTokens,
} from "@features/auth";
import { refreshAccessToken as refreshTokenAPI } from "@/features/auth/authAPI";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);

  const handleLogin = async (formData: { email: string; password: string }) => {
    try {
      await dispatch(loginThunk(formData)).unwrap();
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const handleRegister = async (formData: {
    name: string;
    email: string;
    password: string;
    mobile: string;
  }) => {
    try {
      await dispatch(registerThunk(formData)).unwrap();
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const handleLogout = () => {
    dispatch(logoutThunk());
  };

  const getAuthHeader = () => {
    const token = authState.tokens?.tokens.access.token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const checkTokenExpiration = () => {
    const expires = authState.tokens?.tokens.access.expires;
    if (!expires) return false;

    const accessTokenExpires = new Date(expires);
    const now = new Date();
    return now < accessTokenExpires;
  };

  const tryRefreshToken = async () => {
    const refreshToken = authState.tokens?.tokens.refresh.token;
    if (!refreshToken) return;

    try {
      const data = await refreshTokenAPI(refreshToken);

      localStorage.setItem("accessToken", data.access.token);
      localStorage.setItem("accessTokenExpires", data.access.expires);

      dispatch(
        setTokens({
          tokens: {
            access: data.access,
            refresh: authState.tokens?.tokens.refresh!,
          },
        })
      );
    } catch (error) {
      console.error("Failed to refresh token", error);
      dispatch(logoutThunk());
    }
  };

  return {
    authState,
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    handleLogin,
    handleRegister,
    handleLogout,
    getAuthHeader,
    checkTokenExpiration,
    tryRefreshToken,
  };
};
