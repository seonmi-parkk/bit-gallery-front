import { useEffect, useRef, useState } from "react";
import OrderItemComponent from "./orderItemComponent";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

const OrderDetailComponent = ({data}:{data:OrderDetailResponse}) => {

  const orderData = data.orderItems;
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const imageUrl = `${apiUrl}/upload/product/thumb/s_`;

  // 주문 상품 토글 처리
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [maxHeight, setMaxHeight] = useState<string>('0px');
  const ulRef = useRef<HTMLUListElement>(null);

  const [paymentType, setPaymentType] = useState<string>();

  //const totalPrice = data.reduce((sum, item) => sum + item.price, 0).toLocaleString();
  //const totalQuantity = orderData.length;
  

  
  useEffect(() => {
    if (ulRef.current) {
      if (isExpanded) {
        setMaxHeight(`${ulRef.current.scrollHeight}px`);
      } else {
        const firstLi = ulRef.current.querySelector('h6');
        setMaxHeight(firstLi ? `${firstLi.clientHeight}px` : '50px');
      }
    }
  }, [isExpanded, data]);

  return (
    <div>
      <div className="my-14">
        
        <div className="bg-main-2 rounded-lg px-6 py-4 border-gray-700 border">
          <h6 className="mb-1"><span className="font-medium">주문번호</span> {data.ono}</h6>
          <h6 className=" text-gray-300">{data.paidAt.toString()}</h6>
        </div>

      
        <h4 className="font-bold mt-10 mb-3">결제 정보</h4>
        <div className="bg-main-2 rounded-lg px-6 py-4 border-gray-700 border">
          <h6 className="mb-1"><span className="font-medium">결제방법</span> {data.paymentType}</h6>
          <h6 className=" text-gray-300">총 주문 금액 - {data.totalPrice} 원</h6>
        </div>

        <h4 className="relative font-bold mt-10 mb-3">
          주문 상품
          <button
            className="absolute right-0 top-1 text-3xl font-semibold underline"
            onClick={() => setIsExpanded(prev => !prev)}
          >
            {isExpanded ? <MdKeyboardArrowUp/> : <MdKeyboardArrowDown/>}
          </button>
        </h4>

        <div className="rounded-lg bg-main-2">
          <ul 
            ref={ulRef}
            className="relative overflow-hidden transition-all duration-300 ease-in-out mt-2 "
            style={{ maxHeight }}
          >
            <h6 className="font-medium px-6 py-3">
              <span>주문 상세 내역</span>
              <span>{orderData.length}건</span>
            </h6>
            {orderData.map(item => <OrderItemComponent orderItem={item} key={item.pno} />)}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailComponent