import OrderItemComponent from "./orderItemComponent"
import "../../styles/cart.css"
import { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { postRequestOrder } from "../../api/orderApi";
import { showErrorToast } from "../../util/toastUtil";
import { v4 as uuidv4 } from 'uuid';

const OrderComponent = ({orderData}: {orderData: OrderPreviewDto[]}) => {

  console.log("orderDataorderData:" , orderData);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const imageUrl = `${apiUrl}/upload/product/thumb/s_`;

  // 주문 상품 토글 처리
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [maxHeight, setMaxHeight] = useState<string>('0px');
  const ulRef = useRef<HTMLUListElement>(null);

  const [paymentType, setPaymentType] = useState<string>();

  const totalPrice = orderData.reduce((sum, item) => sum + item.price, 0).toLocaleString();
  const totalQuantity = orderData.length;
  const [uuid, setUuid] = useState(uuidv4());

  console.log("uuid: ",uuid);
  useEffect(() => {
    if (ulRef.current) {
      if (isExpanded) {
        setMaxHeight(`${ulRef.current.scrollHeight}px`);
      } else {
        // 한 항목만 보이도록 설정
        const firstLi = ulRef.current.querySelector('li');
        setMaxHeight(firstLi ? `${firstLi.clientHeight}px` : '134px');
      }
    }
  }, [isExpanded, orderData]);

  // 주문하기
  const requestOrder = (e:React.MouseEvent<HTMLButtonElement>) => {
    // 구매할 아이템의 pno가져오기
    const pnos:number[] = orderData.map(item => item.pno);
    console.log("pnos",pnos)
    // 결제방법 paymentType
    
    if (!paymentType) {
      showErrorToast("결제 방식이 선택되지 않았습니다.");
      return;
    }
    const order = {"productNos":pnos, "paymentType":paymentType}

    postRequestOrder(order, uuid)
    .then(res => {
      if(res.message === 'SUCCESS' && res.data.paymentUrl){
        console.log("결제 요청완료 : ", res)  
        window.location.href = res.data.paymentUrl
      }
      console.log(res)  
    }).catch(e => {
      showErrorToast('유효하지 않은 주문 요청입니다. 다시 시도해주세요.');
      //history.back();
      console.error(e)
      
    })
  }

  return (
    <div className="w-full bg-main">
      <div className="my-14">
        <h5 className="mb-3">주문 상품</h5>
        <ul 
          ref={ulRef}
          className="relative overflow-hidden transition-all duration-300 ease-in-out border-y"
          style={{ maxHeight }}
        >
          {orderData.length > 1 &&
            <>
              <button
                className="absolute right-0 top-1 mt-2 text-3xl font-semibold underline"
                onClick={() => setIsExpanded(prev => !prev)}
              >
                {isExpanded ? <MdKeyboardArrowUp/> : <MdKeyboardArrowDown/>}
              </button>
              <li className={`border-b border-gray-700 cart cart-item`}>
                <div className="flex items-start w-full px-6 py-4">
                  <div className="w-25 h-25 overflow-hidden ml-1 mr-6">
                    <img src={imageUrl+orderData[0].imageFile} />
                  </div>

                  <div className="flex flex-1 justify-between">
                    {/* <div>Cart Item No: {cino}</div>
                    <div>Pno: {pno}</div> */}
                    <div className="mr-6">
                      <div>주문 상품 : {orderData[0].pname} 외 {totalQuantity}개</div>
                      <div>주문 금액 : {totalPrice} 원</div>
                    </div>
                  </div>

                </div>
              </li>
            </>
          }
          {orderData.map(item => <OrderItemComponent orderItem={item} key={item.pno} />)}
        </ul>
      </div>
      
      <div className="my-14">
        <h5 className="mb-3">결제 방법</h5>
        <button 
          data-payment="KAKAOPAY"
          className={` rounded-sm px-4 py-3 ${paymentType === "KAKAOPAY"?"bg-main-3":"bg-main-4"}`}
          onClick={(e)=>setPaymentType(e.currentTarget.dataset.payment)}
        >
          카카오페이
        </button>
      </div>

      <div className="fixed left-0 bottom-0 w-full px-10 py-3 bg-main-2 ">
        <div className="inner  flex gap-6 justify-end ">
          <p className="flex gap-1.5 items-center text-lg">
            총 <span className="mr-3 font-medium">${totalQuantity} 개</span> 
            주문금액 <span className="ml-1 text-2xl font-medium">${totalPrice} 원</span>
          </p>
            <button
              className="m-1 px-4 py-1.5 text-lg text-white btn-blue rounded-lg"
              onClick={(e) => requestOrder(e)}
            > 구매하기 </button>
        </div>
      </div>
    </div>
  )
}

export default OrderComponent;