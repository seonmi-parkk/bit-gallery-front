import axios from "axios";
import { showErrorToast, showInfoToast } from "../../../util/toastUtil";
import { useSignupStore } from "../../../zstore/useSignupStore";
import { useState, type ChangeEvent } from "react";
import PasswordValidator from "../../../components/user/passwordVaildator";
import { usePasswordValidator } from "../../../hooks/usePasswordValidator";
import { IoIosArrowBack } from "react-icons/io";


const UserInfoStep = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  
  const {form, updateForm, reset, prevStep, nextStep, step} = useSignupStore();
  const [nickname, setNickname] = useState(form.nickname);

  // 비밀번호 유효성 검사
  const passwordValidator = usePasswordValidator();
  const {newPassword} = passwordValidator;

  // 닉네임 input 변경
  const handleNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    updateForm({ nickname, nicknameVaildated: false });
  };

  // 닉네임 중복체크
  const checkNickname = async() => {
    // 닉네임을 입력하지 않았거나 기존 닉네임과 동일한 경우
    if(nickname === ''){
      showErrorToast('변경할 닉네임을 입력해주세요.');
      return;
    }

    try {
      const res = await axios.get(`${apiUrl}/user/check-nickname?`, {
        params: {
          'nickname' : nickname
        }
      });

      if (res.data.code === 200) {
        // 중복아닌 경우
        if(!res.data.data.isDuplicate){
          updateForm({ nickname, nicknameVaildated: true });
        } else {
          showErrorToast('이미 사용중인 닉네임입니다.');
        }
      }
    } catch (err: unknown) {
      let errorMessage = '닉네임 중복체크 요청에 실패하였습니다. 잠시후 다시 시도해 주세요.';
      showErrorToast(errorMessage);
    }
  }

  const handleSignup = async () => {
    // 비밀번호 유효성 검사 
    if (!passwordValidator.isValid()) {
      showErrorToast('비밀번호가 조건을 모두 만족하지 않습니다. 각 항목을 확인해 주세요.');
      return;
    }

    // 닉네임 중복체크 진행 여부 체크
    if (!form.nicknameVaildated) {
      showErrorToast('닉네임 중복 체크를 진행해주세요.');
      return;
    }

    // 이메일 인증 여부 체크
    if (!form.emailVerified) {
      showErrorToast("step1의 이메일 인증을 먼저 완료해주세요.");
      return;
    }

    updateForm({ password : newPassword, passwordValidated: true });

    // 회원가입 api 요청
    try {
      const res = await axios.post(`${apiUrl}/user/signup`, {
        'email' : form.email,
        'password' : form.password,
        'nickname' : form.nickname
      });

      // 성공시
      if (res.data.code === 200) {
        showInfoToast("회원가입 완료되었습니다.");
        console.log('step : ', step)
        nextStep();
        console.log('[후]step : ', step)
        reset(); // 상태 초기화
      }
    } catch (err: unknown) {
      let errorMessage = '회원가입에 실패했습니다.';
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message;

        // message가 유효성 검증 실패인 경우(@Valid)
        if (errorMessage == "유효성 검증 실패") {
          const messages = Object.values(err.response?.data?.data);
          if (Array.isArray(messages) && typeof messages[0] === "string") {
            errorMessage = messages[0];
          }
        }
      }

      showErrorToast(errorMessage);
    }
  
  };

  return (
    <>
      <div className="text-left"> 
        <label htmlFor="nickname" className="block mb-1">닉네임</label>
        <div className="flex items-start">
          <div className="flex-1">
            <input
                type="text" name="nickname"
                value={nickname}
                onChange={handleNicknameChange}
                className="w-full border rounded px-4 py-2 mb-1"
                placeholder="닉네임" 
              />
              {!form.nicknameVaildated ?
                <p className="text-red-500">중복 체크를 진행해주세요.</p>
                : <p className="text-green-600">사용가능한 닉네임입니다.</p>
              }
          </div>
          <button
            type="button"
            className="shrink-0 rounded p-1.5 w-18 ml-2 py-2.5 bg-main-3"
            onClick={checkNickname}
          >
            중복 체크
          </button>
        </div>
      </div>

      <div className="flex gap-2 py-2 text-left">
        <PasswordValidator validator={passwordValidator}/>  
      </div>
        
      <div className="flex justify-center gap-4 m-auto mt-16">
        <button onClick={prevStep} className="flex items-center gap-2 rounded p-2 pr-3 bg-main-3 text-white">
          <IoIosArrowBack />
          이전으로
        </button>
        <button className="text-lg btn-blue rounded py-2 px-4 bg-main-3 text-white" onClick={handleSignup}>회원가입</button>
      </div>

    </>
  );
}

export default UserInfoStep