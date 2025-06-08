import { useQueryClient } from "@tanstack/react-query";
import UseCustomCart from "../../hooks/useCustomCart";
import useCustomMove from "../../hooks/useCustomMove"
import PageComponent from "../common/pageComponent";
import Masonry from 'react-masonry-css'
import { BsCartPlus } from "react-icons/bs";
import '../../styles/product.css'
import useLoginStore from "../../zstore/useLoginStore";
import ReadModalComponent from "./readModalComponent";
import { useState } from "react";
import useCustomLogin from "../../hooks/useCustomLogin";

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1
};

const ListComponent = ({ serverData }: { serverData: pageResponseDto<ProductDto> }) => {
  const { cartItems ,isInCart, addItem } = UseCustomCart()

  //const {status:loginStatus} = useLoginStore()
  const {loginStatus} = useCustomLogin()

  const { page, size, moveToList, moveToRead } = useCustomMove()

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedPno, setSelectedPno] = useState<number>(0);

  const query = useQueryClient()

  console.log("[ListComponent]LoginStatus : ", loginStatus)

  //const images = serverData.dtoList;

  // 동일 페이지 클릭 처리
  const moveCheckPage = (pageParam: PageParam) => {
    console.log(pageParam.page, page, pageParam.page === page)
    if (pageParam.page === page) {
      // if (!confirm("다시 페이지를 호출하시겠습니까?")) {
      //   return
      // }
      query.invalidateQueries({ queryKey: ['products/list', page, size] }) // 키값 무효화
    }
    moveToList(pageParam)
  }


  return (  
    <div>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="masonry-grid"
        columnClassName="masonry-grid_column"
      >
        {serverData.dtoList.map(product => 
          <div
            key={product.pno}
            className="list-item relative rounded cursor-pointer"
            onClick={() => {setIsOpenModal(true); setSelectedPno(product.pno)}}
          >

            <div className="flex flex-col h-full">
              <div className="text-1xl w-full flex flex-col">
                <div className="relative w-full overflow-hidden ">
                  <img alt="product"
                    className="w-full rounded-md"
                    src={`http://localhost:8080/products/view/s_${product.uploadedFileNames[0]}`} />
                  
                  <div className="absolute w-full flex justify-between list-item-info px-4 pt-4 pb-3 bottom-0">
                    <div className="">
                      <div className="max-w-5/6 truncate text-white-1">
                        {product.pname}
                      </div>
                      <div className="mt-1 text-white-1 text-sm">
                        {product.price} 원
                      </div>
                    </div>

                    {/* 해당 상품이 장바구니에 없는 경우에만 추가 버튼 */}
                    {(loginStatus === 'guest' || cartItems.status === 'fulfilled' && !isInCart(product.pno)) &&
                      <button type="button"
                        className="flex justify-center items-center w-10 h-10 rounded text-xl bg-white-1 text-black-2"
                        onClick={(e) => { e.stopPropagation(); addItem(product.pno) }}
                      >
                        <BsCartPlus/>
                      </button>
                    }
                  </div>

                </div>
              </div>
            </div>
          </div>
          
        )} 
      </Masonry>

      {/* 페이지네이션 */}
      <PageComponent serverData={serverData} movePage={moveCheckPage}></PageComponent>
      
      {/* 상세페이지 모달 */}
      {isOpenModal && selectedPno !== 0 && 
        <ReadModalComponent
          pno={selectedPno} 
          onClose={() => {setIsOpenModal(false); setSelectedPno(0); }}
        />
      }
    </div>



  )
}

export default ListComponent;