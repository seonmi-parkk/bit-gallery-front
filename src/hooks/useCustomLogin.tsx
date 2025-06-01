import { useDispatch, useSelector } from "react-redux"
import {  type AppDispatch, type RootState } from "../store"
import { Navigate, useNavigate } from "react-router"
import { loginPostAsnyThunk, logout, save } from "../slices/loginSlices"
import { useEffect } from "react"
import { getCookie } from "../util/cookieUtil"

const useCustomLogin = () => {

  const dispatch = useDispatch<AppDispatch>()

  // 로그인 상태 객체
  const loginState = useSelector((state: RootState) => state.loginSlice)

  // 로그인 여부 
  const loginStatus = loginState.status //fulfilled, pending, rejected

  // 새로고침시 쿠키에서 로그인 정보 확인
  useEffect(()=>{
    if(!loginStatus) {
      const cookieData = getCookie("user")

      if(cookieData){
        dispatch(save(cookieData))
      }
    }
  }, [])

  const navigate = useNavigate()
  const doLogin = async(email:string, password:string)=>{
    dispatch(loginPostAsnyThunk({email,password}))
  }

  // 로그아웃
  const doLogout = () => {
    dispatch(logout(null))
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

  return {loginState, loginStatus, doLogin, doLogout, moveToLogin, moveToLoginReturn, moveToPath}

}
export default useCustomLogin