import { lazy, Suspense } from "react";
import { Navigate } from "react-router";

const Loading = () => <div>Products Loading....</div>

const ProductsIndex = lazy(() => import("../pages/products/indexPage"))
const ProductsList = lazy(() => import("../pages/products/listPage"))
const ProductsAdd = lazy(() => import("../pages/products/addPage"))

export default function productsRouter() {
 return (
  {
   path: "products",
   Component: ProductsIndex,
   children: [
    {
     path: "list",
     element: <Suspense fallback={<Loading/>}><ProductsList/></Suspense> 
    },
    {
      path:"",
      element: <Navigate to={'/products/list'}></Navigate>
    },
    {
      path:"add",
      element: <Suspense fallback={<Loading/>}><ProductsAdd/></Suspense>
    }
   ] 
  }
 )
}
