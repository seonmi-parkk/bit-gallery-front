
import { useEffect } from "react"
import useLoginStore from "../zstore/useLoginStore"
import useCartStore from "../zstore/useCartStore"

const UseCustomCart = () => {

  const {user:loginState, status:loginStatus} = useLoginStore()

  const {items, getItems, addCartItem, deleteCartItem, status} = useCartStore()

  const cartItems = {items:items, status:status}


  // 로그인/로그아웃 상태 변화시 장바구니 아이템 가져오기 -> 로그인시 노출/ 로그아웃시 비노출
  useEffect(() => {
    if (loginStatus) {
      getItems()
    }
  }, [loginStatus])


  const addItem = (pno: number) => {
    const email = loginState.email
    const requestItem:CartItemRequest = {email, pno}

    addCartItem(requestItem)
  }

  const deleteItem = (cino: number) => {
    deleteCartItem(cino)
  } 

  const isInCart = (pno: number) => {
    return cartItems.items.some(item => item.pno === pno)
  }

  return {loginState, loginStatus, cartItems, addItem, deleteItem, isInCart}
}

export default UseCustomCart