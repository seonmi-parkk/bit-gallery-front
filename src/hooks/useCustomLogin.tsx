import { Navigate, useNavigate } from "react-router"
import { useEffect } from "react"
import { getCookie } from "../util/cookieUtil"
import { logoutPost } from "../api/userApi"
import useLoginStore from "../zstore/useLoginStore"


const useCustomLogin = () => {

  const {user, status, login, logout, save} = useLoginStore()

  // 로그인 상태 객체
  const loginState = user

  // 로그인 여부 
  const loginStatus = status

  // 새로고침시 쿠키에서 로그인 정보 확인
  useEffect(()=>{
    if(!loginStatus) {
      const cookieData = getCookie("user")

      if(cookieData){
        save(cookieData)
      }
    }
  }, [])

  const navigate = useNavigate()
  const doLogin = async(email:string, password:string)=>{
    login(email, password)
  }

  // 로그아웃
  const doLogout = () => {
    logoutPost().then(() => {
      logout()
      navigate("/")
    })
  }

  // 클릭이벤트 등에서 사용
  const moveToLogin = () => {
    navigate("/user/login")
  }

  // 컴포넌트 렌더링시 조건부 리다이렉트
  const moveToLoginReturn = () => {
    return <Navigate replace to="/user/login"></Navigate>
  }

  // 페이지 이동
  const moveToPath = (path:string) => {
    navigate({pathname: path}, {replace: true})
  }

  // 관리자 여부 확인
  

  return {loginState, loginStatus, doLogin, doLogout, moveToLogin, moveToLoginReturn, moveToPath}

}
export default useCustomLogin