import { useEffect } from "react"
import CartComponent from "../../components/menus/cartComponent"
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
      <div className="">
        <h3>CartPage</h3>
        <button onClick={() => showSuccessToast("업로드 완료!")}>
          알림 테스트 성공
        </button>
        <button onClick={() => showErrorToast("업로드 실패!")}>
          알림 테스트 실패
        </button>
        <button onClick={() => showInfoToast("업로드는 이렇게!")}>
          알림 테스트 메세지
        </button>
        <button onClick={() => showIngToast("업로드 중!")}>
          알림 테스트 진행중
        </button>
        <CartComponent/>
      </div>
      
    
  )
}

export default CartPage