import { Children, lazy, Suspense } from "react";
import AdminLayout from "../layouts/adminLayout";
import { Navigate } from "react-router";

const Loading = <div>Loading...</div>
const Products = lazy(() => import("../pages/admin/products"))




export default function adminRouter() {
  return (
    {
      path: "admin",
      Component: AdminLayout,
      children: [
        {
          index: true,
          element: <Navigate to={'/admin/products'}></Navigate>
        },
        {
          path: "products",
          element: <Suspense fallback={Loading}><Products/></Suspense>
        },
        
      ]
    }
  )
}