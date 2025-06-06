import { useActionState } from "react"
import useCustomLogin from "../../hooks/useCustomLogin"
import jwtAxios from "../../util/jwtUtil"
import PendingModal from "../common/pendingModal"
import ResultModal from "../common/resultModal"
import { useNavigate } from "react-router"

interface ModifyResult {
  resultCode: string,
  error: Record<string, string>
}

const initState = {
  resultCode: '',
  error: {global:''}
}

const modifyAction = async (state: ModifyResult, formData: FormData) => {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const nickname = formData.get('nickname') as string

  // if (password.length < 8) {
  //   return {resultCode: 400, error: {password: '패스워드는 8자 이상이어야 합니다.'}};
  // }

  try {
    const response = await jwtAxios.patch('http://localhost:8080/user/modify', { email, password, nickname });
    const result = response.data;
    console.log("response.code : ");
    console.log("response.data : ",result.data);
    return {resultCode: result.code, error: result.data}

  } catch (err: any) {
        console.log("err : ",err);
    return {resultCode: 400, error: {global: '수정 요청에 실패하였습니다. 잠시 후 다시 시도해주세요.'}};
  }
}

const ModifyComponent = () => {

  const { loginState, moveToLogin } = useCustomLogin()

  const [state, action, isPending] = useActionState(modifyAction, initState)

  const navigate = useNavigate()
  const closeModal = () => {
    navigate('/')
  }

  return (
    <div className="max-w-3xl mx-auto m-6 px-4">
      {isPending && <PendingModal />}
      {/* {state.error.global && <div className="bg-amber-500"> {state.error.global} </div>} */}
      {state.resultCode === 200 &&
        <ResultModal
          title="회원 정보 수정 결과 "
          content={`회원 정보가 수정되었습니다.`}
          callbackFn={closeModal} />
      }
      <form action={action}>
        <div className="mb-6">
          <div className="flex justify-center w-full flex-wrap items-center">
            <div className="w-[100px] p-2 font-bold">Email</div>
            <input className="flex-1 px-4 py-3 rounded-r border border-solid border-neutral-300 shadow-md"
              name="email"
              type={'text'}
              defaultValue={loginState.email}
              readOnly
              />
          </div>
          {state.error?.email && <p className="text-red-500 p-2">{state.error.email}</p>}
        </div>
        <div className="mb-6">
          <div className="flex justify-center w-full flex-wrap items-center">
            <div className="w-[100px] p-2 font-bold">Password</div>
            <input className="flex-1 px-4 py-3 rounded-r border border-solid border-neutral-300 shadow-md"
              name="password"
              type={'password'}
              />
          </div>
          {state.error?.password && <p className="text-red-500 p-2">{state.error.password}</p>}
        </div>
        <div className="mb-6">
          <div className="flex justify-center w-full flex-wrap items-center">
            <div className="w-[100px] p-2 font-bold">Nickname</div>
            <input className="flex-1 px-4 py-3 rounded-r border border-solid border-neutral-300 shadow-md"
              name="nickname"
              type={'text'}
              defaultValue={loginState.nickname}
              />
          </div>
          {state.error?.nickname && <p className="text-red-500 p-2">{state.error.nickname}</p>}
        </div>
        <div className="flex justify-center">
          <div className="relative mb-4 flex w-full flex-wrap justify-center">
            <button type="submit"
              className="rounded p-4 mt-4 text-xl w-32 text-white bg-blue-500"
            >
              Modify
            </button>
          </div>
        </div>
      </form>
    </div>


  )
}

export default ModifyComponent