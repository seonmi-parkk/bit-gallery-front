import { Children, Component, lazy, Suspense } from "react";
import { Navigate } from "react-router";

const Loading = () => <div>Loading...</div>
const TodoIndex = lazy(() => import("../pages/todo/indexPage"))
const TodoList = lazy(() => import("../pages/todo/listPage"))
const TodoRead = lazy(() => import("../pages/todo/readPage"))
const TodoAdd = lazy(() => import("../pages/todo/addPage"))
const TodoModify = lazy(() => import("../pages/todo/modifyPage"))

const todoRouter = () => {

  return (
    {
      path: "todo",
      Component: TodoIndex,
      children: [
        {
          path: "list",
          element: <Suspense fallback={<Loading />}><TodoList /></Suspense>
        },
        {
          path: "read/:tno",
          element: <Suspense fallback={<Loading />}><TodoRead /></Suspense>
        },
        {
          path: "add",
          element: <Suspense fallback={<Loading />}><TodoAdd /></Suspense>
        },
                {
          path: "modify/:tno",
          element: <Suspense fallback={<Loading />}><TodoModify /></Suspense>
        },
        // /todo 로 요청오면 /todo/list로 이동하도록 redirect
        // index로 지정해서 사용해도 되지만 굳이랍니다.
        // Navigate- 컴포넌트 렌더링
        // useNavigate - 로직안에서 처리
        {
          path: "",
          element: <Navigate to={'/todo/list'}></Navigate>
        }
      ]
    }
  )

}

export default todoRouter;