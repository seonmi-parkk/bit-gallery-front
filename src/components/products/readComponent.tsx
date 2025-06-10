import UseCustomCart from "../../hooks/useCustomCart"
import useCustomMove from "../../hooks/useCustomMove"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Thumbs } from 'swiper/modules'
import { BsCartPlus, BsCartCheck } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import useLoginStore from "../../zstore/useLoginStore";
import { useState } from "react";
import useCartStore from "../../zstore/useCartStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import jwtAxios from "../../util/jwtUtil";
import ResultModal from "../common/resultModal";
import useGlobalModalStore from "../../zstore/useGlobalModalStore";
import GlobalModal from "../common/globalModal";
import { showSuccessToast } from "../../util/toastUtil";


const ReadComponent = ({ data }: { data: ProductDto }) => {

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const imageUrl = `${apiUrl}/upload`;

  const { moveToModify, moveToList } = useCustomMove()

  const { addItem, isInCart, moveToCart } = UseCustomCart()

  const {items:cartItems} = useCartStore()

  const {status: loginStatus, user: loginUser } = useLoginStore()

  const {open:OpenGlobalModal, close:CloseGlobalModal} = useGlobalModalStore()

  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null)

  const [product, setProduct] = useState<ProductDto>(data)

  const queryClient = useQueryClient()

  // 판매 중지
  const pauseMutation = useMutation({
    mutationFn: async (pno: number) => {
      const res = await jwtAxios.patch(`http://localhost:8080/products/${pno}/paused`)
      return res.data.data
    },
    onSuccess: (result) => {
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['product', String(data.pno)] })
      queryClient.invalidateQueries({ queryKey: ['products/list'], exact: false })

      // 페이지 반영
      setProduct(prev => ({
        ...prev,
        status: 'PAUSED',       
        statusName: '판매 중지됨' 
      }));

      // 토스트 팝업
      showSuccessToast('판매 중지 처리되었습니다.')

      // 모달 닫기
      CloseGlobalModal();
    }
  })

  // 판매 재개
  const activateMutation = useMutation({
    mutationFn: async (pno: number) => {
      const res = await jwtAxios.patch(`http://localhost:8080/products/${pno}/activated`)
      return res.data.data
    },
    onSuccess: (result) => {
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['product', String(data.pno)] })
      queryClient.invalidateQueries({ queryKey: ['products/list'], exact: false })

      // 페이지 반영
      setProduct(prev => ({
        ...prev,
        status: 'APPROVED',       
        statusName: '판매 중' 
      }));

      // 토스트 팝업
      showSuccessToast('판매 재개되었습니다.')
    }
  })

  // 판매 중지 확인 모달
  const openPauseModal = () => {
    OpenGlobalModal({
      message: '정말 판매 중지하시겠습니까?',
      confirmText: '판매 중지',
      cancelText: '취소',
      onConfirm: () => pauseMutation.mutate(product.pno),
      onCancel: () => CloseGlobalModal()
    })
  }

  return (
    <>
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
            {loginUser.email === data.sellerEmail && product.status === 'PENDING' &&
                <button type="button"
                  className="flex justify-center items-center w-10 h-10 rounded text-xl border border-main-6"
                  onClick={() => moveToModify(data.pno)}
                >
                  <FaRegEdit />
                </button>
            }

            {/* 해당 상품 글의 작성자이며 상태가 APPROVED인 경우에만 판매 중지 버튼 노출 */}
            {loginUser.email === data.sellerEmail && product.status === 'APPROVED' &&
              <button type="button"
                className="flex justify-center items-center h-10 px-3 rounded text-sm font-medium border border-main-6"
                onClick={()=> openPauseModal()}
              >
                판매 중지
              </button>
            }

            {loginUser.email === data.sellerEmail && product.status === 'PAUSED' && (
              <button
                type="button"
                className="flex justify-center items-center h-10 px-3 rounded text-sm font-medium border border-main-6"
                onClick={() => activateMutation.mutate(data.pno)}
              >
                판매 재개
              </button>
            )}
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

            <div className={`tag tag-${product.status} w-fit`}>
              {product.statusName}
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

      <GlobalModal/>
    </>
  )
}

export default ReadComponent;