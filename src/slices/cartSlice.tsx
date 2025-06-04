import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCartItems } from "../api/cartApi";

export const getCartItemsAsyncThunk = createAsyncThunk('getCartItemsAsyncThunk', () => {
  return getCartItems()
})

const initState:CartItemsArray = {items:[], status:''}

const cartSlice = createSlice({
  name: 'cartSlice',
  initialState: initState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder.addCase(getCartItemsAsyncThunk.fulfilled, (state, action) => {
      return {items: action.payload, status: 'fulfilled'}
    }).addCase(getCartItemsAsyncThunk.pending, (state, action) => {
      state.status = 'pending'
    }).addCase(getCartItemsAsyncThunk.rejected, (state, action) => {
      state.status = 'rejected'
    })
  }
})

export default cartSlice.reducer