import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { loginPost } from "../api/memberApi"
import { removeCookie, setCookie } from "../util/cookieUtil"

export interface LoginInfo {
  email:string,
  nickname:string,
  accessToken:string,
  refreshToken:string,
  roleNames: string[],
  status:string,
  isSocial?:boolean,
  password?:string
}

const initState:LoginInfo = {
  email: '',
  nickname: '',
  accessToken: '',
  refreshToken: '',
  roleNames: [],
  status: ''
}

// createasyncthunk 파라미터 (문자열 , action의 payload)
export const loginPostAsnyThunk = createAsyncThunk('loginPostAsnyThunk',({email, password} : {email:string, password:string}) => {
  console.log("-------loginPostAsnyThunk-------", email, password)
  return loginPost(email, password)
})


const loginSlice = createSlice({ // slice생성
  name: 'loginSlice',
  initialState: initState,
  reducers: {
      save: (state, action) => {
        const payload = action.payload
        const newState = {...payload, status: 'fulfilled'}

        // refreshToken 보관기한 추출
        const jwtPayload = JSON.parse(atob(payload.refreshToken.split('.')[1]));
        const expTimestamp = jwtPayload.exp * 1000; // ms
        const expires = new Date(expTimestamp);

        setCookie("user",JSON.stringify(newState),expires)

        return newState
      },
      logout: (state, action) => {
        removeCookie("user")
        console.log("logout...")
        return initState
      }
  },
  extraReducers : (builder) => {
    // fulfilled : 완료된 경우
    builder.addCase(loginPostAsnyThunk.fulfilled, (state, action) => {
      console.log("loginPostAsnyc.fulfilled")

      const newState:LoginInfo = action.payload
      newState.status = 'fulfilled'

      // refreshToken 보관기한 추출
      const jwtPayload = JSON.parse(atob(newState.refreshToken.split('.')[1]));
      const expTimestamp = jwtPayload.exp * 1000; // ms
      const expires = new Date(expTimestamp);

      setCookie("user", JSON.stringify(newState), expires) 
      
      return newState
    })// pending: 진행중
    .addCase(loginPostAsnyThunk.pending, (state, action) => {
      console.log("loginPostAsnyc.pending")
      state.status = 'pending'
    }) // rejected: 문제발생 -> 거절
    .addCase(loginPostAsnyThunk.rejected, (state, action) => {
      console.log("loginPostAsnyc.rejected")
      state.status = 'rejected'
    })
  }  
})

export const {save, logout} = loginSlice.actions // 외부에서 호출할수있도록 export

export default loginSlice.reducer // store.tsx에서 설정하기 위해 export