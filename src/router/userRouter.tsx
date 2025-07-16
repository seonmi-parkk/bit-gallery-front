import { Children, lazy, Suspense } from "react";
const Loading = <div>Loading...</div>
const Login = lazy(() => import("../pages/user/loginPage"))
const Signup = lazy(() => import("../pages/user/signup/signupPage"))
const KakaoRedirect= lazy(() => import("../pages/user/kakaoRedirectPage"))
const UserModify= lazy(() => import("../pages/user/modifyPage"))


export default function userRouter() {
  return (
    {
      path: "user",
      children: [
        {
          path: "login",
          element: <Suspense fallback={Loading}><Login/></Suspense>
        },
        {
          path: "signup",
          element: <Suspense fallback={Loading}><Signup/></Suspense>
        },
        {
          path: "kakao",
          element: <Suspense fallback={Loading}><KakaoRedirect/></Suspense>
        },
        {
          path: "modify",
          element: <Suspense fallback={Loading}><UserModify/></Suspense>
        }
      ]
    }
  )
}