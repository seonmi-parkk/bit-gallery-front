import { useLocation } from "react-router";

const OrderPage = () => {

  const location = useLocation();

  // 전달된 데이터
  const orderData = location.state;
  console.log("orderData",orderData)

  return (
    <div>주문하기</div>
  )
}

export default OrderPage