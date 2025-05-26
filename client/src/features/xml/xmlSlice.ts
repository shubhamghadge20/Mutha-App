import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface XmlItem {
  itemName: string;
  resultValue: number;
  lowertolerance: number;
  uppertolerance: number;
  inTolerance: boolean;
}

interface XmlData {
  latestFile: string | null;
  selectedProduct: string;
  sampleName: string;
  comparisonResults: XmlItem[];
  date: string;
}

interface XmlState {
  data: XmlData | null;
  loading: boolean;
  error: string | null;
}

const initialState: XmlState = {
  data: null,
  loading: false,
  error: null,
};

const xmlSlice = createSlice({
  name: "xml",
  initialState,
  reducers: {
    setXmlData(state, action: PayloadAction<XmlData>) {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setXmlData, setLoading, setError } = xmlSlice.actions;
export default xmlSlice.reducer;
