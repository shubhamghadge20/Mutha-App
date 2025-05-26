import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import userSlice from "@features/user/userSlice";
import productSlice from "@features/product/productSlice";
import xmlSlice from "@/features/xml/xmlSlice";
import xmlhistorySlice from "@/features/xmlhistory/xmlhistorySlice";
import { mqttReducer } from "@/features/mqtt";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userSlice,
    product: productSlice,
    xml: xmlSlice,
    xmlhistory: xmlhistorySlice,
    mqtt: mqttReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
