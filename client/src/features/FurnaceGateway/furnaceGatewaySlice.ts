import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createFurnaceGateway,
  getFurnaceGateways,
  getFurnaceGateway,
  updateFurnaceGateway,
  deleteFurnaceGateway,
} from "./furnaceGatewayAPI";
import {
  CreateFurnaceGatewayInterface,
  UpdateFurnaceGatewayInterface,
  FurnaceGateway,
} from "@/types";
import { toast } from "react-toastify";

interface FurnaceGatewayState {
  list: FurnaceGateway[];
  selected: FurnaceGateway | null;
  loading: boolean;
  error: string | null;
}

const initialState: FurnaceGatewayState = {
  list: [],
  selected: null,
  loading: false,
  error: null,
};

export const createFurnaceGatewayThunk = createAsyncThunk(
  "furnaceGateway/create",
  async (data: CreateFurnaceGatewayInterface, { rejectWithValue }) => {
    try {
      return await createFurnaceGateway(data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getFurnaceGatewaysThunk = createAsyncThunk(
  "furnaceGateway/getAll",
  async (_, { rejectWithValue }) => {
    try {
      return await getFurnaceGateways();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getFurnaceGatewayThunk = createAsyncThunk(
  "furnaceGateway/getById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await getFurnaceGateway(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateFurnaceGatewayThunk = createAsyncThunk(
  "furnaceGateway/update",
  async (
    { id, data }: { id: string; data: UpdateFurnaceGatewayInterface },
    { rejectWithValue }
  ) => {
    try {
      return await updateFurnaceGateway(id, data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteFurnaceGatewayThunk = createAsyncThunk(
  "furnaceGateway/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteFurnaceGateway(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const furnaceGatewaySlice = createSlice({
  name: "furnaceGateway",
  initialState,
  reducers: {
    clearSelectedGateway: (state) => {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(getFurnaceGatewaysThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFurnaceGatewaysThunk.fulfilled, (state, action) => {
        state.list = action.payload.results || action.payload;
        state.loading = false;
      })
      .addCase(getFurnaceGatewaysThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(`Failed to fetch gateways: ${action.payload}`);
      })

      .addCase(getFurnaceGatewayThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFurnaceGatewayThunk.fulfilled, (state, action) => {
        state.selected = action.payload;
        state.loading = false;
      })
      .addCase(getFurnaceGatewayThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(`Failed to get gateway: ${action.payload}`);
      })

      .addCase(createFurnaceGatewayThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFurnaceGatewayThunk.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.loading = false;
        toast.success("Furnace Gateway created successfully");
      })
      .addCase(createFurnaceGatewayThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(`Failed to create gateway: ${action.payload}`);
      })

      .addCase(updateFurnaceGatewayThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFurnaceGatewayThunk.fulfilled, (state, action) => {
        const index = state.list.findIndex((gw) => gw.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        state.loading = false;
        toast.success("Furnace Gateway updated successfully");
      })
      .addCase(updateFurnaceGatewayThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(`Failed to update gateway: ${action.payload}`);
      })

      .addCase(deleteFurnaceGatewayThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFurnaceGatewayThunk.fulfilled, (state, action) => {
        state.list = state.list.filter((gw) => gw.id !== action.payload);
        state.loading = false;
        toast.success("Furnace Gateway deleted");
      })
      .addCase(deleteFurnaceGatewayThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(`Failed to delete gateway: ${action.payload}`);
      });
  },
});

export const { clearSelectedGateway } = furnaceGatewaySlice.actions;
export default furnaceGatewaySlice.reducer;
