import axios from "axios";

const rest_api_key = import.meta.env.VITE_KAKAO_REST_API_KEY;
const redirect_uri = import.meta.env.VITE_KAKAO_REDIRECT_URI;
const auth_code_path = `http://kauth.kakao.com/oauth/authorize`;
// 엑세스 토큰 얻기
const access_token_url = `https://kauth.kakao.com/oauth/token`;

export const getKakaoLink = () => {
  console.log("rest_api_key :", rest_api_key);
  console.log("redirect_uri :", redirect_uri);
  const kakaoUrl = `${auth_code_path}?client_id=${rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;
  return kakaoUrl
}

export const getMemberWithAccessToken = async(accessToken:string) => {
  const res = await axios.get(`http://localhost:8080/user/kakao?accessToken=${accessToken}`)
  return res.data
}
