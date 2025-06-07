import { useQueryClient } from "@tanstack/react-query";
import UseCustomCart from "../../hooks/useCustomCart";
import useCustomMove from "../../hooks/useCustomMove"
import PageComponent from "../common/pageComponent";
import Masonry from 'react-masonry-css'
import '../../styles/product.css'

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1
};

const ListComponent = ({ serverData }: { serverData: pageResponseDto<ProductDto> }) => {
  const { cartItems ,isInCart, addItem } = UseCustomCart()

  const query = useQueryClient()

  const { page, size, moveToList, moveToRead } = useCustomMove()

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
            onClick={() => moveToRead(product.pno)}
          >

            <div className="flex flex-col h-full">
              <div className="text-1xl w-full flex flex-col">
                <div className="relative w-full overflow-hidden ">
                  <img alt="product"
                    className="w-full rounded-md"
                    src={`http://localhost:8080/products/view/s_${product.uploadedFileNames[0]}`} />
                  
                  <div className="list-item-info absolute w-full bottom-0">
                    <p>{product.pno}</p>
                    <div className="bottom-0 font-extrabold">
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
            </div>
          </div>
        )} 
      </Masonry>

      <PageComponent serverData={serverData} movePage={moveCheckPage}></PageComponent>

    </div>



  )
}

export default ListComponent;