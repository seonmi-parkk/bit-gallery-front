// components/DraggableImageList.tsx
import React, { useState, type ChangeEvent } from 'react'
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'
import { IoIosCloseCircleOutline } from "react-icons/io";
// interface ImageItem {
//   id: string
//   url: string
//   file?: File,
//   isNew: boolean 
// }

// const initialImages: ImageItem[] = [
//   { id: '1', url: 'http://localhost:8080/upload/product/thumb/s_c52214be-529e-4871-a108-4c6145bd7884_filippo-pluKNPG82bI-unsplash.jpg', isNew: false },
//   { id: '2', url: 'http://localhost:8080/upload/product/thumb/s_5388bf70-fdf2-48b2-9016-55c42198ee9c_filip-kvasnak-ThFBfl1JTI8-unsplash.jpg', isNew: false },
// ]

interface DraggableImagesProps {
  images: DraggableImageItem[];
  setImages: React.Dispatch<React.SetStateAction<DraggableImageItem[]>>;
}

const DraggableImagesComponent = ({images, setImages} :DraggableImagesProps) => {
  //const [images, setImages] = useState<ImageItem[]>(initialImages)

  //const [deleteImageIds, setDeleteImageIds] = useState<string[]>([])

  // 삭제버튼 클릭시 images에서 제거
  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      return prev.filter((_, i) => i !== index)
    })
  }

  // 드래그시 순서 조정
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const reordered = Array.from(images)
    const [moved] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, moved)

    setImages(reordered)
  }

  // 새로 업로드한 이미지 처리
  const handleFileUpload= (e: ChangeEvent<HTMLInputElement>) => {
    console.log("dddddd");
    const files = e.target.files
    if (!files || files.length === 0) return

    const newFiles = Array.from(files)

    newFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onload = () => {
        const newImage: DraggableImageItem = {
          id: reader.result as string,
          url: reader.result as string,
          file: file,
          isNew: true
        }
        setImages((prev) => [...prev, newImage])
      }

      reader.readAsDataURL(file)
    })

    e.target.value = '' // 동일 파일 다시 선택해도 감지되도록 초기화
  }

  return (
    <div className="space-y-4">
      <input type="hidden" name="deletedFileNames" />
      <input type="file" accept="image/*" multiple onChange={handleFileUpload} />

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="imageList" direction="horizontal">
          {(provided) => (
            <div
              className="flex space-x-4 mt-4"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {images.map((image, index) => (
                <Draggable key={image.id} draggableId={image.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="relative w-32 h-32 border border-gray-400 rounded overflow-hidden"
                    >
                      <img
                        src={image.url}
                        alt={`img-${index}`}
                        className="w-full h-full object-cover"
                      />

                      <button className="absolute top-1 right-1 text-4xl text-gray-200"
                        onClick={(event) => handleRemoveImage(index)}>
                        <IoIosCloseCircleOutline/>
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}
export default DraggableImagesComponent
