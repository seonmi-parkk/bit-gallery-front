import { useLocation } from "react-router";
import OrderComponent from "../../components/order/orderComponent";

const OrderPage = () => {

  const location = useLocation();

  // 전달된 데이터
  const orderData = location.state;
  console.log("orderData",orderData)

  return (
    <div className="inner">
      <h3 className="font-bold mb-6 text-center">주문</h3>
      <OrderComponent orderData={orderData}/>
    </div>
  )
}

export default OrderPage