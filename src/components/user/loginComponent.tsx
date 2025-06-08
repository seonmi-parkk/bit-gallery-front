import { useState } from "react";
import ResultModal from "../common/resultModal";
import useCustomLogin from "../../hooks/useCustomLogin";
import KakaoLoginComponent from "./kakaoLoginComponent";
import { showErrorToast } from "../../util/toastUtil";

interface LoginResult {
  email: string,
  signed: boolean
}

const initState: LoginResult = {
  email: '',
  signed: false
}

const LoginComponent = () => {

  const {doLogin, loginStatus, moveToPath} = useCustomLogin()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const handleLogin = () => {
    doLogin(email,password)
  }
  
  const closeModal = () => {
    moveToPath("/")
  }


  return (
    <div className="w-full border  mt-10 m-2 px-16 py-10">
      {loginStatus === 'fulfilled' && <ResultModal message="로그인 되었습니다." confirmText="닫기" onConfirm={closeModal}/>}
      {loginStatus === 'error' && showErrorToast('아이디 혹은 비밀번호를 확인하세요.')}
      <div className="flex justify-center">
        <div className="text-4xl m-4 p-4 font-extrabold text-blue-500">LOGIN</div>
      </div>
      <div className="flex justify-center">
        <div className="relative mb-6 flex w-full flex-wrap items-stretch">
          <div className="mb-2 font-medium">Email</div>
          <input className="w-full p-4 rounded-r border border-solid border-neutral-500 shadow-md"
            name="email" type={'text'} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative mb-6 flex w-full flex-wrap items-stretch">
          <div className="mb-2 font-medium">Password</div>
          <input className="w-full p-4 rounded-r border border-solid border-neutral-500 shadow-md"
            name="password" type={'password'} onChange={(e) => setPassword(e.target.value)} />
        </div>
      </div>
      <div className="flex gap-6 mt-10 justify-center">
        <button type='submit'
          className="px-2 py-4 text-lg text-center font-medium w-34 text-white bg-blue-500 rounded"
          onClick={() => handleLogin()}>
          LOGIN
        </button>
        <KakaoLoginComponent/>
      </div>
    </div>
  )
}

export default LoginComponent