import useCartStore from "../../zstore/useCartStore"

const CartItemComponent = ({cartItem}: {cartItem:CartItemResponse}) => {

  const {deleteCartItem} = useCartStore()

  const { cino, pno, pname, price, imageFile } = cartItem

  return (
    <li key={cino} className="border-2">
      <div className="w-full border-2">
        <div className=" m-1 p-1 ">
          <img src={`http://localhost:8080/products/view/s_${imageFile}`} />
        </div>

        <div className="justify-center p-2 text-xl ">
          <div className="justify-end w-full">
          </div>
          <div>Cart Item No: {cino}</div>
          <div>Pno: {pno}</div>
          <div>Name: {pname}</div>
          <div>Price: {price}</div>
          <div className='font-extrabold border-t-2 text-right m-2 pr-4'>
            {price} 원
          </div>
          <div className="flex text-white font-bold p-2 justify-center">
            <button
              className="m-1 p-1 text-xl text-white bg-red-500 w-8 rounded-lg"
              onClick={() => deleteCartItem(cino)}
            > X </button>
          </div>

        </div>
      </div>
    </li>
  )

}

export default CartItemComponent