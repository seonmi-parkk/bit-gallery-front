import UseCustomCart from "../../hooks/useCustomCart"
import useCustomMove from "../../hooks/useCustomMove"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Thumbs } from 'swiper/modules'
import { BsCartPlus, BsCartCheck } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import useLoginStore from "../../zstore/useLoginStore";
import { useEffect, useState } from "react";
import useCartStore from "../../zstore/useCartStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import jwtAxios from "../../util/jwtUtil";
import ResultModal from "../common/resultModal";
import useGlobalModalStore from "../../zstore/useGlobalModalStore";
import GlobalModal from "../common/globalModal";
import { showSuccessToast } from "../../util/toastUtil";
import { postGetOrderItemList } from "../../api/orderApi";
import { useNavigate } from "react-router";


const ReadComponent = ({ data }: { data: ProductDto }) => {

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const imageUrl = `${apiUrl}/upload`;

  const navigate = useNavigate();

  let defaultProfile = import.meta.env.VITE_DEFAULT_PROFILE;

  const { moveToModify, moveToList } = useCustomMove()

  const { addItem, isInCart, moveToCart } = UseCustomCart()

  const {items:cartItems} = useCartStore()

  const {status: loginStatus, user: loginUser } = useLoginStore()

  const {open:OpenGlobalModal, close:CloseGlobalModal} = useGlobalModalStore()

  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null)

  const [product, setProduct] = useState<ProductDto>(data)

  const [profileImage, setProfileImage] = useState<string>(imageUrl+"/profile/"+defaultProfile)

  const queryClient = useQueryClient()

  // 판매자 프로필 이미지
  useEffect(() => {
    if (data.sellerImage) {
      setProfileImage(`${imageUrl}/profile/${data.sellerImage}`);
    }
  }, [data.sellerImage]);

  // 판매 중지
  const pauseMutation = useMutation({
    mutationFn: async (pno: number) => {
      const res = await jwtAxios.patch(`http://localhost:8080/products/${pno}/paused`)
      // const sellerImage = res.data.data.sellerImage ;
      // if(sellerImage != null){
      //   setProfileImage(sellerImage);
      // }
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
      // if(sellerImage != null){
      //   setProfileImage(sellerImage);
      // }
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

  // 구매하기
  const buyItem = (pno:number) => {
    postGetOrderItemList([pno])
    .then(res => {
      console.log(res)  
      navigate('/orders', { state: res.data }) // 주문페이지로 이동, 응답 전달
    
    }).catch(e => {
      console.error(e)
    })
  }

  return (
    <>
      <div className=" px-5 py-4">
        <div className="flex justify-between mb-4">
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 rounded-full" 
              style={{ 
                backgroundImage: `url(${profileImage})`,
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
                onClick={() => buyItem(data.pno)}
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
              className="product-detail-swiper w-full max-h-[calc(100vh-300px)] 2xl:max-h-[calc(100vh-380px)] mb-4 rounded overflow-hidden"
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

            <div className="relative mt-2 mb-4 flex w-full flex-wrap items-stretch">
              <div className="w-14 mr-3 font-bold">상품명</div>
              <div className="">
                {data.pname}
              </div>
            </div>

            <div className="relative mb-4 flex w-full flex-wrap items-stretch">
              <div className="w-14 mr-3 font-bold">가격</div>
              <div className="">
                {data.price.toLocaleString()}
              </div>
            </div>

            <div className="relative mb-4 flex w-full flex-wrap items-stretch">
              <div className="w-14 mr-3 font-bold">상세설명</div>
              <div className="">
                {data.pdesc}
              </div>
            </div>

            <div className="relative mb-3 flex w-full flex-wrap items-stretch">
              <div className="w-14 mr-3 font-bold">카테고리</div>
              <div className="flex flex-wrap flex-1">
                {data.productCategories.map((category, index) => (
                  <div key={index} className="px-2.5 py-1 mt-[-3px] mb-2.5 mr-1.5 bg-main-3 rounded-full">
                    {category}
                  </div>
                ))}
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