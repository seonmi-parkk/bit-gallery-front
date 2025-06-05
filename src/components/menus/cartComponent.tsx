import UseCustomCart from "../../hooks/useCustomCart"
import CartItemComponent from "../cart/cartItemComponent"

const CartComponent = () => {

  const {loginState, loginStatus, cartItems, addItem} = UseCustomCart()


  return (
    <div className="w-full">
      {loginStatus &&
        <>
          {cartItems.status === 'pending' && <div>Loading....</div>}
          {cartItems.status === 'rejected' && <div>rejected....</div>}
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