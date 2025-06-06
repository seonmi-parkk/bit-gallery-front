import { useQueryClient } from "@tanstack/react-query";
import UseCustomCart from "../../hooks/useCustomCart";
import useCustomMove from "../../hooks/useCustomMove"
import PageComponent from "../common/pageComponent";

const ListComponent = ({ serverData }: { serverData: pageResponseDto<ProductDto> }) => {
  const { cartItems ,isInCart, addItem } = UseCustomCart()

  const query = useQueryClient()

  const { page, size, moveToList, moveToRead } = useCustomMove()

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
    <div className="border-2 border-blue-100 mt-10 mr-2 ml-2 text-2xl">

      <div className="flex flex-wrap mx-auto p-6 bg-white">

        {serverData.dtoList.map(product =>

          <div
            key={product.pno}
            className="relative w-1/2 p-1 rounded shadow-md border-2 border-gray-200"
            onClick={() => moveToRead(product.pno)}
          >

            <div className="flex flex-col h-full">
              <div className="font-extrabold text-2xl p-2 w-full ">
                {product.pno}
              </div>
              <div className="mb-20 text-1xl m-1 p-2 w-full flex flex-col">
                <div className="w-full overflow-hidden ">
                  <img alt="product"
                    className="m-auto rounded-md w-60"
                    src={`http://localhost:8080/products/view/s_${product.uploadedFileNames[0]}`} />
                </div>

                <div className="bottom-0 font-extrabold bg-white">
                  <div className="text-center p-1">
                    이름: {product.pname}
                  </div>
                  <div className="text-center p-1">
                    가격: {product.price}
                  </div>
                </div>

                {/* 해당 상품이 장바구니에 없는 경우에만 추가 버튼 */}
                {cartItems.status === 'fulfilled' && !isInCart(product.pno) &&
                  <button type="button"
                    className="absolute left-1/2 transform -translate-x-1/2 bottom-4 inline-block rounded p-4 m-2 text-xl w-32 text-white bg-green-500"
                    onClick={(e) => { e.stopPropagation(); addItem(product.pno) }}
                  >
                    add Cart
                  </button>
                }
              </div>
            </div>
          </div>
        )}
      </div>

      <PageComponent serverData={serverData} movePage={moveCheckPage}></PageComponent>

    </div>



  )
}

export default ListComponent;