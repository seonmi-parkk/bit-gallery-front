import UseCustomCart from "../../hooks/useCustomCart"
import CartItemComponent from "./cartItemComponent"
import "../../styles/cart.css"
import LoadingSpinner from "../common/loadingSpinner"
import { showErrorToast } from "../../util/toastUtil"
import { useNavigate } from "react-router"
import { postGetOrderItemList } from "../../api/orderApi"
import { useEffect, useState } from "react"

const CartComponent = () => {

  const {loginState, loginStatus, cartItems, addItem} = UseCustomCart()

  const [orderItem, setOrderItem] = useState<CartItems>({...cartItems}) 
  const [totalPrice, setTotalPrice] = useState<number>() 
  const [totalQuantity, setTotalQuantity] = useState<number>() 


  // cartItems가 바뀔 때 orderItem 업데이트
  useEffect(() => {
    console.log("cartItems.status",cartItems.status)
    if (cartItems.status === 'fulfilled') {
      setOrderItem({ ...cartItems });
    }
  }, [cartItems.status]);

  // orderItem이 설정되면 합계 계산
  useEffect(() => {
    if (!orderItem?.items) return;

    let quantity = 0;
    let price = 0;

    orderItem.items.forEach((item) => {
      price += item.price;
      quantity += 1;
    });

    setTotalPrice(price);
    setTotalQuantity(quantity);
  }, [orderItem]);
  
  // 체크박스 클릭시
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, item: CartItemResponse) => {
    const checked = e.target.checked;

    setOrderItem((prev:CartItems) => {
      const currentItems = prev.items;
      if (checked) {
        console.log("checked");
        // 체크 시 orderItem에 없으면 추가
        const exists = currentItems.find(i => i.pno === item.pno);
        if (!exists) {
          return { items: [...currentItems, item] };
        }
        return prev;
      } else {
        console.log("not checked");
        // 체크 해제 시 제거
        return {
          items: currentItems.filter(i => i.pno !== item.pno),
        };
      }
    });
  };

  const navigate = useNavigate()

  // 선택 구매버튼 클릭 시
  const buySelectedItem = () => {
    // 선택된 아이템의 cno가져오기
    const pnos:number[] = [];
    const checked = document.querySelectorAll('input[type="checkbox"]:checked');

    checked.forEach(cb => {
      const parentLi = cb.closest('li'); 
      const key = parentLi?.getAttribute('data-key');
      if(key) {
        pnos.push(Number(key));
      }
      console.log("✔️ pnos:", pnos);
    });
    
    postGetOrderItemList(pnos)
    .then(res => {
      console.log(res)  
      navigate('/orders', { state: res.data }) // 주문페이지로 이동, 응답 전달
    
    }).catch(e => {
      console.error(e)
    })
  }

  return (
    <div className="w-full bg-main">
      {loginStatus === 'fulfilled' &&
        <>
          {cartItems.status === 'pending' && <LoadingSpinner/>}
          {cartItems.status === 'error' && showErrorToast("장바구니 데이터 불러오기에 실패했습니다.")}
          {cartItems.status === 'fulfilled' &&
            <>
              <ul>
                {cartItems.items.map(item => <CartItemComponent cartItem={item} key={item.cino} orderItem={orderItem} handleCheckboxChange={handleCheckboxChange}/>)}
              </ul>

        <div>
          {totalQuantity}개 {totalPrice}원
            <button
              className="m-1 p-1 text-xl text-white bg-red-500 rounded-lg"
              onClick={() => buySelectedItem()}
            > 선택 구매 </button>
        </div>
            </>
          }
        </>
      }
    </div>
  )
}

export default CartComponent