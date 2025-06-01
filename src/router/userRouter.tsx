import { Children, lazy, Suspense } from "react";
const Loading = <div>Loading...</div>
const Login = lazy(() => import("../pages/user/loginPage"))
const Logout= lazy(() => import("../pages/user/logoutPage"))

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
          path: "logout",
          element: <Suspense fallback={Loading}><Logout/></Suspense>
        }
      ]
    }
  )
}