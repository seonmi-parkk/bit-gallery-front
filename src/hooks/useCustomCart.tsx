
import { useEffect } from "react"
import useLoginStore from "../zstore/useLoginStore"
import useCartStore from "../zstore/useCartStore"
import { useNavigate } from "react-router"
import useCustomLogin from "./useCustomLogin"

const UseCustomCart = () => {

  const {user:loginState, status:loginStatus} = useLoginStore()

  const {items, getItems, addCartItem, deleteCartItem, status} = useCartStore()

  const {moveToLogin} = useCustomLogin()

  const cartItems = {items:items, status:status}

  // 로그인/로그아웃 상태 변화시 장바구니 아이템 가져오기 -> 로그인시 노출/ 로그아웃시 비노출
  useEffect(() => {
    if (loginStatus === 'fulfilled') {
      getItems()
      console.log("로그인 상태변화 -> 장바구니 아이템 가져옴")
    }
  }, [loginStatus])


  const addItem = (pno: number) => {
    if (loginStatus !== 'fulfilled'){
      alert('로그인이 필요합니다.');
      moveToLogin()
      return;
    }
    const email = loginState.email
    const requestItem:CartItemRequest = {email, pno}

    addCartItem(requestItem)
  }

  const deleteItem = (cino: number) => {
    deleteCartItem(cino)
  } 

  const isInCart = (pno: number) => {
    if(loginStatus !== 'fulfilled'){return false; console.log("로그인 안되어있음")}
    console.log("is in cart 실행")
    console.log("cartItems.items", items)
    return cartItems.items.some(item => item.pno === pno)
  }

  return {loginState, loginStatus, cartItems, addItem, deleteItem, isInCart}
}

export default UseCustomCart