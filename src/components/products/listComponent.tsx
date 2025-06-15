import { useQueryClient } from "@tanstack/react-query";
import UseCustomCart from "../../hooks/useCustomCart";
import useCustomMove from "../../hooks/useCustomMove"
import PageComponent from "../common/pageComponent";
import Masonry from 'react-masonry-css'
import { BsCartPlus, BsCartCheck } from "react-icons/bs";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import '../../styles/product.css'
import useLoginStore from "../../zstore/useLoginStore";
import ReadModalComponent from "./readModalComponent";
import { useState } from "react";
import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import useCustomLogin from "../../hooks/useCustomLogin";

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1
};

const ListComponent = ({ serverData }: { serverData: pageResponseDto<ProductDto> }) => {
  const { cartItems, isInCart, addItem, moveToCart } = UseCustomCart()

  const { status: loginStatus, user: loginUser } = useLoginStore()

  const { page, size, moveToList, moveToRead } = useCustomMove()

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedPno, setSelectedPno] = useState<number>(0);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const imageUrl = `${apiUrl}/upload/product/thumb/s_`;

  const query = useQueryClient()

  console.log("[ListComponent]LoginStatus : ", loginStatus)

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

                  <Swiper
                    modules={[Autoplay]}
                    slidesPerView={1}
                    autoplay={{
                      delay: 3000, // 3초마다 자동 슬라이드
                      disableOnInteraction: false, // 유저가 터치해도 autoplay 유지
                      pauseOnMouseEnter: false  // 마우스 오버해도 autoplay 유지
                    }}
                    loop={true}
                    className="relative product-detail-swiper w-full rounded overflow-hidden"
                  >
                    {product.uploadedFileNames.map((imgFile: string, idx: number) => (
                      <SwiperSlide key={idx}>
                        <img src={imageUrl+imgFile} className="w-full h-full max-w-full object-contain" />
                      </SwiperSlide>
                    ))}
                    
                  </Swiper>
                  
                  <div className="absolute z-10 w-full flex justify-between list-item-info px-4 pt-4 pb-3 bottom-0">
                    <div className="">
                      {product.pno}
                      <div className="max-w-5/6 truncate text-white-1">
                        {product.pname}
                      </div>
                      <div className="mt-1 text-white-1 text-sm">
                        {product.price.toLocaleString()} 원
                      </div>
                    </div>


                    {/* {(loginStatus === 'guest' || cartItems.status === 'fulfilled' && !isInCart(product.pno)) &&
                      <button type="button"
                        className="flex justify-center items-center w-10 h-10 rounded text-xl bg-white-1 text-black-2"
                        onClick={(e) => { e.stopPropagation(); addItem(product.pno) }}
                      >
                        <BsCartPlus/>
                      </button>
                    } */}

                    {loginUser.email !== product.sellerEmail && (
                      !cartItems.items.some(item => item.pno === product.pno) || loginStatus === 'guest' ? (
                        <button type="button"
                          className="flex justify-center items-center w-10 h-10 rounded text-xl border border-main-6"
                          onClick={(e) => {e.stopPropagation(); addItem(product.pno);}}
                        >
                          <BsCartPlus />
                        </button>
                      ) : (
                        <button type="button"
                          className="flex justify-center items-center w-10 h-10 rounded text-xl border border-main-6"
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
          onClose={() => {setIsOpenModal(false); setSelectedPno(0); }}
        />
      }
    </div>



  )
}

export default ListComponent;