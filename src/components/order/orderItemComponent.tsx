type OrderItemComponentProps = {
  orderItem: OrderPreviewDto;
  setIsOpenModal: (value: boolean) => void;
  setSelectedPno: (value: number) => void;
};

const OrderItemComponent = ({orderItem, setIsOpenModal, setSelectedPno}:OrderItemComponentProps) => {

  const { pno, pname, price, imageFile} = orderItem

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const imageUrl = `${apiUrl}/upload/product/thumb/s_`;

  return (
    <li 
      key={pno} 
      className={`border-t border-gray-700 cart-item`}
    >
      <div className="flex items-stretch gap-2 w-full px-6 py-4">
        <div 
          className="flex flex-1 cursor-pointer"
          onClick={()=> {setIsOpenModal(true); setSelectedPno(pno);}}
        >
          <div className="w-25 h-25 overflow-hidden ml-1 mr-5">
            <img src={imageUrl+imageFile} />
          </div>

          {/* <div>Cart Item No: {cino}</div>
          <div>Pno: {pno}</div> */}
          <div className="mr-6">
            <p>{pname}</p>
            <p className="mt-1">{price.toLocaleString()} 원</p>
          </div>
        </div>

        <div className="flex flex-col justify-between text-sm">
          <div>
            <p className="flex justify-between mb-1.5">
              <span className="font-medium mr-1 text-white-2">다운로드 횟수</span> 
              <span>4회 / 5회</span>
            </p>
            <p className="flex justify-between mb-1.5">
              <span className="font-medium mr-1 text-white-2">다운로드 기간</span>
              <span>~ 2025-02-02</span>
            </p>
          </div>
          <button className="my-1 px-4 py-1.5 font-medium text-white btn-blue rounded-lg">다운로드</button>
        </div>

      </div>
    </li>
  )

}

export default OrderItemComponent