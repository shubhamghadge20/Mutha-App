import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { XmlComparisonHistoryItem } from "@/types/xmlComparison";
import { fetchXmlHistory, deleteXmlHistoryById } from "./xmlhistoryAPI";

interface PaginatedXmlHistoryResponse {
  data: XmlComparisonHistoryItem[];
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}

interface XmlHistoryState {
  data: XmlComparisonHistoryItem[];
  loading: boolean;
  error: string | null;
  selected: XmlComparisonHistoryItem | null;
  page: number;
  totalPages: number;
  limit: number;
  total: number;
  startDate: string;
  endDate: string;
}

const initialState: XmlHistoryState = {
  data: [],
  loading: false,
  error: null,
  selected: null,
  page: 1,
  totalPages: 1,
  limit: 10,
  total: 0,
  startDate: dayjs().subtract(1, "day").format("YYYY-MM-DDTHH:mm"),
  endDate: dayjs().format("YYYY-MM-DDTHH:mm"),
};

// Thunk to fetch history
export const fetchXmlHistoryThunk = createAsyncThunk<
  PaginatedXmlHistoryResponse,
  {
    product?: string;
    page?: number;
    limit?: number;
    startTime?: number;
    endTime?: number;
  },
  { rejectValue: string }
>(
  "xmlHistory/fetch",
  async ({ product, page, limit, startTime, endTime }, { rejectWithValue }) => {
    try {
      return await fetchXmlHistory(product, page, limit, startTime, endTime);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch history");
    }
  }
);

// Thunk to delete history
export const deleteXmlHistoryThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("xmlHistory/delete", async (id, { rejectWithValue }) => {
  try {
    await deleteXmlHistoryById(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.message || "Delete failed");
  }
});

const xmlHistorySlice = createSlice({
  name: "xmlHistory",
  initialState,
  reducers: {
    selectComparison: (
      state,
      action: PayloadAction<XmlComparisonHistoryItem | null>
    ) => {
      state.selected = action.payload;
    },
    clearSelected: (state) => {
      state.selected = null;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    setStartDate: (state, action: PayloadAction<string>) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action: PayloadAction<string>) => {
      state.endDate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchXmlHistoryThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchXmlHistoryThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
      })
      .addCase(fetchXmlHistoryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch history";
      })
      .addCase(deleteXmlHistoryThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteXmlHistoryThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter((item) => item._id !== action.payload);
        if (state.selected?._id === action.payload) {
          state.selected = null;
        }
      })
      .addCase(deleteXmlHistoryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to delete record";
      });
  },
});

export const {
  selectComparison,
  clearSelected,
  setPage,
  setLimit,
  setStartDate,
  setEndDate,
} = xmlHistorySlice.actions;

export default xmlHistorySlice.reducer;
