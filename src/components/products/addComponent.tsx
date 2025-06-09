import useCustomMove from "../../hooks/useCustomMove"
import jwtAxios from "../../util/jwtUtil"
import { Navigate } from "react-router"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import LoadingSpinner from "../common/loadingSpinner"

interface ProductAddResult {
  result?: number,
  error?: string
}
const initState: ProductAddResult = {
  result: 0
}

const addProduct = async (formData: FormData) => {
  const res = await jwtAxios.post('http://localhost:8080/products/', formData)
  return {result: res.data.data.result}
}

const AddComponent = () => {

  const {moveToList} = useCustomMove()

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: addProduct,
    onSuccess: (data) => {
      console.log("-------------data :",data)
      queryClient.invalidateQueries({
        queryKey: ['products/list'],
        exact: false
      })
    }
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    mutation.mutate(formData)
  }

  
  return (
    <div className="mt-10 m-2 p-4">
      {mutation.isPending && <LoadingSpinner/>}
      {mutation.data?.result &&
        <Navigate to={`/products/read/${mutation.data.result}`} replace />
      }
      
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center">
          <div className="relative mb-6 flex w-full flex-wrap items-stretch">
            <div className="w-25 p-3 font-bold">상품명</div>
            <input className="flex-1 p-3 rounded-r border border-solid border-neutral-300"
              name="pname" >
            </input>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="relative mb-6 flex w-full flex-wrap items-stretch">
            <div className="w-25 p-3 font-bold">상품 설명</div>
            <textarea
              className="flex-1 p-3 rounded-r border border-solid border-neutral-300"
              name="pdesc" rows={4} required>
            </textarea>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="relative mb-6 flex w-full flex-wrap items-stretch">
            <div className="w-25 p-3 font-bold">가격</div>
            <input
              className="flex-1 p-3 rounded-r border border-solid border-neutral-300"
              name="price" type={'number'} required>
            </input>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="relative mb-6 flex w-full flex-wrap items-stretch">
            <div className="w-25 p-3 font-bold">이미지 파일</div>
            <input
              className="flex-1 p-3 rounded-r border border-solid border-neutral-300"
              type={'file'}
              name="files"
              multiple={true}>
            </input>
          </div>
        </div>
        <div className="flex justify-center mt-10">
          <button type="submit"
            className="rounded p-4 w-36 bg-blue-500 text-xl text-white">
            등록
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddComponent;