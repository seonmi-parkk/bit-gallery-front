import { createBrowserRouter } from "react-router";

import { lazy, Suspense } from "react";
import BasicLayout from "../layouts/basicLayout";
import todoRouter from "./todoRouter";
import productRouter from "./productRouter";
import userRouter from "./userRouter";
const Loading = () => <div>Loaidng...</div> // 로딩할 때 보여주는 함수형 컴포넌트 (컴포넌트란 jsx반환해 주는 것)
const Main = lazy(() => import("../pages/mainPage")) // lazy : 필요할 때 로딩
const About = lazy(() => import("../pages/aboutPage"))
const ProductsList = lazy(() => import("../pages/products/listPage"))
const MasonryTest = lazy(() => import("../pages/masonry"))


const router = createBrowserRouter([
  {
    path: "/",
    Component: BasicLayout,
    children: [
      {
        index: true,
        element: <Suspense fallback={<Loading/>}><ProductsList/></Suspense> 
      },
      {
        path: "about",
        element: <Suspense fallback={<Loading/>}><About/></Suspense>
      },
      {
        path: "masonry",
        element: <Suspense fallback={<Loading/>}><MasonryTest/></Suspense>
      },
      todoRouter(),
      productRouter()
    ]
  },
  userRouter() // BasicLayout을 사용하지 않기때문
])

export default router