import { createSearchParams, useLoaderData, type LoaderFunctionArgs } from "react-router";
import ListComponent from "../../components/products/listComponent";
import jwtAxios from "../../util/jwtUtil";
import useCustomMove from "../../hooks/useCustomMove";
import { useQuery } from "@tanstack/react-query";
import PendingModal from "../../components/common/pendingModal";

const ListPage = () => {

  const { page, size } = useCustomMove()
  const queryStr = createSearchParams({ page: String(page), size: String(size) }).toString()
  const { data, error, isPending } = useQuery({
    queryKey: ['products/list', page, size], // 캐싱할 때 보관할 이름 
    queryFn: async () => {
        const res = await jwtAxios.get(`http://localhost:8080/products/list?${queryStr}`)
        console.log("------queryFn : ",queryStr);
        return res.data
      },
      staleTime: 1000 * 30, // 30초 동안 캐싱 -> 30초 후 접근시에는 서버 호출
    
  })

  return (
    <div className="w-full mt-4">
      <div className="text-2xl m-4 font-extrabold">
        Products List Page
      </div>

      {isPending && <PendingModal />}

      {data &&
        <ListComponent serverData={data}></ListComponent>
      }
    </div>
  );
}

export default ListPage;