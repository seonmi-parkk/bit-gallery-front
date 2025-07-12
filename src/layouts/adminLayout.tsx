import { Outlet } from "react-router"

const MypageLayout = () => {
  return (
    <div className="max-w-[1200px] m-auto">
      <div className="flex gap-20">
        <div className="mr-6">
          <h4 className="text-4xl text-white-3 font-medium">ADMIN</h4>
          <ul className="mt-10">

            <div className="my-8">
              <p className="my-3 text-sm text-white-4">Product</p>
              <li className="px-1 py-1 my-0.5 text-lg font-medium cursor-pointer">
                <a href="">  
                  상품 관리
                </a>
              </li>
            </div>

          </ul>
        </div>

        <div className="flex-1 p-8 border border-main-3 min-h-[75vh] rounded-2xl">
          <Outlet/>  
        </div>
      </div>
    </div>

  )
}

export default MypageLayout