import { useParams } from "react-router"
import ModifyComponent from "../../components/products/modifyComponent"
import { useQuery } from "@tanstack/react-query";
import jwtAxios from "../../util/jwtUtil";

const ModifyPage = () => {

  const {pno} = useParams();
  
  const {data, isPending, error} = useQuery({
    queryKey: ['product', pno],
    queryFn: async () => {
      const res = await jwtAxios.get(`http://localhost:8080/products/${pno}`)
      return res.data.data
    },
    staleTime: 1000 * 60 * 10
  })

  

  return (
    <div className="p-4 w-full">
      <div className="text-3xl w-fit m-auto mb-10 px-8 py-4 font-bold text-center border-b-2">
        상품 수정
      </div>

      {data &&
      <ModifyComponent product={data}></ModifyComponent>
      }
    </div>

  )
}

export default ModifyPage