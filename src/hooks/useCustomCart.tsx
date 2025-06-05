import { useDispatch, useSelector } from "react-redux"
import useCustomLogin from "./useCustomLogin"
import type { AppDispatch, RootState } from "../store"
import { useEffect } from "react"
import { getCartItemsAsyncThunk, postAddItemAsyncThunk } from "../slices/cartSlice"

const UseCustomCart = () => {

  const { loginState, loginStatus } = useCustomLogin()

  const cartItems = useSelector((state: RootState) => state.cartSlice)

  const dispatch = useDispatch<AppDispatch>()

  // 로그인/로그아웃 상태 변화시 장바구니 아이템 가져오기 -> 로그인시 노출/ 로그아웃시 비노출
  useEffect(() => {
    if (loginStatus) {
      dispatch(getCartItemsAsyncThunk())
    }
  }, [loginStatus])


  const addItem = (pno: number) => {
    const email = loginState.email
    const requestItem:CartItemRequest = {email, pno}

    dispatch(postAddItemAsyncThunk(requestItem))
  }

  const isInCart = (pno: number) => {
    return cartItems.items.some(item => item.pno === pno)
  }

  return {loginState, loginStatus, cartItems, addItem, isInCart}
}

export default UseCustomCart