import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { disable, enable, lockFurnace, status, unlockFurnace } from "./mqttAPI";

// Define allowed MQTT status types
type MqttStatusValue = "enabled" | "disabled";

interface MqttState {
  status: "idle" | "loading" | "succeeded" | "failed";
  message: string;
  error: string | null;
  mqttStatus: MqttStatusValue;
}

const initialState: MqttState = {
  status: "idle",
  message: "",
  error: null,
  mqttStatus: "enabled",
};

export const lockFurnaceThunk = createAsyncThunk("mqtt/lock", async () => {
  const res = await lockFurnace();
  return res;
});

export const unlockFurnaceThunk = createAsyncThunk("mqtt/unlock", async () => {
  const res = await unlockFurnace();
  return res;
});

export const mqttstatusThunk = createAsyncThunk("mqtt/status", async () => {
  const res = await status();
  return res as MqttStatusValue;
});

export const mqttenableThunk = createAsyncThunk("mqtt/enable", async () => {
  await enable();
  return "enabled" as MqttStatusValue;
});

export const mqttdisableThunk = createAsyncThunk("mqtt/disable", async () => {
  await disable();
  return "disabled" as MqttStatusValue;
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
        state.error = action.error.message ?? "Status failed";
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
      })

      .addCase(mqttstatusThunk.pending, (state) => {
        state.status = "loading";
        state.message = "";
        state.error = null;
      })
      .addCase(mqttstatusThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.mqttStatus = action.payload;
      })
      .addCase(mqttstatusThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Status failed";
      })

      .addCase(mqttenableThunk.pending, (state) => {
        state.status = "loading";
        state.message = "";
        state.error = null;
      })
      .addCase(mqttenableThunk.fulfilled, (state) => {
        state.status = "succeeded";
        state.mqttStatus = "enabled";
      })
      .addCase(mqttenableThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Enable failed";
      })

      .addCase(mqttdisableThunk.pending, (state) => {
        state.status = "loading";
        state.message = "";
        state.error = null;
      })
      .addCase(mqttdisableThunk.fulfilled, (state) => {
        state.status = "succeeded";
        state.mqttStatus = "disabled";
      })
      .addCase(mqttdisableThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Disable failed";
      });
  },
});

export default mqttSlice.reducer;
