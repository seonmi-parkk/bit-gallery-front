import { useQuery } from "@tanstack/react-query";
import jwtAxios from "../../util/jwtUtil"
import { createSearchParams } from "react-router";
import { showErrorToast } from "../../util/toastUtil";
import useCustomMove from "../../hooks/useCustomMove";

const ProductsComponent = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const imageUrl = `${apiUrl}/upload/product/`;

  const {page} = useCustomMove();

  // 리스트 데이터 가져오기
  const { data, error, isPending } = useQuery({
    queryKey: ['admin/products/approval-requests', page], // 캐싱할 때 보관할 이름 
    queryFn: async () => {
        const queryStr = createSearchParams({ 
          page: String(page)
        }).toString();

      const res = await jwtAxios.get(`http://localhost:8080/admin/products/approval-requests?${queryStr}`);

      if (res.data.code !== 200) {
        showErrorToast("리스트 가져오기 실패했습니다. 잠시후 다시 시도해주세요.");
      }
        return res.data.data
      },
      staleTime: 1000 * 30, // 30초 동안 캐싱 -> 30초 후 접근시에는 서버 호출
  })

  // 승인 요청
  const requestApprove = async(pno:number) => {
    console.log("pno : ",pno)
    const res = await jwtAxios.patch(`http://localhost:8080/products/${pno}/approved`);
  }

  return (
    <div className="my-6">
      <div>
        <button className="border-b py-1">승인 요청</button>
      </div>
      <div className="mt-10">
        {data &&
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>제목</th>
                <th>이미지</th>
                <th>가격</th>
                <th>작성자</th>
                <th>등록일자</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.map((product:AdminProductResponseDto, index:number) => (
                <tr key={index}>
                  <td>{product.pno}</td>
                  <td>{product.pname}</td>
                  <td>
                    <img 
                      src={imageUrl + product.productImage} 
                      alt="상품 이미지" 
                      className="w-16 h-16 "
                    />
                  </td>
                  <td>{product.price.toLocaleString()} 원</td>
                  <td>{product.sellerNickname}</td>
                  <td>{product.createdAt}</td> 
                  <td>
                    <button 
                      onClick={() => requestApprove(product.pno)}
                      className="m-1 px-4 py-1.5 text-base font-medium bg-main-3 rounded-lg"
                    >
                      승인
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </div>
    </div>
  )
}

export default ProductsComponent