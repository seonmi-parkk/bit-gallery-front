import { createBrowserRouter, Navigate } from "react-router";

import { lazy, Suspense } from "react";
import BasicLayout from "../layouts/basicLayout";
import productRouter from "./productRouter";
import userRouter from "./userRouter";
import todoRouter from "./todoRouter";
import orderRouter from "./orderRouter";
import paymentRouter from "./paymentRouter";
import mypageRouter from "./mypageRouter";
import adminRouter from "./adminRouter";
const Loading = () => <div>Loaidng...</div> // 로딩할 때 보여주는 함수형 컴포넌트 
const ProductsList = lazy(() => import("../pages/products/listPage"))
const ProductsAdd = lazy(() => import("../pages/products/addPage"))
const ProductsRead = lazy(() => import("../components/products/readModalComponent"))
const ProductsModify = lazy(() => import("../pages/products/modifyPage"))
const CartPage = lazy(() => import("../pages/cart/cartPage"))



const router = createBrowserRouter([
  {
    path: "/",
    Component: BasicLayout,
    children: [
      {
        index: true,
        element: <Navigate to={'/products/list'}></Navigate>
      },
      {
        path: "cart",
        element: <Suspense fallback={<Loading/>}><CartPage/></Suspense> 
      },
      productRouter(),
      // {
      //   path:"add",
      //   element: <Suspense fallback={<Loading/>}><ProductsAdd/></Suspense>
      // },
      // {
      //   path:"modify/:pno",
      //   element: <Suspense fallback={<Loading/>}><ProductsModify/></Suspense>
      // },

      todoRouter(),
      userRouter(),
      orderRouter(),
      paymentRouter(),
      mypageRouter(),
      adminRouter(),
    ]
  },
  
])

export default router