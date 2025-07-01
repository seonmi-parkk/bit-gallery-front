import { useQuery } from "@tanstack/react-query"
import useCustomLogin from "../../hooks/useCustomLogin"
import jwtAxios from "../../util/jwtUtil";
import LoadingSpinner from "../common/loadingSpinner";
import React, { useState, useCallback, useRef } from 'react';
import ProfileImageCropper from "../common/ProfileImageCropper";
import PasswordValidator from "../user/passwordVaildator";
import axios, { AxiosError } from "axios";
import { showErrorToast, showSuccessToast } from "../../util/toastUtil";


const InfoComponent = () => {

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const imageUrl = `${apiUrl}/upload/profile/`;
  const defaultProfile = import.meta.env.VITE_DEFAULT_PROFILE;
  
  const {loginState, updateUserInfo} = useCustomLogin(); 
  const email = loginState.email

  const { data, isPending, error } = useQuery({
    queryKey: ['mypage/info', email],
    queryFn: async () => {
      const res = await jwtAxios.get(`${apiUrl}/user`)
      return res.data.data
    },
    staleTime: 1000 * 60 * 10
  })

  // 비밀번호
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // PasswordValidator 내부 상태를 참조하기 위한 ref
  const passwordValidatorRef = useRef<{ 
    isValid: () => boolean; 
    getPasswords: () => { currentPassword: string, newPassword: string } 
  }>(null);


  // 기본 프로필 이미지 
  const defaultProfileUrl = imageUrl+defaultProfile;

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  // 기본 프로필 이미지로 초기화
  const initializeProfile = () => {
    const profileImgEl = document.getElementById('profileImg') as HTMLImageElement;
    if (profileImgEl) {
      console.log("imgurl:", defaultProfileUrl);
      profileImgEl.src = defaultProfileUrl;
    };
  }

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
        alert("프로필 이미지가 변경되었습니다.");
      } else {
        alert("프로필 이미지 변경 실패하였습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("변경 처리 중 에러가 발생했습니다.");
    }
  };

  // 비밀변호 변경 요청
  const requestChangePassword = async () => {
  if (!passwordValidatorRef.current) return;

  const { currentPassword, newPassword } = passwordValidatorRef.current.getPasswords();
  console.log("왜왜왜ㅗ애ㅙ");

  try {
    const res = await jwtAxios.patch(`${apiUrl}/user/password`, {
      currentPassword,
      newPassword,
    });

    if (res.data.code === 200) {
      showSuccessToast('비밀번호가 변경되었습니다.');
      setIsChangingPassword(false);
    } 
  } catch (err: unknown) {
    let errorMessage = '비밀번호 변경 중 오류가 발생했습니다.';
    if (axios.isAxiosError(err)) {
       const rawMessage = err.response?.data?.message;
      console.log('rawMessage: ',rawMessage)
      // message가 객체인 경우(@Valid)
      if (rawMessage == "유효성 검증 실패") {
        const messages = Object.values(err.response?.data?.data);
        if (Array.isArray(messages) && typeof messages[0] === "string") {
          errorMessage = messages[0];
        }

      // message가 문자열인 경우(다른 예외)
      } else if (typeof rawMessage === "string") {
        errorMessage = rawMessage;
      }
    }

    showErrorToast(errorMessage);
  }
};



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
                src={previewImage || (data.profileImage != null ? imageUrl+data.profileImage : defaultProfileUrl)} 
                alt="프로필 이미지"
              />

              <ProfileImageCropper 
                completedImage={(preview: string, file: File) => {
                  setPreviewImage(preview);
                  setProfileImageFile(file);
                }} 
              />

              {previewImage && 
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
                      setPreviewImage('');
                      initializeProfile();
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
              <label htmlFor="nickname" className="w-16 font-medium">이메일</label>
              <input type="text" name="nickname" value={data.email}
                className="w-[calc(100%-70px)]"
              />
            </div>

            <div className="flex items-center gap-2 py-2">
              <label htmlFor="nickname" className="w-16 font-medium">닉네임</label>
              <input type="text" name="nickname" value={data.nickname}
                className="flex-1"
              />
            </div>

            <div className="flex gap-2 py-2">
              <label htmlFor="nickname" className="w-16 mt-2 font-medium">비밀번호</label>
              
              {!isChangingPassword ? 
              (
                <div className="flex items-center gap-2">
                  <input type="password" value="*********" readOnly className="flex-1" />
                  <button
                    type="button"
                    className="rounded p-2 w-22 text-lg bg-blue-500 text-white"
                    onClick={() => setIsChangingPassword(true)}
                  >
                    수정
                  </button>
                </div>
              ) : 
              (
                <div className="flex-1">
                  <PasswordValidator ref={passwordValidatorRef}/>
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