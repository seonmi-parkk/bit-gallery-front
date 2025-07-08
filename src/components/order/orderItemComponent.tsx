

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
      className={`border-t border-gray-700 cart-item cursor-pointer`}
      onClick={()=> {setIsOpenModal(true); setSelectedPno(pno);}}
    >
      <div className="flex items-start w-full px-6 py-4">
        <div className="w-25 h-25 overflow-hidden ml-1 mr-5">
          <img src={imageUrl+imageFile} />
        </div>

        <div className="flex flex-1 justify-between ">
          {/* <div>Cart Item No: {cino}</div>
          <div>Pno: {pno}</div> */}
          <div className="mr-6">
            <p>{pname}</p>
            <p className="mt-1">{price.toLocaleString()} 원</p>
          </div>
        

        </div>

      </div>
    </li>
  )

}

export default OrderItemComponent