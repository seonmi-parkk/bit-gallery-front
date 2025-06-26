import { Outlet } from "react-router";
import BasicMenu from "../components/menus/basicMenu";
import useLoginStore from "../zstore/useLoginStore";
import { useEffect } from "react";
import { getCookie } from "../util/cookieUtil";
import { ToastContainer, Zoom } from 'react-toastify';



function BasicLayout() {

  const { status, save } = useLoginStore();

  useEffect(() => {
    // 새로고침시 쿠키에서 로그인 정보 확인
    if(status === 'guest') {
      //console.log("loginStatus 없음")
      const cookieData = getCookie("user")

      if(cookieData){
      //console.log("cookie에서 로그인정보 가져와서 save")
        save(cookieData)
      }
    }
  }, []);

  return (
    <>    
      <div className="bg-main min-h-[calc(100vh-5rem)]">
        <BasicMenu/>
        <div className="w-full mt-20 px-6 py-8">
          <main className=" w-full px-5 py-5">
            <Outlet />
          </main>
          {/* <aside className="bg-green-300 md:w-1/3 lg:w-1/4 px-5 py-40">
            <CartComponent/>
          </aside> */}
        </div>
      </div>

      {/* 토스트 팝업 */}
      <ToastContainer
        toastClassName="top-1/12 flex items-center p-5 rounded-lg shadow-lg text-sm"
        autoClose={2000}
        position="top-center"
        toastStyle={{
          marginTop: "50%",
        }}
        transition={Zoom}
        hideProgressBar={true}
      />
    </>


  );
}

export default BasicLayout;