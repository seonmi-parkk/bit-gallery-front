import { useQuery } from "@tanstack/react-query"
import useCustomLogin from "../../hooks/useCustomLogin"
import jwtAxios from "../../util/jwtUtil";
import LoadingSpinner from "../common/loadingSpinner";
import React, { useState, useCallback, useRef } from 'react';
import ProfileImageCropper from "../common/ProfileImageCropper";
import PasswordValidator from "../user/passwordVaildator";
import { FaRegEdit } from "react-icons/fa";

const InfoComponent = () => {
  
  const {loginState} = useCustomLogin(); 
  const email = loginState.email

  const { data, isPending, error } = useQuery({
    queryKey: ['mypage/info', email],
    queryFn: async () => {
      const res = await jwtAxios.get(`http://localhost:8080/user`)
      return res.data.data
    },
    staleTime: 1000 * 60 * 10
  })

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const imageUrl = `${apiUrl}/upload/profile`;

  // 프로필 이미지 
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  // 비밀번호
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // PasswordValidator 내부 상태를 참조하기 위한 ref
  const passwordValidatorRef = useRef<{ 
    isValid: () => boolean; 
    getPasswords: () => { currentPassword: string, newPassword: string } 
  }>(null);

  // 프로필 이미지 수정 요청
  const RequestChangeProfileImage = async () => {
    if (!profileImageFile) return;

    const formData = new FormData();
    formData.append("profile", profileImageFile);

    try {
      const res = await jwtAxios.put("http://localhost:8080/image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.code === 200) {
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
  const requestChangePassword = () => {
  
    if (!passwordValidatorRef.current) return;

    // PasswordValidator 유효성 검증 결과 가져오기
    if (!passwordValidatorRef.current.isValid()) {
      alert("비밀번호 조건을 모두 만족시켜 주세요.");
      return;
    }

    // PasswordValidator 기존 비밀번호, 새로운 비밀번호 가져오기
    const { currentPassword, newPassword } = passwordValidatorRef.current.getPasswords();

    try {
      async () => {
        const res = await jwtAxios.patch('/user/password', {
          currentPassword,
          newPassword
        });

        if (res.data.code === 200) {
          alert('비밀번호가 변경되었습니다.');
          setIsChangingPassword(false);
        } else {
          alert('비밀번호 변경 실패히였습니다.');
        }
      }
    } catch (err) {
      console.error(err);
      alert('변경 요청 중 에러가 발생하였습니다.');
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
                id="profile-img" 
                className='w-40 h-40 mb-6 object-cover' 
                src={previewImage || `${imageUrl}/${data.profileImage}`} 
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
                    className="btn-blue rounded p-1.5 w-18"
                    onClick={RequestChangeProfileImage}
                  >
                    저장
                  </button>

                  <button
                    type="button"
                    className="rounded p-1.5 w-18 bg-main-3 border-main-3 border"
                    onClick={()=> setPreviewImage('')}
                  >
                    초기화
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
                      onClick={requestChangePassword}
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


            <div className="mt-16 text-center">
              <button type="button" 
                className="rounded p-2 w-22 text-lg bg-blue-500 text-white"
              >
                수정
              </button>          
            </div>

          </form>
        </div>
      }

    </div>
  )
}

export default InfoComponent