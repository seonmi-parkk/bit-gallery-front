import { useSignupStore } from "../../../zstore/useSignupStore";
import { useState } from "react";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import useGlobalModalStore from "../../../zstore/useGlobalModalStore";
import GlobalModal from "../../../components/common/globalModal";
import { showErrorToast, showSuccessToast } from "../../../util/toastUtil";
import axios from "axios";
import LoadingSpinner from "../../../components/common/loadingSpinner";


const EmailStep = () => {

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const {form, updateForm, nextStep, prevStep} = useSignupStore();

  const [email, setEmail] = useState<string>(form.email);

  const [verificationCode, setVerificationCode] = useState<string>();

  const {open:OpenGlobalModal, close:CloseGlobalModal} = useGlobalModalStore()

  // 로딩 상태
  const [loading, setLoading] = useState(false);

  // 이메일 유효성 검증
  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSend = async() => {
    // 이메일을 입력하지 않은 경우
    if (email == '') {
      showErrorToast('이메일을 입력해주세요.');
      return;
    }

    // 이메일 유효성 검증
    if (!validateEmail(email)) {
      showErrorToast('올바른 형식의 이메일을 입력해주세요.');
      return;
    }

    // 로딩스피너 띄우기
    setLoading(true);

    try {
      const res = await axios.post(
        `${apiUrl}/user/email-verification`, 
        {'email' : email}
      )

      // 성공 응답의 경우
      if (res.data.code === 200) {
        // 모달 띄우기
        OpenGlobalModal({
          message: '인증 이메일이 전송되었습니다. 인증 코드 확인 후 입력해주세요.',
          confirmText: '확인',
          onConfirm: () => CloseGlobalModal(),
        })
      } 
    } catch (err: unknown) {
      let errorMessage = '인증 메일 발송에 실패하였습니다.';

      if (axios.isAxiosError(err)) {
        const rawMessage = err.response?.data?.message;

        // message가 유효성 검증 실패인 경우(@Valid)
        if (rawMessage == "유효성 검증 실패") {
          const messages = Object.values(err.response?.data?.data);
          if (Array.isArray(messages) && typeof messages[0] === "string") {
            errorMessage = messages[0];
          }

        // message가 문자열인 경우(다른 예외)
        } else {
          errorMessage = rawMessage;
        }
      }

      showErrorToast(errorMessage);
    } finally {
      setLoading(false); // 로딩 스피너 없애기 
    }

  };

  const handleVerify = async() => {
    
    // 이메일을 입력하지 않은 경우
    if (email == '' || verificationCode == '') {
      showErrorToast('이메일을 입력해주세요.');
      return;
    }

    // 이메일 유효성 검증
    if (!validateEmail(email)) {
      showErrorToast('올바른 형식의 이메일을 입력해주세요.');
      return;
    }

    // 인증코드 확인 요청
    try {
      const res = await axios.post(
        `${apiUrl}/user/email-verification/verify`, 
        {
          'email' : email,
          'code' : verificationCode
        }
      )

      // 성공 응답의 경우
      if (res.data.code === 200) {
        showSuccessToast('이메일 인증에 성공하였습니다.');
        // 내용 저장
        updateForm({ email, emailVerified: true });
        // 다음 단계로 넘어가기
        nextStep();

        // 인증코드가 다르거나 만료된 경우
      } if (res.data.code !== 200) {
        const errorMessage = res.data.message;
        showErrorToast(errorMessage);
      }
    } catch (err: unknown) {
      // 기타 에러
      let errorMessage = '이메일 인증에 실패하였습니다.';

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message;
      }

      showErrorToast(errorMessage);
    }

    
  };

  return (
    <>
      <div>
        <div className="flex justify-center gap-3 my-6">
          <input type="email" 
            value={email} 
            onChange={(e) => {setEmail(e.target.value); updateForm({ emailVerified: false })}} 
            placeholder="이메일" 
            className="flex-1"
          />
          <button
            onClick={handleSend}
            className="rounded p-2 w-28 bg-main-3 text-white"
          >
            인증 메일 발송
          </button>
        </div>
        <div className="flex justify-center gap-3 my-6">
          <input type="text" 
            value={verificationCode} 
            onChange={(e) => setVerificationCode(e.target.value)} 
            placeholder="인증코드" 
            className="flex-1"
          />
          <button 
            onClick={handleVerify}
            className="rounded p-2 w-28 bg-main-3 text-white"
          >
            인증
          </button>
        </div>

        <div className="flex justify-center gap-4 m-auto mt-16">
          <button onClick={prevStep} className="flex items-center gap-2 rounded p-2 pr-3 bg-main-3 text-white">
            <IoIosArrowBack />
            이전으로
          </button>
          {form.emailVerified &&
            <button onClick={nextStep} className="flex items-center gap-2 rounded p-2 pl-3 btn-blue text-white">
              다음으로
              <IoIosArrowForward />
            </button>
          }
        </div>
      </div>

      {/* 로딩 중인 경우 로딩 스피너 띄우기 */}
      {loading && <LoadingSpinner />}
      
      {/* 모달 */}
      <GlobalModal/>
    </>
  )
}

export default EmailStep