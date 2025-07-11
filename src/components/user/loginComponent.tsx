import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (loginStatus === 'error') {
      showErrorToast('아이디 혹은 비밀번호를 확인하세요.');
    }
  }, [loginStatus]);

  return (
    <div className="w-full mt-10 m-2 px-16 pt-16 pb-18 bg-main-2 rounded-xl">
      {loginStatus === 'fulfilled' && <ResultModal message="로그인 되었습니다." confirmText="닫기" onConfirm={closeModal}/>}
      <div className="flex justify-center">
        <div className="text-4xl m-4 p-4 font-extrabold text-blue-500">LOGIN</div>
      </div>
      <div className="flex justify-center">
        <div className="relative mb-6 flex w-full flex-wrap items-stretch">
          <div className="mb-2 font-medium">Email</div>
          <input className="w-full p-4 rounded-r border border-solid border-main-4 shadow-md"
            name="email" type={'text'} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative mb-6 flex w-full flex-wrap items-stretch">
          <div className="mb-2 font-medium">Password</div>
          <input className="w-full p-4 rounded-r border border-solid border-main-4 shadow-md"
            name="password" type={'password'} onChange={(e) => setPassword(e.target.value)} />
        </div>
      </div>

      <div className="text-center">
        <div className="flex gap-6 max-w-[260px] items-stretch m-auto mt-10 justify-center text-lg ">
          <button type='submit'
            className="w-1/2 px-2 py-3 text-center font-medium text-white bg-blue-500 rounded"
            onClick={() => handleLogin()}>
            LOGIN
          </button>
          <div className="w-1/2">
            <KakaoLoginComponent/>
          </div>
        </div>
        <a href='/user/signup'
          className="inline-block mt-8 p-3 text-lg font-medium">
          <span className="border-b-1">회원가입</span>
        </a>
      </div>

    </div>
  )
}

export default LoginComponent