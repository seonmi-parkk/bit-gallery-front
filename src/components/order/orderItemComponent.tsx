
const OrderItemComponent = ({orderItem}:{orderItem:OrderPreviewDto}) => {

  const { pno, pname, price, imageFile} = orderItem

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const imageUrl = `${apiUrl}/upload/product/thumb/s_`;

  return (
    <li key={pno} className={`border-b cart-item`}>
      <div className="flex items-start w-full px-2 py-4">
        <div className="w-25 h-25 overflow-hidden ml-1 mr-6">
          <img src={imageUrl+imageFile} />
        </div>

        <div className="flex flex-1 justify-between text-xl ">
          {/* <div>Cart Item No: {cino}</div>
          <div>Pno: {pno}</div> */}
          <div className="mr-6">
            <div>상품명 : {pname}</div>
            <div>가격 : {price.toLocaleString()} 원</div>
          </div>
        

        </div>

      </div>
    </li>
  )

}

export default OrderItemComponent