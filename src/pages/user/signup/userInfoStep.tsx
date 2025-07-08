import { useSignupStore } from "../../../zstore/useSignupStore";
import { useState } from "react";


const UserInfoStep = () => {
  const { form, updateForm, reset, prevStep } = useSignupStore();
  const [nickname, setNickname] = useState(form.nickname);
  const [password, setPassword] = useState(form.password);

  const handleSignup = async () => {
    if (!form.phoneVerified || !form.emailVerified) {
      alert("이메일/휴대폰 인증을 먼저 완료해주세요.");
      return;
    }

    updateForm({ nickname, password });

    const finalData = {
      ...form,
      nickname,
      password,
    };

    console.log("회원가입 요청 데이터", finalData);

    // 회원가입 api 요청

    alert("회원가입 완료!");
    reset(); // 상태 초기화
  };

  return (
    <div>
      <h2>정보 입력</h2>
      <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="닉네임" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" />
      <button onClick={prevStep}>← 이전</button>
      <button className="rounded p-2 w-22 text-lg bg-main-3 text-white" onClick={handleSignup}>회원가입 완료</button>
    </div>
  );
}

export default UserInfoStep