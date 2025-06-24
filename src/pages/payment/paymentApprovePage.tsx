import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import jwtAxios from "../../util/jwtUtil";
import LoadingSpinner from "../../components/common/loadingSpinner";
import { showSuccessToast } from "../../util/toastUtil";

const PaymentApprovePage = () => {
  
  const [searchParams] = useSearchParams();

  const orderId = searchParams.get("order_id");
  const idempotencyKey = searchParams.get("idempotency_key")
  const pgToken = searchParams.get("pg_token");

  const host = 'http://localhost:8080';

  useEffect(() => {
    if (orderId && pgToken) {
      // 백엔드에 결제 승인 요청
      jwtAxios.put(`${host}/payment/approve`, {
        orderId,
        pgToken
      }, {
        headers: {
          'Idempotency-Key': idempotencyKey
        }
      })
      .then(res => {
        if(res.data.code === 200){
          showSuccessToast("결제 완료 되었습니다.");

          location.href =res.data.data; // 주문 상세페이지로 이동
        }
        console.log("결제 승인 성공:", res.data);
        
      })
      .catch(err => {
        console.error("결제 승인 실패:", err);
      });
    }
  }, [orderId, pgToken]);

  return (
    <div className="">

      <LoadingSpinner/>
      <div className="absolute top-[20%] left-1/2 transform -translate-x-1/2 bg-yellow w-fit px-4 py-2 text-2xl rounded">결제 승인 중입니다.</div>
    </div>
  );
};

export default PaymentApprovePage;
