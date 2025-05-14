import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
} from "./userAPI";
import { CreateUserInterface, UpdateUserInterface, User } from "@types";
import { toast } from "react-toastify";

interface UpdateUserParams {
  id: string;
  formData: UpdateUserInterface;
}

export interface UserState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
};

export const createUserThunk = createAsyncThunk(
  "users/createUser",
  async (formData: CreateUserInterface, { rejectWithValue }) => {
    try {
      const data = await createUser(formData);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Create user failed"
      );
    }
  }
);

export const getUserThunk = createAsyncThunk(
  "users/getUser",
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await getUser(id);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Fetch user failed"
      );
    }
  }
);

export const getUsersThunk = createAsyncThunk(
  "users/getUsers",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUsers();
      return data.results;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Fetch users failed"
      );
    }
  }
);

export const updateUserThunk = createAsyncThunk(
  "users/updateUser",
  async ({ id, formData }: UpdateUserParams, { rejectWithValue }) => {
    try {
      const data = await updateUser(id, formData);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Update user failed"
      );
    }
  }
);

export const deleteUserThunk = createAsyncThunk(
  "users/deleteUser",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteUser(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Delete user failed"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
        toast.success("User created successfully");
      })
      .addCase(createUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Create user operation failed");
      })

      .addCase(getUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(getUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.users = state.users.map((u) =>
          u.id === updated.id ? updated : u
        );
        toast.success("User updated successfully");
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Update operation failed");
      })

      .addCase(deleteUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload;
        state.users = state.users.filter((u) => u.id !== deletedId);
        toast.success("User deleted successfully");
      })
      .addCase(deleteUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Delete operation failed");
      });
  },
});

export const { clearSelectedUser } = userSlice.actions;
export default userSlice.reducer;
