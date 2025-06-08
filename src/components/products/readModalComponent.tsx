import { useQuery } from "@tanstack/react-query"
import PendingModal from "../common/pendingModal"
import axios from "axios"
import useCustomMove from "../../hooks/useCustomMove"
import UseCustomCart from "../../hooks/useCustomCart"
import { useEffect, type MouseEventHandler } from "react"
import { useState } from 'react'

import 'swiper/css'
import 'swiper/css/thumbs'
import useLoginStore from "../../zstore/useLoginStore"
import { RiCloseLargeLine } from "react-icons/ri";
import ReadComponent from "./readComponent"


const ReadModalComponent = ({ pno, onClose }: { pno: number, onClose: () => void }) => {

  useEffect(() => {
    // body 스크롤 막기
    document.body.style.overflow = 'hidden';
    return () => {
      // 닫을 때 원래대로 복구
      document.body.style.overflow = '';
    };
  }, []);

  //const {pno} = useParams()
  

  const { data, isPending, error } = useQuery({
    queryKey: ['product', pno],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:8080/products/${pno}`)
      return res.data
    },
    staleTime: 1000 * 60 * 10
  })

  

  return (
    <>
      {isPending && <PendingModal />}
      {data &&
        <>
          <div
            className="fixed top-0 left-0 z-10 inset-0 flex items-start justify-center w-screen h-screen px-10 py-4 bg-modal-back cursor-pointer"
            onClick={onClose}
          >
            <div
              className="xl:max-w-[1000px] w-11/12 h-[96vh] overflow-y-auto bg-main border border-main-6 rounded-md"
              onClick={(e) => e.stopPropagation()}
            >
              <ReadComponent data={data}/>
            </div>

            {/* close 버튼 */}
            <button onClick={onClose} className="mx-4 my-2 text-xl opacity-80"><RiCloseLargeLine /></button>
          </div>
        </>
      }
    </>
  )
}

export default ReadModalComponent