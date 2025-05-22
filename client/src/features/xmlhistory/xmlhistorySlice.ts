import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { XmlComparisonHistoryItem } from "@/types/xmlComparison";
import { fetchXmlHistory } from "./xmlhistoryAPI";

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

export const fetchXmlHistoryThunk = createAsyncThunk(
  "xmlHistory/fetch",
  async (product?: string) => await fetchXmlHistory(product)
);

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
        state.error = action.error.message || "Failed to fetch history";
      });
  },
});

export const { selectComparison, clearSelected } = xmlHistorySlice.actions;
export default xmlHistorySlice.reducer;
