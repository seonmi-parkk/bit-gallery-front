import { useQuery } from "@tanstack/react-query";
import jwtAxios from "../../util/jwtUtil"
import { createSearchParams } from "react-router";
import { showErrorToast } from "../../util/toastUtil";
import useCustomMove from "../../hooks/useCustomMove";

const ProductsComponent = () => {
  const {page} = useCustomMove();

  // 리스트 데이터 가져오기
  const { data, error, isPending } = useQuery({
    queryKey: ['admin/products/approval-requests', page], // 캐싱할 때 보관할 이름 
    queryFn: async () => {
        const queryStr = createSearchParams({ 
          page: String(page)
        }).toString();

      const res = await jwtAxios.get(`http://localhost:8080/admin/products/approval-requests?${queryStr}`)

      if (res.data.code !== 200) {
        showErrorToast("리스트 가져오기 실패했습니다. 잠시후 다시 시도해주세요.");
      }
        return res.data.data
      },
      staleTime: 1000 * 30, // 30초 동안 캐싱 -> 30초 후 접근시에는 서버 호출
  })

  return (
    <div className="my-6">
      <div>
        <button className="border-b py-1">승인 요청</button>
      </div>
      <div>
        {data &&
          <table>
            <tr>
              <th>제목</th>
              <th>가격</th>
              <th>작성자</th>
              <th>등록일자</th>
              <th></th>
            </tr>
            <tr>

            </tr>
          </table>
        }
      </div>
    </div>
  )
}

export default ProductsComponent