import UseCustomCart from "../../hooks/useCustomCart"
import useCustomMove from "../../hooks/useCustomMove"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Thumbs } from 'swiper/modules'
import { BsCartPlus } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import useLoginStore from "../../zstore/useLoginStore";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const ReadComponent = ({ data }: { data: ProductDto }) => {

  const { moveToModify, moveToList } = useCustomMove()

  const { addItem, isInCart } = UseCustomCart()

  const { status: loginStatus } = useLoginStore()

  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null)

  return (
    <>
      <div className="flex justify-between px-4 py-3">
        <div>
          프로필
          <span>닉네임</span>
        </div>
        <div className="flex gap-2">
          {/* 해당 상품이 장바구니에 없는 경우에만 추가 버튼 */}
          {(loginStatus === 'guest' || !isInCart(data.pno)) &&
            <button type="button"
              className="flex justify-center items-center w-10 h-10 rounded text-xl border border-main-6 "
              onClick={() => addItem(data.pno)}
            >
              <BsCartPlus />
            </button>
          }

          {/* 해당 상품 글의 작성자인 경우에만 수정 버튼 노출 */}
          {
            <button type="button"
              className="flex justify-center items-center w-10 h-10 rounded text-xl bg-white-1 text-black-2"
              onClick={() => moveToModify(data.pno)}
            >
              <FaRegEdit />
            </button>
          }
        </div>
      </div>

      <div className="">
        {/* 이미지 슬라이더 */}
        <div>
          <Swiper
            modules={[Thumbs]}
            spaceBetween={10}
            thumbs={{ swiper: thumbsSwiper }}
            className="product-detail-swiper w-full max-h-[calc(100vh-260px)] mb-4 rounded overflow-hidden"
          >
            {data.uploadedFileNames.map((imgFile: string, idx: number) => (
              <SwiperSlide key={idx}>
                <img src={`http://localhost:8080/products/view/${imgFile}`} className="w-full h-full max-w-full max-h-full object-contain" />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* 썸네일 (이미지 수가 2개 이상인 경우에만) */}
          {data.uploadedFileNames.length > 1 &&
            <Swiper
              modules={[Thumbs]}
              onSwiper={setThumbsSwiper}
              spaceBetween={10}
              slidesPerView={data.uploadedFileNames.length}
              watchSlidesProgress
              className="product-thumb-nail-swiper  m-auto"
            >
              {data.uploadedFileNames.map((imgFile: string, idx: number) => (
                <SwiperSlide key={idx}>
                  <img
                    src={`http://localhost:8080/products/view/${imgFile}`}
                    className=" w-14 h-14 sm:w-20 sm:h-20 lg:w-30 lg:h-30 2xl:w-40 2xl:h-40  object-cover border-2 hover:border-blue-500 cursor-pointer"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          }
        </div>

        <div className="px-6">
          <div className="relative mb-3 flex w-full flex-wrap items-stretch">
            <div className="mr-3 font-bold">PNAME</div>
            <div className="">
              {data.pname}
            </div>
          </div>

          <div className="relative mb-3 flex w-full flex-wrap items-stretch">
            <div className="mr-3 font-bold">PRICE</div>
            <div className="">
              {data.price}
            </div>
          </div>

          <div className="relative mb-3 flex w-full flex-wrap items-stretch">
            <div className="mr-3 font-bold">PDESC</div>
            <div className="">
              {data.pdesc}
            </div>
          </div>
        </div>
      </div>
    </>

  )
}

export default ReadComponent;