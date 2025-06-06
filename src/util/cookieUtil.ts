import { Cookies } from "react-cookie";
import type { UserInfo } from "../zstore/useLoginStore";

const cookies = new Cookies()

export const setCookie = (name:string, value:UserInfo) => {
  
  // refreshToken 보관기한 추출
  const jwtPayload = JSON.parse(atob(value.refreshToken.split('.')[1]));
  const expTimestamp = jwtPayload.exp * 1000; // ms
  const expires = new Date(expTimestamp);

  return cookies.set(name, JSON.stringify(value), {path:'/', expires:expires})
}

export const getCookie = (name:string) => {
  return cookies.get(name)
}

export const removeCookie = (name:string, path="/") => {
  cookies.remove(name, {path})
}