import { usePasswordValidator } from "../../hooks/usePasswordValidator";

interface Props {
  validator: ReturnType<typeof usePasswordValidator>;
}

const PasswordValidator = ({ validator }: Props) => {

  const {
    newPassword,
    confirmPassword,
    setNewPassword,
    setConfirmPassword,
    hasTwoTypes,
    isLengthValid,
    hasNoRepeatedChars,
    isPasswordConfirmed,
    changeTextColor,
  } = validator;


  return (
    <div className=" text-gray-600">

      <div className="mt-2 mb-6">
        <label htmlFor="newPassword" className="block mb-1">새 비밀번호</label>
        <input
          type="password"
          name="newPassword"
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

      <div className="mt-2 mb-6">
        <label htmlFor="checkPassword" className="block mb-1">새 비밀번호 확인</label>
        <input
          type="password"
          name="checkPassword"
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
}

export default PasswordValidator;
