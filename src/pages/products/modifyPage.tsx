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
    <div className="max-w-[900px] m-auto w-full">
      <div className="text-3xl w-fit m-auto mb-10 font-bold text-center">
        상품 수정
      </div>

      {data &&
      <ModifyComponent product={data}></ModifyComponent>
      }
    </div>

  )
}

export default ModifyPage