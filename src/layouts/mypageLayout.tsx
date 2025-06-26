import { Outlet } from "react-router"

const MypageLayout = () => {
  return (
    <div className="max-w-[1200px] m-auto">
      <div className="flex gap-15">
        <div className="mr-6">
          <h4 className="text-4xl text-white-3 font-medium">MYPAGE</h4>
          <ul className="mt-10">

            <div className="my-8">
              <p className="my-3 text-sm text-white-4">HOME</p>
              <li className="px-1 py-1 my-0.5 text-lg font-medium cursor-pointer">
                <a href="">  
                  회원정보
                </a>
              </li>
            </div>

            <div className="my-8">
              <p className="my-3 text-sm text-white-4">구매관리</p>
              <li className="px-1 py-1 my-1 text-lg font-medium cursor-pointer">
                <a href="">  
                  구매내역
                </a>
              </li>
              <li className="px-1 py-1 my-1 text-lg font-medium cursor-pointer">
                <a href="">  
                  다운로드 관리
                </a>
              </li>
            </div>

            <div className="my-8">
              <p className="my-3 text-sm text-white-4">판매관리</p>
              <li className="px-1 py-1 my-1 text-lg font-medium cursor-pointer">
                <a href="">  
                  등록상품
                </a>
              </li>
              <li className="px-1 py-1 my-1 text-lg font-medium cursor-pointer">
                <a href="">  
                  판매내역
                </a>
              </li>
            </div>

          </ul>
        </div>

        <div className="flex-1 p-8 border border-gray-700 min-h-[75vh] rounded-2xl">
          <Outlet/>  
        </div>
      </div>
    </div>

  )
}

export default MypageLayout