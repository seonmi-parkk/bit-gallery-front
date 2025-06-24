import UseCustomCart from "../../hooks/useCustomCart"
import CartItemComponent from "./cartItemComponent"
import "../../styles/cart.css"
import LoadingSpinner from "../common/loadingSpinner"
import { showErrorToast } from "../../util/toastUtil"
import { useNavigate } from "react-router"
import { postGetOrderItemList } from "../../api/orderApi"
import React, { useEffect, useState } from "react"
import useCustomLogin from "../../hooks/useCustomLogin"
import CartImage from "@/assets/images/cart.png"

const CartComponent = () => {

  const {loginStatus, cartItems} = UseCustomCart()
  const {moveToLogin} = useCustomLogin()

  const [orderItem, setOrderItem] = useState<CartItemResponse[]>([...cartItems.items]) 
  const [totalPrice, setTotalPrice] = useState<number>(0) 
  const [totalQuantity, setTotalQuantity] = useState<number>(0) 
  const [wholeChecked, setWholeChecked] = useState<boolean>(true)


  // cartItems가 바뀔 때 orderItem 업데이트
  useEffect(() => {
    console.log("cartItems.status",cartItems.status)
    if (cartItems.status === 'fulfilled') {
      setOrderItem([...cartItems.items]);
    }
  }, [cartItems.status]);

  // orderItem이 설정되면 합계 계산
  useEffect(() => {
    if (!orderItem) return;

    let quantity = 0;
    let price = 0;

    orderItem.forEach((item) => {
      price += item.price;
      quantity += 1;
    });

    setTotalPrice(price);
    setTotalQuantity(quantity);
  }, [orderItem]);
  
  // 체크박스 클릭시
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, item: CartItemResponse) => {
    const checked = e.target.checked;

    setOrderItem((prev:CartItemResponse[]) => {
      const currentItems = prev;
      if (checked) {
        console.log("checked");
        // 체크 시 orderItem에 없으면 추가
        const exists = currentItems.find(i => i.pno === item.pno);
        if (!exists) {
          return [...currentItems, item ];
        }
        return prev;
      } else {
        console.log("not checked");
        // 체크 해제 시 제거
        return currentItems.filter(i => i.pno !== item.pno);
      }
    });
  };

  // 전체선택 체크박스 클릭시
  const handleWholeCheckboxChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    if(checked === true) {
      setOrderItem(cartItems.items)
      setWholeChecked(true)
    }else {
      setOrderItem([])
      setWholeChecked(false)
    }
  }

  const navigate = useNavigate()

  // 구매하기 버튼 클릭 시
  const buySelectedItem = () => {
    // 구매할 아이템의 pno가져오기
    const pnos:number[] = orderItem.map(item => item.pno);
    
    postGetOrderItemList(pnos)
    .then(res => {
      console.log("postGetOrderItemList res : ",res)  ;
      navigate('/orders', { state: res.data }) // 주문페이지로 이동, 응답 전달
    
    }).catch(e => {
      console.error(e)
    })
  }

  return (
    <div className="w-full bg-main">
      {loginStatus !== 'fulfilled' && 
        <div className="mt-14">
          <h3 className="font-medium">로그인이 필요합니다.</h3>
          <p className="m-4 mb-8 text-lg text-gray-300">로그인 후 Bit Gallery의 다양한 상품을 구매하실 수 있습니다.</p>
          <img className="max-w-[240px] m-auto" src={CartImage} alt="cart" />
          <button className="mt-10 px-4 py-1.5 text-lg text-white btn-blue rounded-lg" onClick={moveToLogin}>로그인</button>
        </div>
      }
      {loginStatus === 'fulfilled' &&
        <>
          {cartItems.status === 'pending' && <LoadingSpinner/>}
          {cartItems.status === 'error' && showErrorToast("장바구니 데이터 불러오기에 실패했습니다.")}
          {cartItems.status === 'fulfilled' &&
            <>
              <div className="flex gap-2 my-5">
                <input  
                  name="wholeCheckbox"
                  type="checkbox"
                  onChange={(e)=>handleWholeCheckboxChange(e)}
                  checked={wholeChecked}
                /> 
                <label htmlFor="wholeCheckbox">전체선택</label>
              </div>

              <ul className="border-t">
                {cartItems.items.map(item => <CartItemComponent cartItem={item} key={item.cino} orderItem={orderItem} handleCheckboxChange={handleCheckboxChange}/>)}
              </ul>

              <div className="fixed left-0 bottom-0 w-full px-10 py-3 bg-main-2 ">
                <div className="inner  flex gap-6 justify-end ">
                  <p className="flex gap-1.5 items-center text-lg">
                    총 <span className="mr-3 font-medium">{totalQuantity}개</span> 
                    주문금액 <span className="ml-1 text-2xl font-medium">{totalPrice.toLocaleString()}원</span>
                  </p>
                    <button
                      className="m-1 px-4 py-1.5 text-lg text-white btn-blue rounded-lg"
                      onClick={() => buySelectedItem()}
                    > 구매하기 </button>
                  </div>
              </div>
            </>
          }
        </>
      }
    </div>
  )
}

export default CartComponent