import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteDeleteItem, getCartItems, postAddItem } from "../api/cartApi";

export const getCartItemsAsyncThunk = createAsyncThunk('getCartItemsAsyncThunk', () => {
  return getCartItems()
})

export const postAddItemAsyncThunk = createAsyncThunk('postAddItemAsyncThunk', (param:CartItemRequest) => {
  return postAddItem(param)
})

export const deleteDeleteItemAsyncThunk = createAsyncThunk('deleteDeleteItemAsyncThunk', (cino:number) => {
  return deleteDeleteItem(cino)
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

    .addCase(postAddItemAsyncThunk.fulfilled, (state, action) => {
      return {items: action.payload, status: 'fulfilled'}
    }).addCase(postAddItemAsyncThunk.pending, (state, action) => {
      state.status = 'pending'
    }).addCase(postAddItemAsyncThunk.rejected, (state, action) => {
      state.status = 'rejected'
    })

    .addCase(deleteDeleteItemAsyncThunk.fulfilled, (state, action) => {
      return {items: action.payload, status: 'fulfilled'}
    }).addCase(deleteDeleteItemAsyncThunk.pending, (state, action) => {
      state.status = 'pending'
    }).addCase(deleteDeleteItemAsyncThunk.rejected, (state, action) => {
      state.status = 'rejected'
    })
  }
})

export default cartSlice.reducer