import { lazy, Suspense } from "react";

const Loading = () => <div>Products Loading....</div>

const OrderPage = lazy(() => import("../pages/orders/orderPage"))
const OrderDetailPage = lazy(() => import("../pages/orders/orderDetailPage"))


export default function orderRouter() {
 return (
  {
   path: "orders",
   children: [
    {
     path: "",
     element: <Suspense fallback={<Loading/>}><OrderPage/></Suspense> 
    },
      {
     path: "detail",
     element: <Suspense fallback={<Loading/>}><OrderDetailPage/></Suspense> 
    },
   ] 
  }
 )
}
