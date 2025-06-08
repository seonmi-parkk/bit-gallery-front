import { useLoaderData, useParams, type LoaderFunctionArgs } from "react-router"
import ReadComponent from "../../components/products/readComponent"
import jwtAxios from "../../util/jwtUtil"
import { useQuery } from "@tanstack/react-query"
import PendingModal from "../../components/common/pendingModal"
import '../../styles/product.css'

const ReadPage = () => {

  const {pno} = useParams()

  const {data, isPending, error} = useQuery({
    queryKey: ['product', pno],
    queryFn: async () => {
      const res = await jwtAxios.get(`http://localhost:8080/products/${pno}`)
      return res.data
    },
    staleTime: 1000 * 60 * 10
  })

  return (
    <div className="w-full">
      <div>Product 상세페이지</div>
      {isPending && <PendingModal/>}
      {data &&
        <ReadComponent data={data}></ReadComponent>
      }
    </div>
  )
}

export default ReadPage