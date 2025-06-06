import UseCustomCart from "../../hooks/useCustomCart"
import useCustomMove from "../../hooks/useCustomMove"

const ReadComponent = ({ product }: { product: ProductDto }) => {

  const { moveToModify, moveToList } = useCustomMove()

  const {addItem, isInCart} = UseCustomCart()

  return (
    <div className="border-2 border-sky-200 mt-10 m-2 p-4 bg-white">
      <div className="flex justify-center mt-10">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">PNO</div>
          <div className="w-4/5 p-6 rounded-r border border-solid shadow-md">
            {product.pno}
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">PNAME</div>
          <div className="w-4/5 p-6 rounded-r border border-solid shadow-md">
            {product.pname}
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">PRICE</div>
          <div className="w-4/5 p-6 rounded-r border border-solid shadow-md">
            {product.price}
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">PDESC</div>
          <div className="w-4/5 p-6 rounded-r border border-solid shadow-md">
            {product.pdesc}
          </div>
        </div>
      </div>
      <div className="w-full justify-center flex flex-col m-auto items-center">
        {product.uploadedFileNames.map((imgFile, i) =>
          <img
            alt="product"
            key={i}
            className="p-4 w-1/2"
            src={`http://localhost:8080/products/view/${imgFile}`} />
        )}
      </div>
      
        <div className="flex justify-end p-4">
          {/* 해당 상품이 장바구니에 없는 경우에만 추가 버튼 */}
          {!isInCart(product.pno) &&
            <button type="button"
              className="inline-block rounded p-4 m-2 text-xl w-32 text-white bg-green-500"
              onClick={() => addItem(product.pno)}
            >
              add Cart
            </button>
          } 

          {/* 해당 상품 글의 작성자인 경우에만 수정 버튼 노출 */}
          {
          <button type="button"
            className="inline-block rounded p-4 m-2 text-xl w-32 text-white bg-red-500"
            onClick={() => moveToModify(product.pno)}
          >
            Modify
          </button>
          }
          <button type="button"
            className="rounded p-4 m-2 text-xl w-32 text-white bg-blue-500"
            onClick={() => moveToList()}
          >
            List
          </button>
        </div>
    
    </div>

  )
}

export default ReadComponent;