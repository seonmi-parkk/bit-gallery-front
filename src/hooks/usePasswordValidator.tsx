import { useState } from "react";

// 비밀번호 유효성 검사
export const usePasswordValidator = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 길이 체크 (8자 이상 20자 이하)
  const isLengthValid = (value: string) => value.length >= 8 && value.length <= 20;

  // 영문, 숫자, 특수문자 중 2가지 이상 사용
  const hasTwoTypes = (value: string) => {
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
    return [hasLetter, hasNumber, hasSpecial].filter(Boolean).length >= 2;
  };

  // 동일 문자/숫자 연속 3번 이상 반복 불가
  const hasNoRepeatedChars = (value: string) => !/(.)\1\1/.test(value);

  // 비밀번호 확인
  const isPasswordConfirmed = newPassword !== "" && confirmPassword !== "" && newPassword === confirmPassword;

  // 유효성 검사 통과 여부
  const isValid = () =>
    newPassword &&
    hasTwoTypes(newPassword) &&
    isLengthValid(newPassword) &&
    hasNoRepeatedChars(newPassword) &&
    isPasswordConfirmed;

  // 유효성 체크 결과에 따른 텍스트 색상 변경
  const changeTextColor = (value: string, isValid: boolean) => {
    if (!value) return "text-gray-400";
    return isValid ? "text-green-600" : "text-red-500";
  };

  return {
    newPassword,
    confirmPassword,
    setNewPassword,
    setConfirmPassword,
    isLengthValid,
    hasTwoTypes,
    hasNoRepeatedChars,
    isPasswordConfirmed,
    isValid,
    changeTextColor,
  };
};
