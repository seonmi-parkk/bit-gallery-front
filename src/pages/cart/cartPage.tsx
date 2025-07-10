import { useEffect } from "react"
import CartComponent from "../../components/cart/cartComponent"
import useCustomLogin from "../../hooks/useCustomLogin"
import { showErrorToast, showInfoToast, showIngToast, showSuccessToast } from "../../util/toastUtil"

const CartPage = () => {
  const {loginStatus, moveToLogin} = useCustomLogin()
  console.log("loginStatus???",loginStatus)

    // useEffect(() => {
    //   console.log("[CartPage]loginStatus????")
    // if (loginStatus !== "fulfilled") {
    //     alert("로그인이 필요합니다.");
    //     moveToLogin();
    //   }
    // }, [loginStatus]);
    
  return (
      <div className="inner">
        <h3 className="font-bold text-center">장바구니</h3>
        <CartComponent/>
      </div>
      
    
  )
}

export default CartPage