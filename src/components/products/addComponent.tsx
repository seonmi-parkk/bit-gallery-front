import { useActionState } from "react"
import PendingModal from "../common/pendingModal"
import ResultModal from "../common/resultModal"
import useCustomMove from "../../hooks/useCustomMove"
import jwtAxios from "../../util/jwtUtil"
import { Navigate } from "react-router"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface ProductAddResult {
  result?: number,
  error?: string
}
const initState: ProductAddResult = {
  result: 0
}

const addProduct = async (formData: FormData) => {
  const res = await jwtAxios.post('http://localhost:8080/products/', formData)
  return {result: res.data.result}
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

  const closeModal = () => {
    moveToList()
  }

  return (
    <div className="border-2 border-sky-200 mt-10 m-2 p-4">
      {mutation.isPending && <PendingModal/>}
      {mutation.data?.result &&
        <Navigate to={`/products/read/${mutation.data.result}`} replace />
      }
      
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center">
          <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <div className="w-1/5 p-6 text-right font-bold">Product Name</div>
            <input className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
              name="pname" >
            </input>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <div className="w-1/5 p-6 text-right font-bold">Desc</div>
            <textarea
              className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md resize-y"
              name="pdesc" rows={4} required>
            </textarea>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <div className="w-1/5 p-6 text-right font-bold">Price</div>
            <input
              className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
              name="price" type={'number'} required>
            </input>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <div className="w-1/5 p-6 text-right font-bold">Files</div>
            <input
              className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
              type={'file'}
              name="files"
              multiple={true}>
            </input>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="relative mb-4 flex p-4 flex-wrap items-stretch">
            <button type="submit"
              className="rounded p-4 w-36 bg-blue-500 text-xl text-white">
              ADD
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddComponent;