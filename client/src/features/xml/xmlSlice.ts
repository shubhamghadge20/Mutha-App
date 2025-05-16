import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchXmlCompare } from "./xmlAPI";
import { toast } from "react-toastify";

export interface XmlCompareDataItem {
  productName: string;
  itemName: string;
  dbValue: number | null;
  xmlValue: number | null;
  difference: number | null;
  status: string;
}

export interface XmlState {
  data: XmlCompareDataItem[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: XmlState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchXmlCompareThunk = createAsyncThunk<
  XmlCompareDataItem[],
  void,
  { rejectValue: string }
>("xml/fetchXmlCompare", async (_, { rejectWithValue }) => {
  try {
    const response = await fetchXmlCompare();
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch XML data"
    );
  }
});

const xmlSlice = createSlice({
  name: "xml",
  initialState,
  reducers: {
    clearXmlData: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchXmlCompareThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchXmlCompareThunk.fulfilled, (state, action) => {
        state.loading = false;

        if (Array.isArray(action.payload)) {
          state.data = action.payload;
        } else if (
          action.payload &&
          Array.isArray((action.payload as any).data)
        ) {
          state.data = (action.payload as any).data;
        } else {
          state.data = [];
          toast.error("Received unexpected data format from API");
        }
      })
      .addCase(fetchXmlCompareThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch XML comparison data";
        toast.error(state.error);
      });
  },
});

export const { clearXmlData } = xmlSlice.actions;

export default xmlSlice.reducer;
