import { useLoaderData, useParams, type LoaderFunctionArgs } from "react-router"
import ReadComponent from "../../components/products/readComponent"
import jwtAxios from "../../util/jwtUtil"
import { useQuery } from "@tanstack/react-query"
import '../../styles/product.css'
import LoadingSpinner from "../../components/common/loadingSpinner"

const ReadPage = () => {

  const {pno} = useParams()

  const {data, isPending, error} = useQuery({
    queryKey: ['product', pno],
    queryFn: async () => {
      const res = await jwtAxios.get(`http://localhost:8080/products/${pno}`)
      return res.data.data
    },
    staleTime: 1000 * 60 * 10
  })

  return (
    <div className="w-full">
      {isPending && <LoadingSpinner/>}
      {data &&
      
        <ReadComponent data={data}></ReadComponent>
      }
    </div>
  )
}

export default ReadPage