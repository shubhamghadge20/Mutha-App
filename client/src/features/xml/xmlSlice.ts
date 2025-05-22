import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { XmlComparisonResponse } from "@/types/xmlComparison";
import { fetchXmlComparison } from "./xmlAPI"; // Async function version

interface XmlState {
  data: XmlComparisonResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: XmlState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchXmlComparisonThunk = createAsyncThunk(
  "xml/fetchComparison",
  async (product: string, { rejectWithValue }) => {
    try {
      return await fetchXmlComparison(product);
    } catch (err: any) {
      return rejectWithValue(err.message || "Error fetching XML comparison");
    }
  }
);

const xmlSlice = createSlice({
  name: "xml",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchXmlComparisonThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchXmlComparisonThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchXmlComparisonThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default xmlSlice.reducer;
