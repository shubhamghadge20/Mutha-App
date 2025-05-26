import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { XmlComparisonHistoryItem } from "@/types/xmlComparison";
import { fetchXmlHistory, deleteXmlHistoryById } from "./xmlhistoryAPI";

interface XmlHistoryState {
  data: XmlComparisonHistoryItem[];
  loading: boolean;
  error: string | null;
  selected: XmlComparisonHistoryItem | null;
}

const initialState: XmlHistoryState = {
  data: [],
  loading: false,
  error: null,
  selected: null,
};

export const fetchXmlHistoryThunk = createAsyncThunk<
  XmlComparisonHistoryItem[],
  string | undefined,
  { rejectValue: string }
>("xmlHistory/fetch", async (product, { rejectWithValue }) => {
  try {
    return await fetchXmlHistory(product);
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch history");
  }
});

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
    selectComparison: (state, action) => {
      state.selected = action.payload;
    },
    clearSelected: (state) => {
      state.selected = null;
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
        state.data = action.payload;
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

export const { selectComparison, clearSelected } = xmlHistorySlice.actions;
export default xmlHistorySlice.reducer;
