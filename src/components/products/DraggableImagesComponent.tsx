// components/DraggableImageList.tsx
import React, { useState, type ChangeEvent } from 'react'
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'
import { AiFillCloseCircle } from "react-icons/ai";

interface DraggableImagesProps {
  images: DraggableImageItem[];
  setImages: React.Dispatch<React.SetStateAction<DraggableImageItem[]>>;
}

const DraggableImagesComponent = ({images, setImages} :DraggableImagesProps) => {

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
    <div className="py-3">
      <label className="inline-block">
        <span className="btn-blue text-white px-3 py-1.5 rounded cursor-pointer text-sm">파일 선택</span> 
        <span className="ml-2  opacity-80">* 드래그하여 순서 조정 가능합니다.</span>
        <input type="file" accept="image/*" className='hidden' multiple onChange={handleFileUpload} />
      </label>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="imageList" direction="horizontal">
          {(provided) => (
            <div
              className="flex flex-wrap"
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
                      className="relative w-32 h-32 mr-2 mt-6 border border-gray-400 rounded overflow-hidden"
                    >
                      <img
                        src={image.url}
                        alt={`img-${index}`}
                        className="w-full h-full object-cover"
                      />

                      <button className="absolute top-1 right-1 text-3xl text-gray-500"
                        onClick={(event) => handleRemoveImage(index)}>
                        <AiFillCloseCircle/>
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
