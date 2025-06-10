import UseCustomCart from "../../hooks/useCustomCart"
import CartItemComponent from "../cart/cartItemComponent"
import "../../styles/cart.css"
import LoadingSpinner from "../common/loadingSpinner"
import { showErrorToast } from "../../util/toastUtil"

const CartComponent = () => {

  const {loginState, loginStatus, cartItems, addItem} = UseCustomCart()


  return (
    <div className="w-full bg-main">
      {loginStatus === 'fulfilled' &&
        <>
          {cartItems.status === 'pending' && <LoadingSpinner/>}
          {cartItems.status === 'error' && showErrorToast("장바구니 데이터 불러오기에 실패했습니다.")}
          {cartItems.status === 'fulfilled' &&
            <>
              <div>{loginState.nickname}님 Cart</div>
              <div className="bg-orange-600 text-center text-white font-bold w-1/5 rounded-full m-1">
                {cartItems.items.length}
              </div>
              <ul>
                {cartItems.items.map(item => <CartItemComponent cartItem={item} key={item.cino}/>)}
              </ul>
            </>
          }
        </>
      }
    </div>
  )
}

export default CartComponent