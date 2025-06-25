import { useSearchParams } from "react-router"
import jwtAxios from "../../util/jwtUtil";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../components/common/loadingSpinner";
import OrderDetailComponent from "../../components/order/orderDetailComponent";
import { showErrorToast } from "../../util/toastUtil";
import { useState } from "react";
import type { AxiosError } from "axios";
import ResultModal from "../../components/common/resultModal";

const OrderDetailPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  const host = 'http://localhost:8080';
  const [errorMsg, setErrorMsg] = useState('');

  const {data, isPending, error} = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      try {
        const res = await jwtAxios.get(`${host}/orders/${orderId}`)
        return res.data
      } catch (err){
          const axiosError = err as AxiosError<ApiResponse>;
          showErrorToast(axiosError.response?.data?.message.toString() || "주문 정보를 불러올 수 없습니다.")
          setTimeout(() => {
            history.back();
          }, 3000);
      }
    },
    staleTime: 1000 * 60 * 10
  })

  return (
    <div className="inner max-w-[900px]">
      <h3 className="font-bold mb-6 text-center">주문 내역</h3>
      {isPending && <LoadingSpinner/>}
      {data &&
        <OrderDetailComponent data={data.data}></OrderDetailComponent>
      }
    </div>
  )
}

export default OrderDetailPage