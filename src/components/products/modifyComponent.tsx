import { useActionState, useState, type MouseEvent } from "react"
import useCustomMove from "../../hooks/useCustomMove"
import ResultModal from "../common/resultModal"
import jwtAxios from "../../util/jwtUtil"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import LoadingSpinner from "../common/loadingSpinner"
import { IoIosCloseCircleOutline } from "react-icons/io";


const ModifyComponent = ({ product }: { product: ProductDto }) => {

  const { moveToList, moveToRead } = useCustomMove()

  const [images, setImages] = useState<string[]>([...product.uploadedFileNames])

  const deletedFileNames: string[] = [];

  const deleteOldImages = (event: MouseEvent, target: string) => {
    event.preventDefault()
    event.stopPropagation()
    setImages(prev => prev.filter(img => img !== target));
    deletedFileNames.push(target);
    const input = document.querySelector('input[name="deletedFileNames"]') as HTMLInputElement;
    if (input) {
      input.value = deletedFileNames.join(',');
    }
  }

  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await jwtAxios.patch(`http://localhost:8080/products/${product.pno}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', String(product.pno)] })
      queryClient.invalidateQueries({ queryKey: ['products/list'], exact: false })
    }
  })

  const modifyMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const header = { headers: { "Content-Type": "multipart/form-data" } }
      const res = await jwtAxios.put(`http://localhost:8080/products/${product.pno}`, formData, header)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', String(product.pno)] })
      queryClient.invalidateQueries({ queryKey: ['products/list'], exact: false })
    }
  })

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    // 수정 or 삭제 버튼 여부
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement
    const actionType = submitter.value
    console.log("actionType : ", actionType)

    if(actionType === 'modify') {
      modifyMutation.mutate(formData)
    } else if(actionType === 'delete') {
      deleteMutation.mutate()
    }
  }

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const imageUrl = `${apiUrl}/upload/product/thumb/s_`;

  return (
    <div className="mt-10 m-2 p-4 inner">

      { (deleteMutation.isPending || modifyMutation.isPending) && <LoadingSpinner/>}

      {(deleteMutation.data || modifyMutation.data) &&  
        <ResultModal message="처리 완료 되었습니다." confirmText="닫기" onConfirm={() => {
          if (modifyMutation.data?.code === 200) {
            moveToRead(product.pno)  
          } else if (deleteMutation.data?.code === 200) {
            moveToList()
          }
        }} />
      }

      <form onSubmit={handleSubmit}>

        <input type="hidden" name="pno" defaultValue={product.pno}/>

        <div className="w-full justify-center flex flex-col m-auto items-center mb-8">
          {images.map((imgFile, i) =>
            <div className="relative flex justify-center flex-col w-1/3" key={i}>
              <button className="absolute top-1 right-1 text-4xl text-gray-200"
                onClick={(event) => deleteOldImages(event, imgFile)}>
                <IoIosCloseCircleOutline/>
              </button>
              <img
                alt="img"
                src={imageUrl+imgFile} />
            </div>
          )}
        </div>
        <input type="hidden" name="deletedFileNames" />

        <div className="max-w-4xl m-auto">

          <div className="flex justify-center">
            <div className="relative mb-6 flex w-full flex-wrap">
              <div className="w-25 p-3 font-bold">이미지 추가</div>
              <input
                className="flex-1 p-3 rounded-r border border-solid border-neutral-300 shadow-md"
                type={'file'}
                name="files"
                multiple={true}>
              </input>
            </div>
          </div>
      
          <div className="flex justify-center">
            <div className="relative mb-6 flex w-full flex-wrap">
              <div className="w-25 p-3 font-bold">상품명</div>
              <input className="flex-1 p-3 rounded-r border border-solid border-neutral-300 shadow-md"
                name="pname" required defaultValue={product.pname}>
              </input>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative mb-6 flex w-full flex-wrap">
              <div className="w-25 p-3 font-bold">가격</div>
              <input
                className="flex-1 p-3 rounded-r border border-solid border-neutral-300 shadow-md"
                name="price" type={'number'} defaultValue={product.price}>
              </input>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative mb-6 flex w-full flex-wrap">
              <div className="w-25 p-3 font-bold">상품 설명</div>
              <textarea
                className="flex-1 p-3 rounded-r border border-solid border-neutral-300 shadow-md resize-y"
                name="pdesc" rows={4} required defaultValue={product.pdesc}>
              </textarea>
            </div>
          </div>

          <div className="flex justify-end p-4">
            <button type="submit" name='actionType' value='delete'
              className="rounded p-4 m-2 text-xl w-32 text-white bg-red-500">
              Delete
            </button>
            <button type="submit" name='actionType' value='modify'
              className="inline-block rounded p-4 m-2 text-xl w-32 text-white bg-orange-500">
              Modify
            </button>

            <button type="button"
              className="rounded p-4 m-2 text-xl w-32 text-white bg-blue-500"
              onClick={() => moveToList()}>
              List
            </button>
          </div>

        </div>
      </form>

    </div>


  )
}

export default ModifyComponent