import { create } from "zustand"
import { loginPost } from "../api/userApi"
import { removeCookie, setCookie } from "../util/cookieUtil"

export interface UserInfo {
  email: string,
  nickname: string,
  accessToken: string,
  refreshToken: string,
  roleNames: string[],
  profileImage: string
}

export interface UserStore {
  user: UserInfo,
  status: 'guest'|'pending'|'fulfilled'|'error',
  login: (email:string, password:string) => void,
  logout: () => void,
  save: (userInfo: UserInfo) => void
}

const initState:UserInfo = {
  email: '',
  nickname: '',
  accessToken: '',
  refreshToken: '',
  roleNames: [],
  profileImage: ''
}

const useLoginStore = create<UserStore>( (set,get) => {

  return {
    user: initState,
    status: 'guest',
    login: async (email:string, password:string) => {
      set( {status: 'pending'});

      try {
        const data = await loginPost(email,password)
        console.log("new data: ", data)
        set( {user: data, status: 'fulfilled'})
        const newState = {...data, status: 'fulfilled'}
        setCookie("user", newState)
        console.log("=======loginStatus: ",  get().status)

      } catch (error) {
        console.log("Login filed : ", error)
        set({status: 'error'})
        console.log("=======loginStatus: ",  get().status)
      }
    },
    logout: () => {
      set( {user: {...initState}, status: 'guest'})
      removeCookie("user")
      console.log("=======loginStatus: ",  get().status)
    },
    save: (userInfo: UserInfo) => {
      console.log("userInfo!!!!!:", userInfo)
      set( {user: userInfo, status: 'fulfilled'})
      const newState = {...userInfo, status: 'fulfilled'}
      setCookie("user", newState)
      console.log("=======loginStatus: ",  get().status)
    }
  }
})

export default useLoginStore