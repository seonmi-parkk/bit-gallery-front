
import { Outlet } from "react-router"

const MypageLayout = () => {

  const sections = [
    {
      title: "HOME",
      items: [{"title":"회원정보","url":"/info"}],
    },
    {
      title: "구매관리",
      items: [{"title":"구매내역","url":"/purchases"}, 
              {"title":"다운로드 관리","url":"/downloads"}],
    },
    {
      title: "판매관리",
      items: [{"title":"등록상품","url":"/products"},
              {"title":"판매내역","url":"/sales"},],
    },
  ];

  return (
    <div className="max-w-[1200px] m-auto">
      <div className="flex flex-col md:flex-row md:gap-20">
        <div className="hidden md:block mr-6">
          <h4 className="text-4xl text-white-3 font-medium">MYPAGE</h4>
          <ul className="mt-10">
            {sections.map((section, idx) => (
              <div key={idx} className="my-8">
                <p className="my-3 md:text-sm text-white-4 cursor-pointer md:cursor-default flex items-center">
                  {section.title}
                </p>

                {section.items.map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    className="px-1 py-1 my-1 text-lg font-medium cursor-pointer"
                  >
                    <a href={`/mypage${item.url}`}>{item.title}</a>
                  </li>
                ))}
            
              </div>
            ))}

          </ul>
        </div>

        <div className="flex-1 p-4 md:p-8 border border-main-3 min-h-[75vh] rounded-2xl">
          <Outlet/>  
        </div>
      </div>
    </div>

  )
}

export default MypageLayout