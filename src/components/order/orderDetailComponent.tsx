import { useEffect, useRef, useState } from "react";
import OrderItemComponent from "./orderItemComponent";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import ReadModalComponent from "../products/readModalComponent";

const OrderDetailComponent = ({data}:{data:OrderDetailResponse}) => {

  const orderData = data.orderItems;

  // 주문 상품 토글 처리
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [maxHeight, setMaxHeight] = useState<string>('0px');
  const ulRef = useRef<HTMLUListElement>(null);

  // 상품 상세 모달
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedPno, setSelectedPno] = useState<number>(0);
  
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
        
        <h4 className="font-bold mt-10 mb-3">주문 정보</h4>
        <div className="bg-main-2 rounded-lg px-6 py-4 border-gray-700 border">
          <p className="mb-2"><span className="font-medium mr-2">주문번호</span> {data.ono}</p>
          <p className=" text-gray-300"><span className="font-medium mr-2">주문일시</span> {data.paidAt.toString()}</p>
        </div>

      
        <h4 className="font-bold mt-10 mb-3">결제 정보</h4>
        <div className="bg-main-2 rounded-lg px-6 py-4 border-gray-700 border">
          <p className="mb-2"><span className="font-medium mr-2">결제방법</span> {data.paymentType}</p>
          <p className=" text-gray-300"><span className="font-medium mr-2">총 주문 금액</span> {data.totalPrice} 원</p>
        </div>

        <h4 className="relative font-bold mt-10 mb-3">
          주문 상품
          <button
            className="absolute right-0 top-1 text-4xl underline"
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
              <span className="pl-4 font-normal text-white-2">{orderData.length}건</span>
            </h6>
            {orderData.map(item => <OrderItemComponent orderItem={item} key={item.pno} setIsOpenModal={setIsOpenModal} setSelectedPno={setSelectedPno} />)}
          </ul>
        </div>
      </div>

      {/* 상세페이지 모달 */}
      {isOpenModal && selectedPno !== 0 && 
        <ReadModalComponent
          pno={selectedPno} 
          onClose={() => {setIsOpenModal(false); setSelectedPno(0); }}
        />
      }

    </div>
  )
}

export default OrderDetailComponent