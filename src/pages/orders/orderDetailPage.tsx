import { useSearchParams } from "react-router"
import jwtAxios from "../../util/jwtUtil";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../components/common/loadingSpinner";
import OrderDetailComponent from "../../components/order/orderDetailComponent";

const OrderDetailPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  const host = 'http://localhost:8080';

  const {data, isPending, error} = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const res = await jwtAxios.get(`${host}/orders/${orderId}`)
      return res.data.data
    },
    staleTime: 1000 * 60 * 10
  })

  return (
    <div className="w-full">
      {isPending && <LoadingSpinner/>}
      {data &&
      
        <OrderDetailComponent data={data}></OrderDetailComponent>
      }
    </div>
  )
}

export default OrderDetailPage