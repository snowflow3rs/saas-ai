
"use client"
import { configureStore } from "@reduxjs/toolkit";
import { proModalSlice } from "./modalSlice";

export const store = configureStore({
    reducer: {
      proModal: proModalSlice.reducer,
    },
  });
  
  export type RootState = ReturnType<typeof store.getState>
  export type AppDispatch = typeof store.dispatch;