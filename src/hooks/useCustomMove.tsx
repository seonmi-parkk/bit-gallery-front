import { useState } from "react"
import { createSearchParams, useNavigate, useSearchParams } from "react-router"

function useCustomMove() : UseCustomMoveReturn { // return 타입 = UseCustomMoveReturn
  const navigate = useNavigate()
  const [queryParams] = useSearchParams() // useSearchParams-> queryparameter가져오기

  // 동일 페이지 클릭 처리
  const [refresh, setRefresh] = useState<boolean>(false)

  const pageStr: string | null = queryParams.get('page')
  const sizeStr: string | null = queryParams.get('size')

  const page : number = pageStr ? Number(pageStr) : 1
  const size : number = sizeStr ? Number(sizeStr) : 10

  const queryDefault = createSearchParams({// -> queryparameter 생성
    page: String(page),
    size: String(size)
  }).toString()

  const moveToModify = (tno:number) => {
    navigate({ pathname: `/products/modify/${tno}`, search: queryDefault})
  }

  const moveToRead = (tno:number) => {
    navigate({ pathname: `/products/read/${tno}`, search: queryDefault})
  }

  // 페이지 이동하기 위해 파라미터가 있으면 사용 / 없으면 기본
  const moveToList = (pageParam? : PageParam) => {
    let queryStr = ''

    if(pageParam) {
      const pageNum = Number(pageParam.page) || 1
      const sizeNum = Number(pageParam.size) || 10
      queryStr = createSearchParams({
        page: String(pageNum),
        size: String(sizeNum),
      }).toString()

      // 동일 페이지 클릭 처리
      // queryDefault : url로 부터 가져온 쿼리 파라미터
      // queryStr : 사용자가 전달한 page, size 값
      if(queryStr === queryDefault) {
        setRefresh(!refresh)
      }

    } else {
      queryStr = queryDefault  
    }

    navigate({ pathname: `/products/list`, search: queryStr})
  }

  return {page, size, refresh, moveToList, moveToModify, moveToRead}
}

export default useCustomMove