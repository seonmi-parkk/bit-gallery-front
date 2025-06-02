import { useEffect } from "react"
import { Navigate, useNavigate, useSearchParams } from "react-router"

import { save } from "../../slices/loginSlices"
import axios from "axios"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../../store"

const KakaoRedirectPage = () => {

  const dispatch = useDispatch<AppDispatch>()

  const [searchParams] = useSearchParams();
  const authCode = searchParams.get("code")

  const navigate = useNavigate();

  useEffect(() => {
    if (!authCode) return;

    console.log("authCode:: ====",authCode)

    // 백엔드로 인가 코드 전달
    axios.post("http://localhost:8080/user/auth/kakao", { 'authCode': authCode })
      .then((result) => {
        dispatch(save(result.data));

        if (result.data.isSocial) {
          navigate('/user/modify');
        } else {
          navigate('/');
        }
      })
      .catch(() => {
        alert("카카오 로그인 실패하였습니다. 잠시 후 다시 시도해주세요.");
        navigate("/");
      });
  }, [authCode]);

  return (
    <Navigate to={'/'}/>
  )
}

export default KakaoRedirectPage