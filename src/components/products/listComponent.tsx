import { useQueryClient } from "@tanstack/react-query";
import UseCustomCart from "../../hooks/useCustomCart";
import useCustomMove from "../../hooks/useCustomMove"
import PageComponent from "../common/pageComponent";
import Masonry from 'react-masonry-css'
import { BsCartPlus, BsCartCheck } from "react-icons/bs";
import '../../styles/product.css'
import useLoginStore from "../../zstore/useLoginStore";
import ReadModalComponent from "./readModalComponent";
import { useState } from "react";
import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';


const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1
};

const ListComponent = ({serverData} : {serverData:pageResponseDto<ProductDto>}) => {
  const { cartItems, isInCart, addItem, moveToCart } = UseCustomCart()

  const { status: loginStatus, user: loginUser } = useLoginStore()

  const { page, size, moveToList, moveToRead } = useCustomMove()

  const [selectedPno, setSelectedPno] = useState<number>(0);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const imageUrl = `${apiUrl}/upload/product/list_thumb/t_`;

  const query = useQueryClient()

  const [isOpenModal,setIsOpenModal] = useState<boolean>(false);


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
            onClick={() => {setIsOpenModal(true); setSelectedPno(product.pno);}}
          >

            <div className="flex flex-col h-full">
              <div className="text-1xl w-full flex flex-col">
                <div className="relative w-full overflow-hidden ">

                  <Swiper
                    modules={[Autoplay]}
                    slidesPerView={1}
                    autoplay={{
                      delay: 3000, // 3초마다 자동 슬라이드
                      disableOnInteraction: false, // 유저가 터치해도 autoplay 유지
                      pauseOnMouseEnter: false  // 마우스 오버해도 autoplay 유지
                    }}
                    loop={product.uploadedFileNames.length > 1}
                    className="relative product-detail-swiper w-full rounded overflow-hidden"
                  >
                    {product.uploadedFileNames.map((imgFile: string, idx: number) => (
                      <SwiperSlide key={idx}>
                        <img src={imageUrl+imgFile} className="w-full h-full max-w-full object-contain" />
                      </SwiperSlide>
                    ))}
                    
                  </Swiper>
                  
                  <div className="absolute z-10 w-full flex justify-between list-item-info px-4 pt-4 pb-3 bottom-0">
                    <div className="flex-1">
                      {/* {product.pno} */}
                      <div className="max-w-5/6 truncate text-white-1 font-medium">
                        {product.pname}
                      </div>
                      <div className="mt-2 text-white-1 text-sm">
                        {product.price.toLocaleString()} 원
                      </div>
                    </div>

                    {loginUser.email !== product.sellerEmail && (
                      !cartItems.items.some(item => item.pno === product.pno) || loginStatus === 'guest' ? (
                        <button type="button"
                          className="flex justify-center items-center w-10 h-10 rounded text-xl border border-main-6 bg-white-op1"
                          onClick={(e) => {e.stopPropagation(); addItem(product.pno);}}
                        >
                          <BsCartPlus />
                        </button>
                      ) : (
                        <button type="button"
                          className="flex justify-center items-center w-10 h-10 rounded text-xl border border-main-6 bg-white-op1"
                          onClick={() => moveToCart()}
                        >
                          <BsCartCheck />
                        </button>
                      )
                    )}



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
          onClose={() => setSelectedPno(0)}
          // isOpenModal={isOpenModal}
        />
      }
    </div>



  )
}

export default ListComponent;