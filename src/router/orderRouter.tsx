import { lazy, Suspense } from "react";

const Loading = () => <div>Products Loading....</div>

const OrderPage = lazy(() => import("../pages/orders/orderPage"))


export default function productsRouter() {
 return (
  {
   path: "orders",
   children: [
    {
     path: "",
     element: <Suspense fallback={<Loading/>}><OrderPage/></Suspense> 
    }
   ] 
  }
 )
}
