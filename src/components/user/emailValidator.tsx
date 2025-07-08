import { useState } from "react";
import { useSignupStore } from "../../zstore/useSignupStore";

const EmailValidator = () => {


  const [verificationCode, setVerificationCode] = useState<string>('');

  const handleSend = () => {
    alert("이메일 인증 요청 완료");
  };

  const handleVerify = () => {
    // 성공시
    //updateForm({ email, emailVerified: true });
    //nextStep();
  };

  return (
    <div>
      <div className="my-6">
        <label htmlFor="email" className="text-left inline-block mb-2 font-medium">E-mail</label>
        <div className="flex items-center ">
          <input 
            type="email"
            name="email"
            //value={email} 
            //onChange={(e) => setEmail(e.target.value)} 
            placeholder="이메일"
            className="flex-1 mr-2 p-5 rounded-r"
          />
          {/* <p className={`text-sm ${changeTextColor(confirmPassword, isPasswordConfirmed)}`}>
            {confirmPassword === ''
              ? '✔️ 확인을 위해 새 비밀번호를 다시 입력해 주세요.'
              : isPasswordConfirmed
              ? '✔️ 비밀번호가 일치합니다.'
              : '❌ 비밀번호가 일치하지 않습니다.'}
          </p> */}
          <button 
            onClick={handleSend}
            className="rounded p-2 w-30 bg-main-3 border border-main-3 text-white"
          >인증 메일 발송</button>
        </div>
      </div>

      <div className="my-6">
        <label htmlFor="email" className="text-left inline-block mb-2 font-medium">인증번호</label>
        <div className="flex items-center ">
          <input 
            type="text"
            name="verificationCode"
            value={verificationCode} 
            onChange={(e) => setVerificationCode(e.target.value)} 
            placeholder="인증번호"
            className="flex-1 mr-2 p-5 rounded-r"
          />
          <button 
            onClick={handleVerify}
            className="rounded p-2 w-30 bg-main-3 border border-main-3 text-white"
          >인증</button>
        </div>
      </div>
    </div>
  )
}

export default EmailValidator