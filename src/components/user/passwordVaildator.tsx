import React, { forwardRef, useImperativeHandle, useState } from "react";


const PasswordValidator = forwardRef((_, ref) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isLengthValid = (value:string) => { 
    return value.length >= 8 && value.length <= 20
  };

  const hasTwoTypes = (value:string) => {
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
    return [hasLetter, hasNumber, hasSpecial].filter(Boolean).length >= 2;
  };

  const hasNoRepeatedChars = (value:string) => {
    return !/(.)\1\1/.test(value);
  }

  const isPasswordConfirmed = (newPassword && confirmPassword && newPassword === confirmPassword) ? true : false;


  useImperativeHandle(ref, () => ({
    isValid: () => (
      currentPassword && hasTwoTypes(currentPassword) && isLengthValid(currentPassword) && hasNoRepeatedChars(currentPassword) &&
      newPassword && hasTwoTypes(newPassword) && isLengthValid(newPassword) && hasNoRepeatedChars(newPassword) &&
      isPasswordConfirmed
    ),
    getPasswords: () => ({ currentPassword, newPassword })
  }));

  // 유효성 체크에 따른 색상 변경
  const changeTextColor = (value:string, isValid: boolean) => {
    // 입력 전
    if (!value) return "text-gray-400"; 
    // 입력 후
    return isValid ? "text-green-600" : "text-red-500"; 
  };

  return (
    <div className=" text-gray-600">
      
      <div className="my-4">
        <label htmlFor="currentPassword" className="block mb-1">현재 비밀번호</label>
        <input
          type="currentPassword"
          value={currentPassword}
          onChange={(e) => {setCurrentPassword(e.target.value)}}
          className="w-full border rounded px-4 py-2 mb-1"
          placeholder="현재 비밀번호"
        />
        <p className={`text-sm ${changeTextColor(currentPassword, hasTwoTypes(currentPassword) && isLengthValid(currentPassword) && hasNoRepeatedChars(currentPassword))}`}>
          {currentPassword === ''
            ? '✔️ '
            : hasTwoTypes(currentPassword) && isLengthValid(currentPassword) && hasNoRepeatedChars(currentPassword)
            ? '✔️ '
            : '❌   '}
            확인을 위해 현재 비밀번호를 입력해 주세요.
        </p>
      </div>

      <div className="my-4">
        <label htmlFor="newPassword" className="block mb-1">새 비밀번호</label>
        <input
          type="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border rounded px-4 py-2 mb-2"
          placeholder="새 비밀번호"
        />

        <ul className="text-sm space-y-1 mb-4">
          <li className={changeTextColor(newPassword, hasTwoTypes(newPassword))}>
            {newPassword == '' || hasTwoTypes(newPassword) ? '✔️' : '❌'} 영문/숫자/특수문자 중, 2가지 이상 포함
          </li>
          <li className={changeTextColor(newPassword, isLengthValid(newPassword))}>
            {newPassword == '' || isLengthValid(newPassword) ? '✔️' : '❌'} 8자 이상 20자 이하 입력 (공백 제외)
          </li>
          <li className={changeTextColor(newPassword, hasNoRepeatedChars(newPassword))}>
            {newPassword == '' || hasNoRepeatedChars(newPassword) ? '✔️' : '❌'} 연속 3자 이상 동일한 문자/숫자 제외
          </li>
        </ul>
      </div>

      <div className="my-4">
        <label htmlFor="checkPassword" className="block mb-1">새 비밀번호 확인</label>
        <input
          type="checkPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border rounded px-4 py-2 mb-1"
          placeholder="새 비밀번호 확인"
        />
        <p className={`text-sm ${changeTextColor(confirmPassword, isPasswordConfirmed)}`}>
          {confirmPassword === ''
            ? '✔️ 확인을 위해 새 비밀번호를 다시 입력해 주세요.'
            : isPasswordConfirmed
            ? '✔️ 비밀번호가 일치합니다.'
            : '❌ 비밀번호가 일치하지 않습니다.'}
        </p>
      </div>
      
    </div>
  );
});

export default PasswordValidator;
