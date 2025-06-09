import UseCustomCart from "../../hooks/useCustomCart"
import useCustomMove from "../../hooks/useCustomMove"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Thumbs } from 'swiper/modules'
import { BsCartPlus, BsCartCheck } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import useLoginStore from "../../zstore/useLoginStore";
import { useState } from "react";
import useCartStore from "../../zstore/useCartStore";


const ReadComponent = ({ data }: { data: ProductDto }) => {

  const { moveToModify, moveToList } = useCustomMove()

  const { addItem, isInCart, moveToCart } = UseCustomCart()

  const {items:cartItems} = useCartStore()

  const { status: loginStatus, user: loginUser } = useLoginStore()

  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null)

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const imageUrl = `${apiUrl}/upload`;

  return (
    <div className=" px-5 py-4">
      <div className="flex justify-between mb-4">
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 rounded-full" 
            style={{ 
              backgroundImage: `url(${imageUrl}/${data.sellerImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          ></div>
          <span>{data.sellerNickname}</span>
        </div>

        <div className="flex gap-2">
          {loginUser.email !== data.sellerEmail &&
            <button type="button"
              className="flex justify-center items-center h-10 px-3 rounded text-sm font-bold bg-white-1 text-black-2 "
              onClick={() => {}}
            >
              구매하기
            </button>
          }    

          {/* 판매자X & 장바구니에 해당 상품X -> 장바구니 담기 버튼 / 판매자X & 장바구니에 해당 상품X -> 장바구니 이동 버튼 */}
          {loginUser.email !== data.sellerEmail && (
            !cartItems.some(item => item.pno === data.pno) || loginStatus === 'guest' ? (
              <button type="button"
                className="flex justify-center items-center w-10 h-10 rounded text-xl border border-main-6"
                onClick={() => addItem(data.pno)}
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


    

          {/* 해당 상품 글의 작성자이며 상태가 pending인 경우에만 수정 버튼 노출 */}
          {
            loginUser.email === data.sellerEmail && data.status === 'PENDING' &&
            <button type="button"
              className="flex justify-center items-center w-10 h-10 rounded text-xl border border-main-6"
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
                <img src={`${imageUrl}/product/thumb/s_${imgFile}`} className="w-full h-full max-w-full max-h-[calc(100vh-260px)] object-contain" />
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
                    src={`${imageUrl}/product/thumb/s_${imgFile}`}
                    className=" w-14 h-14 sm:w-18 sm:h-18 lg:w-22 lg:h-22 2xl:w-28 2xl:h-28  object-cover border-2 hover:border-blue-500 cursor-pointer"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          }
        </div>

        <div className="mt-5">

          <div className={`tag tag-${data.status} w-fit`}>
            {data.statusName}
          </div>

          <div className="relative mt-2 mb-3 flex w-full flex-wrap items-stretch">
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
    </div>

  )
}

export default ReadComponent;