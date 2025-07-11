import useCustomMove from "../../hooks/useCustomMove"
import jwtAxios from "../../util/jwtUtil"
import { Navigate } from "react-router"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import LoadingSpinner from "../common/loadingSpinner"
import DraggableImagesComponent from "./DraggableImagesComponent"
import { useState } from "react"
import CategoryFilterComponent from "../common/categoryFilterComponent"
import { useCategorySelector } from "../../hooks/useCategorySelector"

interface ProductAddResult {
  result?: number,
  error?: string
}
const initState: ProductAddResult = {
  result: 0
}

const AddComponent = () => {

  const initialImages: DraggableImageItem[] = []
  
  const [images, setImages] = useState<DraggableImageItem[]>(initialImages);

  // 카테고리
  const {selectedIds, toggleCategory, allCategories} = useCategorySelector([], 5);

  const queryClient = useQueryClient()

  const addProduct = async (formData: FormData) => {
    // form에 이미지 추가
    images.forEach((image, idx) => {
      if(image.file) {
        formData.append(`files[${idx}]`, image.file);
      }
    })

    // form에 카테고리 추가
    selectedIds.forEach((id, index) => {
      formData.append(`productCategories[${index}]`, id.toString());
    });

    const res = await jwtAxios.post('http://localhost:8080/products/', formData)
    return {result: res.data.data.result}
  }

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
    <div className="mt-4 px-4 py-2">
      {mutation.isPending && <LoadingSpinner/>}
      {mutation.data?.result &&
        <Navigate to={`/products/read/${mutation.data.result}`} replace />
      }
      
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center mt-8">
          <div className="mb-6 flex w-full">
            <div className="w-25 p-3 font-bold flex-shrink-0">상품 이미지</div>
            <DraggableImagesComponent images={images} setImages={setImages}/>
          </div>
        </div>
        
        <div className="flex flex-wrap mb-6">
          <div className="w-25 p-3 font-bold">상품명</div>
          <input className="flex-1 p-3 rounded-r border border-solid border-main-4"
            name="pname" required>
          </input>
        </div>
            
        <div className="flex flex-wrap mb-6">
          <div className="w-25 p-3 font-bold">가격</div>
          <input
            className="flex-1 p-3 rounded-r border border-solid border-main-4"
            name="price" type={'number'} required>
          </input>
        </div>    

        <div className="flex flex-wrap mb-6">
          <div className="w-25 p-3 font-bold">상품 설명</div>
          <textarea
            className="flex-1 p-3 rounded-r border border-solid border-main-4"
            name="pdesc" rows={4} required>
          </textarea>
        </div>
        
        <div className="flex">
          <div className="w-25 p-3 font-bold shrink-0">카테고리</div>
          <div>
            <p className="my-3 opacity-70">* 카테고리는 최대 5개까지 설정 가능합니다.</p>
            <CategoryFilterComponent allCategories={allCategories} selectedIds={selectedIds} toggleCategory={toggleCategory}/>
          </div>
        </div>

        <div className="flex justify-center mt-14">
          <button type="submit"
            className="rounded p-2.5 w-26 bg-blue-500 text-white">
            등록
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddComponent;