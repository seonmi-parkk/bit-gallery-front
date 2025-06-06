import { useLoaderData, useParams } from "react-router"
import ModifyComponent from "../../components/products/modifyComponent"
import { useQuery } from "@tanstack/react-query";
import jwtAxios from "../../util/jwtUtil";

const ModifyPage = () => {

  const {pno} = useParams();
  
  const {data, isPending, error} = useQuery({
    queryKey: ['product', pno],
    queryFn: async () => {
      const res = await jwtAxios.get(`http://localhost:8080/api/products/${pno}`)
      return res.data
    },
    staleTime: 1000 * 60 * 10
  })

  return (
    <div className="p-4 w-full bg-white">
      <div className="text-3xl font-extrabold">
        Products Modify Page
      </div>
      
      {data &&
      <ModifyComponent product={data}></ModifyComponent>
      }
    </div>

  )
}

export default ModifyPage