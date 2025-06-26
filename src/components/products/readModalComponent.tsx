import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useEffect} from "react"
import 'swiper/css'
import 'swiper/css/thumbs'
import { RiCloseLargeLine } from "react-icons/ri";
import ReadComponent from "./readComponent"
import LoadingSpinner from "../common/loadingSpinner"

type ReadModalComponentProps = {
  pno: number, 
  onClose: () => void,
  isOpenModal: boolean
};

const ReadModalComponent = ({ isOpenModal, pno, onClose }: ReadModalComponentProps) => {

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
      return res.data.data
    },
    staleTime: 1000 * 60 * 10
  })

  

  return (
    <>
      {isPending && <LoadingSpinner/>}
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