import { useActionState, useState, type MouseEvent } from "react"
import useCustomMove from "../../hooks/useCustomMove"
import ResultModal from "../common/resultModal"
import jwtAxios from "../../util/jwtUtil"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import LoadingSpinner from "../common/loadingSpinner"
import { IoIosCloseCircleOutline } from "react-icons/io";
import type { AxiosError } from "axios"
import { showErrorToast } from "../../util/toastUtil"
import DraggableImagesComponent from "./DraggableImagesComponent"
import { API_BASE_URL } from "../../api/apiUrl"
import CategoryFilterComponent from "../common/categoryFilterComponent"
import { useCategorySelector } from "../../hooks/useCategorySelector"


const ModifyComponent = ({ product }: { product: ProductDto }) => {
  const { moveToList, moveToRead } = useCustomMove()
  
  const urlPrefix = API_BASE_URL+"/upload/product/thumb/s_";
  
  const initialImages: DraggableImageItem[] = []

  // 기존 이미지 노출
  product.uploadedFileNames.forEach((value) => {
    initialImages.push({id:value, url:urlPrefix+value, isNew:false})
  })
  

  //const [images, setImages] = useState<string[]>([...product.uploadedFileNames])

  //const deletedFileNames: string[] = [];

  // const deleteOldImages = (event: MouseEvent, target: string) => {
  //   event.preventDefault()
  //   event.stopPropagation()
  //   setImages(prev => prev.filter(img => img !== target));
  //   deletedFileNames.push(target);
  //   const input = document.querySelector('input[name="deletedFileNames"]') as HTMLInputElement;
  //   if (input) {
  //     input.value = deletedFileNames.join(',');
  //   }
  // }

  const [images, setImages] = useState<DraggableImageItem[]>(initialImages);

  // 카테고리
  const {selectedIds, toggleCategory, allCategories} = useCategorySelector(product.productCategories, 5);

  const queryClient = useQueryClient()

  // 삭제 요청
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

  // 수정 요청
  const modifyMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const header = { headers: { "Content-Type": "multipart/form-data" } }
      const res = await jwtAxios.put(`http://localhost:8080/products/${product.pno}`, formData, header)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', String(product.pno)] })
      queryClient.invalidateQueries({ queryKey: ['products/list'], exact: false })
    },
    onError: (error) => {
      const axiosError = error as AxiosError<ApiResponse>;

      if (axiosError.response) {
        console.error('서버 응답 에러:', axiosError.response.data)
        showErrorToast(axiosError.response?.data?.message.toString());

      } else if (axiosError.request) {
        console.error('요청 미전송');
        showErrorToast('서버에 연결할 수 없습니다.');
      } else {
        console.error('기타 에러:', axiosError.message)
        showErrorToast("알 수 없는 오류가 발생했습니다.")
      }
    }

  })

  // 수정/삭제 버튼 클릭시 
  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    // 수정 or 삭제 버튼 여부
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement
    const actionType = submitter.value
    console.log("actionType : ", actionType)

    if(actionType === 'modify') {
      // 새 이미지 업로드
      console.log("images",images);
      images.forEach((image, idx) => {
        formData.append(`images[${idx}].fileName`, image.id);
        formData.append(`images[${idx}].isNew`, image.isNew.toString());
        if (image.file) {
          formData.append(`images[${idx}].file`, image.file); 
        }
      })

      // form에 카테고리 추가
      selectedIds.forEach((id, index) => {
        formData.append(`productCategories[${index}]`, id.toString());
      });


      modifyMutation.mutate(formData)
    } else if(actionType === 'delete') {
      deleteMutation.mutate()
    }
  }

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const imageUrl = `${apiUrl}/upload/product/thumb/s_`;

  return (
    <div className="mt-10 p-4 inner">
      
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

        <div className="">
          <div className="flex justify-center">
            <div className="relative mb-6 flex w-full">
              <div className="flex-shrink-0 w-25 p-3 font-bold">상품 이미지</div>
              <DraggableImagesComponent images={images} setImages={setImages}/>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative mb-6 flex w-full flex-wrap">
              <div className="w-25 p-3 font-bold">상품명</div>
              <input className="flex-1 p-3 rounded-r border border-solid border-main-4"
                name="pname" required defaultValue={product.pname}>
              </input>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative mb-6 flex w-full flex-wrap">
              <div className="w-25 p-3 font-bold">가격</div>
              <input
                className="flex-1 p-3 rounded-r border border-solid border-main-4"
                name="price" type={'number'} defaultValue={product.price}>
              </input>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative mb-6 flex w-full flex-wrap">
              <div className="w-25 p-3 font-bold">상품 설명</div>
              <textarea
                className="flex-1 p-3 rounded-r border border-solid border-main-4 resize-y"
                name="pdesc" rows={4} required defaultValue={product.pdesc}>
              </textarea>
            </div>
          </div>

          <div className="flex">
            <div className="relative mb-6 flex">
              <div className="w-25 p-3 font-bold shrink-0">카테고리</div>
              <div>
                <p className="my-3 opacity-70">* 카테고리는 최대 5개까지 설정 가능합니다.</p>
                <CategoryFilterComponent allCategories={allCategories} selectedIds={selectedIds} toggleCategory={toggleCategory}/>
              </div>
            </div>
          </div>

          <div className="relative flex gap-3 justify-end mt-8">                  
            <button type="submit" name='actionType' value='modify'
              className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded p-2.5 w-26 bg-blue-500 text-white">
              수정
            </button>

            <button type="submit" name='actionType' value='delete'
              className="rounded p-2.5 w-26 bg-main-2 text-white">
              삭제
            </button>

            <button type="button"
              className="rounded p-2.5 w-26 bg-main-2 text-white"
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