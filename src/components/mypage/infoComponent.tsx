import { useQuery } from "@tanstack/react-query"
import useCustomLogin from "../../hooks/useCustomLogin"
import jwtAxios from "../../util/jwtUtil";
import LoadingSpinner from "../common/loadingSpinner";
import React, { useState, useCallback, useRef, useEffect, type ChangeEvent } from 'react';
import ProfileImageCropper from "../common/ProfileImageCropper";
import PasswordValidator from "../user/passwordVaildator";
import axios, { AxiosError } from "axios";
import { showErrorToast, showSuccessToast } from "../../util/toastUtil";
import { usePasswordValidator } from "../../hooks/usePasswordValidator";


const InfoComponent = () => {

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const imageUrl = `${apiUrl}/upload/profile/`;
  const defaultProfile = import.meta.env.VITE_DEFAULT_PROFILE;
  
  const {loginState, updateUserInfo} = useCustomLogin(); 
  const email = loginState.email

  const [currentPassword, setCurrentPassword] = useState('');

  // 비밀번호 변경 중
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);

  // 비밀번호 유효성 검사
  const passwordValidator = usePasswordValidator();
  const {hasTwoTypes, isLengthValid, hasNoRepeatedChars, changeTextColor} = passwordValidator;

  // 닉네임 변경 중
  const [isChangingNickname, setIsChangingNickname] = useState<boolean>(false);
  const [nicknameInput, setNicknameInput] = useState<string>(''); 
  // 닉네임 유효성검사 여부
  const [nicknameValid, setNicknameValid] = useState<boolean>(false);

  // 프로필 이미지 변경 중
  const [isChangingProfile, setIsChangingProfile] = useState<boolean>(false);

  // 기본 프로필 이미지 
  const defaultProfileUrl = imageUrl+defaultProfile;

  // 프로필 이미지 미리보기
  const [previewImage, setPreviewImage] = useState<string>(defaultProfileUrl);
  // 변경 프로필 이미지 파일
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  // 유저 정보 가져오기
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ['mypage/info', email],
    queryFn: async () => {
      const res = await jwtAxios.get(`${apiUrl}/user`)
      return res.data.data;
    },
    staleTime: 1000 * 60 * 10
  })

  // 유저 정보 셋팅
  useEffect(() => {
    if (data) {
      setPreviewImage(data.profileImage ? imageUrl + data.profileImage : defaultProfileUrl);
    }
  }, [data]);

  // 기본 프로필 이미지로 초기화
  const initializeProfile = () => {
    const profileImgEl = document.getElementById('profileImg') as HTMLImageElement;
    if (profileImgEl) {
      console.log("imgurl:", defaultProfileUrl);
      profileImgEl.src = defaultProfileUrl;
    };
  }

  // 수정 버튼 클릭 시 서버 값으로 초기화
  const startNicknameChange = () => {
    if (data) {
      setNicknameInput(data.nickname); // 서버 닉네임으로 초기화
      setIsChangingNickname(true);
    }
  };

  // 닉네임 input 변경
  const handleNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNicknameInput(e.target.value);
    setNicknameValid(false);
  };

  // 프로필 이미지 수정 요청
  const RequestChangeProfileImage = async () => {
    if (!profileImageFile && !previewImage) return;

    const formData = new FormData();
    // 이미지 첨부한 경우
    if(profileImageFile){
      formData.append("file", profileImageFile);
    }
    // 기본이미지로 초기화한 경우
    if(previewImage === defaultProfileUrl) {
      formData.append("isDefault", "true");
    }

    try {
      const res = await jwtAxios.patch(`${apiUrl}/user/profile`, formData);

      if (res.data.code === 200) {
        // store에 저장된 프로필 이미지 변경
        updateUserInfo({profileImage: res.data.data})
        showSuccessToast("프로필 이미지가 변경되었습니다.");
        setIsChangingProfile(false);
      } else {
        showErrorToast("프로필 이미지 변경 실패하였습니다.");
      }
    } catch (err) {
      showErrorToast("변경 처리 중 에러가 발생했습니다.");
    }
  }

  // 비밀변호 변경 요청
  const requestChangePassword = async () => {
    if (!passwordValidator.isValid()) {
      showErrorToast('비밀번호가 조건을 모두 만족하지 않습니다. 각 항목을 확인해 주세요.');
      return;
    }

    try {
      const res = await jwtAxios.patch(`${apiUrl}/user/password`, {
        currentPassword,
        newPassword: passwordValidator.newPassword,
      });

      if (res.data.code === 200) {
        showSuccessToast('비밀번호가 변경되었습니다.');
        setIsChangingPassword(false);
      } 
    } catch (err: unknown) {
      let errorMessage = '비밀번호 변경 중 오류가 발생했습니다.';

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
    }
  };

  // 닉네임 중복체크
  const checkNickname = async() => {
    // 닉네임을 입력하지 않았거나 기존 닉네임과 동일한 경우
    if(nicknameInput === '' || nicknameInput === data.nickname){
      showErrorToast('변경할 닉네임을 입력해주세요.');
      return;
    }

    try {
      const res = await jwtAxios.get(`${apiUrl}/user/check-nickname?`, {
        params: {
          nickname : nicknameInput
        }
      });

      if (res.data.code === 200) {
        // 중복아닌 경우
        if(!res.data.data.isDuplicate){
          setNicknameValid(true);
        } else {
          showErrorToast('이미 사용중인 닉네임입니다.');
        }
      }
    } catch (err: unknown) {
      let errorMessage = '닉네임 중복체크 요청에 실패하였습니다. 잠시후 다시 시도해 주세요.';
      showErrorToast(errorMessage);
    }
  }

  // 닉네임 변경 요청
  const changeNickname = async() => {
    // 중복체크를 진행하지 않은 경우
    if(!nicknameValid) {
      showErrorToast('닉네임 중복체크를 진행해주세요.');
      return;
    }

    try {
      const res = await jwtAxios.patch(`${apiUrl}/user/nickname`, {
        nickname : nicknameInput
      });
    
      if (res.data.code === 200) {
        // store에 저장된 유저 닉네임 변경
        updateUserInfo({nickname: res.data.data})
        showSuccessToast('닉네임 변경이 완료되었습니다.');
        setIsChangingNickname(false);
        await refetch(); // 서버에서 다시 데이터 가져오기
      }
    } catch(err: unknown){
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message;
        if(errorMessage){
          showErrorToast(errorMessage);
        }
      } else {
        showErrorToast('닉네임 변경에 실패하였습니다. 잠시 후 다시 시도해주세요.')
      }
    }
  }



  return (
    <div className="max-w-3xl mx-auto my-6 px-2">
      {isPending && <LoadingSpinner />}
      
      {data && 
        <div className="">
          <form>

            <div className="flex items-start gap-2 py-2">
              <label htmlFor="nickname" className="w-16 font-medium">이미지</label>
              <img 
                id="profileImg" 
                className='w-40 h-40 mb-6 object-cover rounded-full' 
                src={previewImage} 
                alt="프로필 이미지"
              />

              <ProfileImageCropper 
                completedImage={(preview: string, file: File) => {
                  setPreviewImage(preview);
                  setProfileImageFile(file);
                }}
                setIsChangingProfile = {setIsChangingProfile}
              />

              {isChangingProfile && 
                <>
                  <button
                    type="button"
                    className="rounded p-1.5 w-18 bg-main-3 border-main-3 border"
                    onClick={()=> {
                      setPreviewImage(defaultProfileUrl);
                      initializeProfile();
                    }}
                  >
                    초기화
                  </button>

                  <button
                    type="button"
                    className="rounded p-1.5 w-18 bg-main-3 border-main-3 border"
                    onClick={()=> {
                      setPreviewImage(data.profileImage ? imageUrl + data.profileImage : defaultProfileUrl);
                      initializeProfile();
                      setIsChangingProfile(false);
                    }}
                  >
                    취소
                  </button>

                  <button
                    type="button"
                    className="btn-blue rounded p-1.5 w-18"
                    onClick={RequestChangeProfileImage}
                  >
                    저장
                  </button>
                </>
              }

            </div>

            <div className="flex items-center gap-2 py-2">
              <label htmlFor="email" className="w-16 font-medium">이메일</label>
              <p className="flex-1 max-w-[220px] my-2 mx-2">{data.email}</p>
            </div>

            <div className="flex gap-2 py-2">
              <label htmlFor="nickname" className="w-16 mt-2 font-medium">닉네임</label>
              {!isChangingNickname ?
                (
                  <>
                    <p className="flex-1 max-w-[220px] my-2 mx-2">{data.nickname}</p>
                    <button
                      type="button"
                      className="rounded p-2 w-22 text-lg bg-main-3 text-white"
                      onClick={startNicknameChange}
                    >
                      수정
                    </button>
                  </>
                ) 
                :( 
                  <div className="flex-1">
                    <div className="flex items-baseline">
                      <div className="flex-1">
                        <input
                          type="text" name="nickname"
                          value={nicknameInput}
                          onChange={handleNicknameChange}
                          className="w-full border rounded px-4 py-2 mb-1"
                        />
                        {!nicknameValid ?
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
                  
                    <div className="flex justify-end gap-2 mt-2 mb-4">
                      <button
                        type="button"
                        className="rounded p-1.5 w-18 bg-main-3"
                        onClick={changeNickname}
                      >
                        변경
                      </button>
                      <button
                        type="button"
                        className="rounded  p-1.5 w-18 border border-main-3"
                        onClick={() => setIsChangingNickname(false)}
                      >
                        취소
                      </button>
                    </div> 
                  </div>
                )
              }
              
            </div>

            <div className="flex gap-2 py-2">
              <label htmlFor="nickname" className="w-16 mt-2 font-medium">비밀번호</label>
              
              {!isChangingPassword ? 
              (
                <div className="flex flex-1 items-center gap-2">
                  <p className="flex-1 max-w-[220px] my-2 mx-2">*********</p>
                  <button
                    type="button"
                    className="rounded p-2 w-22 text-lg bg-main-3 text-white"
                    onClick={() => setIsChangingPassword(true)}
                  >
                    수정
                  </button>
                </div>
              ) : 
              (
                <div className="flex-1">
                  
                  <div className="mt-2 mb-6">
                    <label htmlFor="currentPassword" className="block mb-1">현재 비밀번호</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={currentPassword}
                      onChange={(e) => {setCurrentPassword(e.target.value)}}
                      className="w-full border rounded px-4 py-2 mb-1"
                      placeholder="현재 비밀번호"
                    />

                    {/* 비밀번호 유효성에 따른 문구 및 폰트 컬러 변경 */}
                    <p className={`text-sm 
                      ${changeTextColor(currentPassword, 
                        hasTwoTypes(currentPassword) 
                        && isLengthValid(currentPassword) 
                        && hasNoRepeatedChars(currentPassword)
                      )}`
                    }>
                      {currentPassword === ''
                        ? '✔️ '
                        : hasTwoTypes(currentPassword) 
                          && isLengthValid(currentPassword) 
                          && hasNoRepeatedChars(currentPassword)
                        ? '✔️ '
                        : '❌   '}
                        확인을 위해 현재 비밀번호를 입력해 주세요.
                    </p>
                  </div>

                  <PasswordValidator validator={passwordValidator}/>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      className="rounded p-1.5 w-18 bg-main-3"
                      onClick={() => requestChangePassword()}
                    >
                      변경
                    </button>
                    <button
                      type="button"
                      className="rounded  p-1.5 w-18 border border-main-3"
                      onClick={() => setIsChangingPassword(false)}
                    >
                      취소
                    </button>
                  </div>
                </div>
              )}
            </div>

          </form>
        </div>
      }

    </div>
  )
}

export default InfoComponent