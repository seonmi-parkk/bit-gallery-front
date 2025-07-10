import { useSignupStore } from "../../../zstore/useSignupStore";
import KakaoLoginComponent from "../../../components/user/kakaoLoginComponent";


const StepZero = () => {

  const {nextStep} = useSignupStore();

  return (
    <div className="max-w-[400px] flex justify-center gap-6 max-xl m-auto text-xl">
      <div className="flex flex-1/2 justify-center items-center py-8 bg-main-3 rounded"
        onClick={nextStep}>
        <span>일반 회원 가입</span>
      </div>
      <div className="flex-1/2">
        <KakaoLoginComponent/>
      </div>
    </div>
  )
}

export default StepZero