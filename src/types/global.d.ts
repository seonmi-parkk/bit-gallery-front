interface PageParam {
  page ?: string | number, //? -> 없을 수 도 있음. | -> 문자거나 숫자
  size ?: string | number 
}

interface UseCustomMoveReturn {
  moveToList : (pageParam?: PageParam) => void,
  moveToModify : (tno:number) => void,
  moveToRead : (tno:number) => void,
  moveToPage : (newPage: number) => void,
  page : number,
  size: number,
  refresh: boolean
}

interface PageRequestDto {
  page : number,
  size : number
}

interface pageResponseDto<T> {
  dtoList : T[],
  pageNumList : number[],
  pageRequestDto : PageRequestDto | null,
  prev : boolean,
  next : boolean,
  totalCount : number,
  prevPage : number,
  nextPage : number,
  totalPage : number,
  currentPage : number
}

interface ApiResponse {
  code: number,
  message: string,
  data?: any 
}

interface ResultModel {
  title : string,
  content : string,
  callbackFn? : () => void
}