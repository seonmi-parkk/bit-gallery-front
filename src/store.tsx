import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "./slices/loginSlices"

const store = configureStore({
  reducer: {
    "loginSlice": loginSlice
  }
})

export type AppDispatch = typeof store.dispatch //typeScript 사용시 필요
export type RootState = ReturnType<typeof store.getState> //typeScript 사용시 필요

export default store