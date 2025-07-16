import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import jwtAxios from "../../util/jwtUtil"
import { createSearchParams, useNavigate } from "react-router";
import { showErrorToast, showSuccessToast } from "../../util/toastUtil";
import useCustomMove from "../../hooks/useCustomMove";
import type { AxiosError } from "axios";

const ProductsComponent = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const imageUrl = `${apiUrl}/upload/product/`;

  const navigate = useNavigate();

  const {page} = useCustomMove();

  // 리스트 데이터 가져오기
  const { data, error, isPending } = useQuery({
    queryKey: ['admin/products/approval-requests', page], // 캐싱할 때 보관할 이름 
    queryFn: async () => {
        const queryStr = createSearchParams({ 
          page: String(page)
        }).toString();

      const res = await jwtAxios.get(`${apiUrl}/admin/products/approval-requests?${queryStr}`);

      if (res.data.code !== 200) {
        showErrorToast("리스트 가져오기 실패했습니다. 잠시후 다시 시도해주세요.");
      }
        return res.data.data
      },
      staleTime: 1000 * 30, // 30초 동안 캐싱 -> 30초 후 접근시에는 서버 호출
  })

  // 요청 승인 or 반려
  const handleRequest = async(action:string, pno:number) => {
    console.log("pno : ",pno)
    approveMutation.mutate({ action, pno });
  }

  const queryClient = useQueryClient()

  // 승인 요청 Mutation
  const approveMutation = useMutation({
    mutationFn: async ({ action, pno }: { action: string; pno: number }) => {
      const res = await jwtAxios.patch(`${apiUrl}/products/${pno}/${action}`)
      return { data: res.data, action, pno };
    },
    onSuccess: ({ action, pno }) => {
      queryClient.invalidateQueries({ queryKey: ['admin/products/approval-requests'] }) 
      queryClient.invalidateQueries({ queryKey: ['product', String(pno)] })
      queryClient.invalidateQueries({ queryKey: ['products/list'], exact: false })
      showSuccessToast(action == 'approved'? '승인 처리되었습니다.' : '반려 처리되었습니다.')
    },
    onError: (error) => {
          const axiosError = error as AxiosError<ApiResponse>;
    
          if (axiosError.response) {
            console.error('서버 응답 에러:', axiosError.response.data)
            showErrorToast(axiosError.response?.data?.message.toString());
    
          } else if (axiosError.request) {
            console.error('요청 미전송');
            showErrorToast('서버에 연결할 수 없습니다.');
          } else {
            console.error('기타 에러:', axiosError.message)
            showErrorToast("알 수 없는 오류가 발생했습니다.")
          }
        }
  })

  return (
    <div className="my-6">
      <div>
        <button className="border-b py-1">승인 요청</button>
      </div>
      <div className="mt-10">
        {data &&
          <table className="w-full table-auto text-center">
            <thead>
              <tr>
                <th className="hidden sm:table-cell">Id</th>
                <th className="w-1/2 sm:w-1/3 md:w-1/4">제목</th>
                <th className="hidden sm:table-cell">이미지</th>
                <th className="hidden lg:table-cell">가격</th>
                <th className="hidden lg:table-cell">작성자</th>
                <th className="hidden xs:table-cell">등록일자</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.length == 0 && 
                <tr>
                  <td colSpan={7}><p className="py-4">새로 등록된 상품이 없습니다.</p></td>
                </tr>
              }
              {data.length != 0 && data.map((product:AdminProductResponseDto, index:number) => (
                <tr key={index}>
                  <td className="hidden sm:table-cell">{product.pno}</td>
                  <td className="w-1/2 sm:w-1/3 md:w-1/4 text-left"
                    onClick={() => navigate(`/products/read/${product.pno}`)}
                  >
                    {product.pname}
                  </td>
                  <td className="hidden sm:table-cell">
                    <img 
                      src={imageUrl + product.productImage} 
                      alt="상품 이미지" 
                      className="w-16 h-16 m-auto"
                    />
                  </td>
                  <td className="hidden lg:table-cell">{product.price.toLocaleString()} 원</td>
                  <td className="hidden lg:table-cell">{product.sellerNickname}</td>
                  <td className="hidden xs:table-cell">{product.createdAt}</td> 
                  <td>
                    <button 
                      onClick={() => handleRequest('approved',product.pno)}
                      className="m-1 px-4 py-1.5 text-base font-medium bg-main-3 rounded-lg"
                    >
                      승인
                    </button>
                    <button 
                      onClick={() => handleRequest('rejected',product.pno)}
                      className="m-1 px-4 py-1.5 text-base font-medium bg-main-3 rounded-lg"
                    >
                      반려
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