import { useLoaderData, type LoaderFunctionArgs } from "react-router"
import ReadComponent from "../../components/products/readComponent"
import jwtAxios from "../../util/jwtUtil"

export async function loadProduct({params} : LoaderFunctionArgs) {
  const {pno} = params
  const res = await jwtAxios.get(`http://localhost:8080/products/${pno}`)
  return res.data
}

const ReadPage = () => {

  const product:ProductDto = useLoaderData()

  return (
    <div className="w-full">
      <div>Product 상세페이지</div>
      <ReadComponent product={product}></ReadComponent>
    </div>
  )
}

export default ReadPage