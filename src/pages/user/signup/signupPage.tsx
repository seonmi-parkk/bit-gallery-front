import { useSignupStore } from "../../../zstore/useSignupStore";
import EmailStep from "./emailStep";
import UserInfoStep from "./userInfoStep";
import StepZero from "./stepZero";


const SignupPage = () => {
  const step = useSignupStore((state) => state.step);

  return (
    <div className="p-6 max-w-3xl m-auto text-center">
      <h3 className="text-4xl mb-10 p-4 font-extrabold">회원가입</h3>

        { step > 0 &&
          <div className="flex justify-center bg-main-2 rounded-full mb-16">
            <div className={`flex-1/3 px-12 py-1.5 rounded-full ${step === 1 ? 'bg-blue-600' : ''}`}>
              <p className="text-lg mb-0.5 opacity-70">step 1</p>
              <p className="font-medium text-sm">이메일 인증</p>
            </div>

            <div className={`flex-1/3 px-12 py-2 rounded-full ${step === 2 ? 'bg-blue-600' : ''}`}>
              <p className="text-xl mb-1 text-white-2">step 2</p>
              <p className="text-sm">정보 입력</p>
            </div>

            <div className={`flex-1/3 px-12 py-2 rounded-full ${step === 3 ? 'bg-blue-600' : ''}`}>
              <p className="text-xl mb-1 text-white-2">step 3</p>
              <p className="text-sm">가입 완료</p>
            </div>
          </div>
        }

      <div className="px-4 max-w-lg m-auto">
        {step === 0 && <StepZero/>}
        {step === 1 && <EmailStep/>}
        {step === 2 && <UserInfoStep/>}
      </div>
    </div>
  )
}

export default SignupPage