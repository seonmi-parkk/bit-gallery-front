import { lazy, Suspense } from "react";

const Loading = () => <div>Products Loading....</div>

const PaymentApprovePage = lazy(() => import("../pages/payment/paymentApprovePage"))


export default function paymentRouter() {
 return (
  {
   path: "payment",
   children: [
    {
     path: "approve",
     element: <Suspense fallback={<Loading/>}><PaymentApprovePage/></Suspense> 
    },
   ] 
  }
 )
}
