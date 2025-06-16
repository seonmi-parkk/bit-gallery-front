import OrderItemComponent from "./orderItemComponent"
import "../../styles/cart.css"
import { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

const OrderComponent = ({orderData}: { orderData: OrderPreviewDto[]}) => {

const [isExpanded, setIsExpanded] = useState(false);
  const [maxHeight, setMaxHeight] = useState('0px');
  const ulRef = useRef<HTMLUListElement>(null);

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

  return (
    <div className="w-full bg-main">
      <div className="my-14">
        <h5 className="mb-3">주문 상품</h5>
        <ul 
          ref={ulRef}
          className="relative overflow-hidden transition-all duration-300 ease-in-out border-y"
          style={{ maxHeight }}
        >
          <button
            className="absolute right-0 top-1 mt-2 text-3xl font-semibold underline"
            onClick={() => setIsExpanded(prev => !prev)}
          >
            {isExpanded ? <MdKeyboardArrowUp/> : <MdKeyboardArrowDown/>}
          </button>
          {orderData.map(item => <OrderItemComponent orderItem={item} key={item.pno} />)}
        </ul>
      </div>
      
      <div className="my-14">
        <h5 className="mb-3">결제 방법</h5>
      </div>

      <div className="fixed left-0 bottom-0 w-full px-10 py-3 bg-main-2 ">
        <div className="inner  flex gap-6 justify-end ">
          <p className="flex gap-1.5 items-center text-lg">
            총 <span className="mr-3 font-medium">개</span> 
            주문금액 <span className="ml-1 text-2xl font-medium">원</span>
          </p>
            <button
              className="m-1 px-4 py-1.5 text-lg text-white btn-blue rounded-lg"
              onClick={() => {}}
            > 구매하기 </button>
        </div>
      </div>
    </div>
  )
}

export default OrderComponent;