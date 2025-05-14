import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login, logout, register } from "./authAPI";
import {
  LoginFormInterface,
  RegisterFormInterface,
  Token,
  User,
} from "@/types";

export interface AuthState {
  user: User | null;
  tokens: Token | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  tokens: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (formData: RegisterFormInterface, { rejectWithValue }) => {
    try {
      const data = await register(formData);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (formData: LoginFormInterface, { rejectWithValue }) => {
    try {
      const data = await login(formData);

      localStorage.setItem("accessToken", data.tokens.access.token);
      localStorage.setItem("accessTokenExpires", data.tokens.access.expires);
      localStorage.setItem("refreshToken", data.tokens.refresh.token);
      localStorage.setItem("refreshTokenExpires", data.tokens.refresh.expires);
      localStorage.setItem("user", JSON.stringify(data.user));

      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as { auth: AuthState };
    const refreshToken = state.auth.tokens?.tokens.refresh.token;

    if (!refreshToken) {
      return rejectWithValue("No refresh token found");
    }

    try {
      localStorage.clear();
      dispatch(clearTokens());
      await logout({ refreshToken });
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTokens: (state, action) => {
      state.tokens = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearTokens: (state) => {
      state.tokens = null;
      state.user = null;
    },
    setAuthFromStorage: (state) => {
      const access = {
        token: localStorage.getItem("accessToken") || "",
        expires: localStorage.getItem("accessTokenExpires") || "",
      };
      const refresh = {
        token: localStorage.getItem("refreshToken") || "",
        expires: localStorage.getItem("refreshTokenExpires") || "",
      };

      const userString = localStorage.getItem("user");

      if (access.token && refresh.token && userString) {
        state.tokens = { tokens: { access, refresh } };
        state.user = JSON.parse(userString);
        state.isAuthenticated = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isAuthenticated = false;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isAuthenticated = false;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.tokens = { tokens: action.payload.tokens };
        state.isAuthenticated = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    builder
      .addCase(logoutThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.tokens = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setTokens, clearTokens, setAuthFromStorage } = authSlice.actions;
export default authSlice.reducer;
