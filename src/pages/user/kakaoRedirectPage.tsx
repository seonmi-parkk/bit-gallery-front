import { useEffect } from "react"
import { Navigate, useNavigate, useSearchParams } from "react-router"
import axios from "axios"
import useLoginStore from "../../zstore/useLoginStore"


const KakaoRedirectPage = () => {

  const {save} = useLoginStore()

  const [searchParams] = useSearchParams();
  const authCode = searchParams.get("code")

  const navigate = useNavigate();

  useEffect(() => {
    if (!authCode) return;
    
    // 백엔드로 인가 코드 전달
    axios.post("http://localhost:8080/user/auth/kakao", { 'authCode': authCode })
      .then((result) => {
        const resultData = result.data.data;
        save(resultData);

        if (resultData.isSocial) {
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