import { Children, lazy, Suspense } from "react";
import MypageLayout from "../layouts/mypageLayout";
import { Navigate } from "react-router";
const Loading = <div>Loading...</div>
const Info= lazy(() => import("../pages/mypage/infoPage"))



export default function mypageRouter() {
  return (
    {
      path: "mypage",
      Component: MypageLayout,
      children: [
        {
          index: true,
          element: <Navigate to={'/mypage/info'}></Navigate>
        },
        {
          path: "info",
          element: <Suspense fallback={Loading}><Info/></Suspense>
        }
      ]
    }
  )
}