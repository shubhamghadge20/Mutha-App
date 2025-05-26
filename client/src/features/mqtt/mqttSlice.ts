import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { lockFurnace, unlockFurnace } from "./mqttAPI";

interface MqttState {
  status: "idle" | "loading" | "succeeded" | "failed";
  message: string;
  error: string | null;
}

const initialState: MqttState = {
  status: "idle",
  message: "",
  error: null,
};

export const lockFurnaceThunk = createAsyncThunk("mqtt/lock", async () => {
  const res = await lockFurnace();
  return res;
});

export const unlockFurnaceThunk = createAsyncThunk("mqtt/unlock", async () => {
  const res = await unlockFurnace();
  return res;
});

const mqttSlice = createSlice({
  name: "mqtt",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(lockFurnaceThunk.pending, (state) => {
        state.status = "loading";
        state.message = "";
        state.error = null;
      })
      .addCase(lockFurnaceThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload;
      })
      .addCase(lockFurnaceThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Lock failed";
      })
      .addCase(unlockFurnaceThunk.pending, (state) => {
        state.status = "loading";
        state.message = "";
        state.error = null;
      })
      .addCase(unlockFurnaceThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload;
      })
      .addCase(unlockFurnaceThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Unlock failed";
      });
  },
});

export default mqttSlice.reducer;
