import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import jwtAxios from "../../util/jwtUtil";
import LoadingSpinner from "../../components/common/loadingSpinner";
import { showErrorToast, showSuccessToast } from "../../util/toastUtil";
import { v4 as uuidv4 } from 'uuid';


const PaymentApprovePage = () => {
  
  const [searchParams] = useSearchParams();
  const [idempotencyKey, setIdempotencyKey] = useState(uuidv4());

  const orderId = searchParams.get("order_id");
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
        showErrorToast('결제 실패하였습니다.');
        history.back();
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
