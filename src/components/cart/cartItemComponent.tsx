import { useNavigate } from "react-router";
import useCartStore from "../../zstore/useCartStore"
import { RiCloseLine } from "react-icons/ri";
import { postGetOrderItemList } from "../../api/orderApi";

type CartItemComponentProps = {
  cartItem: CartItemResponse;
  orderItem: CartItemResponse[];
  handleCheckboxChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    item: CartItemResponse
  ) => void;
};

const CartItemComponent = ({cartItem, orderItem, handleCheckboxChange}: CartItemComponentProps) => {

  const {deleteCartItem} = useCartStore()

  const { cino, pno, pname, price, imageFile, status } = cartItem

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const imageUrl = `${apiUrl}/upload/product/list_thumb/t_`;

  const navigate = useNavigate()
  
  const buyItem = (pno:number) => {
    postGetOrderItemList([pno])
    .then(res => {
      console.log(res)  
      navigate('/orders', { state: res.data }) // 주문페이지로 이동, 응답 전달
    
    }).catch(e => {
      console.error(e)
    })
  }


  return (
    <li key={cino} data-key={cino} className={`border-b border-main-3 cart-item ${status}`}>
      <div className="flex items-start w-full px-2 py-4">
        <input
          type="checkbox"
          onChange={(e)=>handleCheckboxChange(e,cartItem)}
          checked={orderItem.some(item => item.pno === pno) && status == 'APPROVED' }
          />
      
        <div className="w-25 h-25 overflow-hidden ml-1 mr-5">
          <img src={imageUrl+imageFile} />
        </div>

        <div className="flex flex-1 justify-between items-start">
          <div className="mr-6">
            {(status == 'PAUSED' || status == 'DELETED') && <span className="bg-warn px-1 py-0.5 inline-block mb-2 text-white text-sm rounded-sm">판매 중지</span> }
            <p>{pname}</p>
            <p className="mt-1">{price.toLocaleString()} 원</p>
          </div>
          
          <div className="flex  text-white font-bold px-2">
            <button
              className="m-1 px-2 py-1 text-base font-medium bg-main-3 rounded-lg"
              onClick={() => buyItem(pno)}
            > 개별 구매 </button>
            <button
              className="m-1 px-2 py-1 text-white border border-main-4 rounded-lg"
              onClick={() => deleteCartItem(cino)}
            > <RiCloseLine /> </button>
            
          </div>

        </div>

      </div>
    </li>
  )

}

export default CartItemComponent