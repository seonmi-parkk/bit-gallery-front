import { createSearchParams, useNavigate, useSearchParams } from "react-router"

function useCustomMove() : UseCustomMoveReturn { // return 타입 = UseCustomMoveReturn
  const navigate = useNavigate()
  const [queryParams] = useSearchParams() // useSearchParams-> queryparameter가져오기

  const pageStr: string | null = queryParams.get('page')
  const sizeStr: string | null = queryParams.get('size')

  const page : number = pageStr ? Number(pageStr) : 1
  const size : number = sizeStr ? Number(sizeStr) : 10

  const queryDefault = createSearchParams({// -> queryparameter 생성
    page: String(page),
    size: String(size)
  }).toString()

  const moveToModify = (tno:number) => {
    navigate({ pathname: `../modify/${tno}`, search: queryDefault})
  }

  const moveToRead = (tno:number) => {
    navigate({ pathname: `../read/${tno}`, search: queryDefault})
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
    } else {
      queryStr = queryDefault
    }

    navigate({ pathname: `../list`, search: queryStr})
  }

  return {page, size, moveToList, moveToModify, moveToRead}
}

export default useCustomMove