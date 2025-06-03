import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { getCookie, setCookie } from "./cookieUtil";

const jwtAxios = axios.create();

// access token 재발급 요청
const refreshJWT = async (refreshToken: string) => {
  const res = await axios.post(`http://localhost:8080/user/refresh`, { refreshToken: refreshToken })
  return res.data
}

// before request
// 요청 보내기 전에 추가 작업 - Acceess Token 전달
const beforeReq = (config: InternalAxiosRequestConfig) => {

  const userInfo = getCookie("user")
  if (!userInfo) {
    console.log("User Not Found")
    return Promise.reject(new Error("REQUIRE_LOGIN"))
  }
  const { accessToken } = userInfo
  console.log("==========accessToken: "+ accessToken);

  // Authorization 헤더 처리
  config.headers.Authorization = `Bearer ${accessToken}`

  return config;
}

// fail request
const requestFail = async (err: AxiosError) => {
  return Promise.reject(err);
}

// before return response
// 성공적인 응답이 왔을 때 추가 작업
const beforeRes = async (res: AxiosResponse): Promise<AxiosResponse> => {
  return res;
}

// fail response
const responseFail = async (err: AxiosError) => {
  console.log(err);

  const data = err.response?.data as ApiResponse

  // Access token 만료시 silent refreshing
  if (data && data.code === 40102) {
    
    const userCookieValue = getCookie("user")

    const result = await refreshJWT(userCookieValue.refreshToken)

    userCookieValue.accessToken = result.accessToken
    userCookieValue.refreshToken = result.refreshToken

    // refreshToken 보관기한 추출
    const jwtPayload = JSON.parse(atob(result.refreshToken.split('.')[1]));
    const expTimestamp = jwtPayload.exp * 1000; // ms
    const expires = new Date(expTimestamp);

    setCookie("user", JSON.stringify(userCookieValue), expires)

    //원래의 호출
    const originalRequest = err.config

    if (originalRequest?.headers) {
      originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;
      return await axios(originalRequest);
    }

  } else if (data && data.code === 40300){
    alert('열람 권한이 없습니다.');
    window.history.back();
  }

  return Promise.reject(err);
}

jwtAxios.interceptors.request.use(beforeReq, requestFail)

jwtAxios.interceptors.response.use(beforeRes, responseFail)

export default jwtAxios