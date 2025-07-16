import { createSearchParams, useLoaderData, useSearchParams, type LoaderFunctionArgs } from "react-router";
import ListComponent from "../../components/products/listComponent";
import useCustomMove from "../../hooks/useCustomMove";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { showErrorToast } from "../../util/toastUtil";
import LoadingSpinner from "../../components/common/loadingSpinner";
import { useEffect, useRef, useState } from "react";
import CategoryFilterComponent from "../../components/common/categoryFilterComponent";
import { useCategorySelector } from "../../hooks/useCategorySelector";
import PriceRangeSelector from "./PriceRangeSelector";
import { RiResetLeftFill } from "react-icons/ri";
import { BsFilterRight } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";

type SortType = 'LATEST' | 'SALES' | 'PRICE_ASC' | 'PRICE_DESC';

const ListPage = () => {

  const { page, size, moveToPage } = useCustomMove()

  // 카테고리
  const {selectedIds, toggleCategory, allCategories} = useCategorySelector([]);

  // 필터
  const [showFilters, setShowFilters] = useState(false);
  // 정렬기준
  const [sortBy, setSortBy] = useState<SortType>('LATEST');
  // 검색 키워드
  const [keyword, setKeyword] = useState('');
  // 검색 구분
  const [searchType, setSearchType] = useState<'TITLE' | 'CONTENT' | 'TITLE_CONTENT'>('TITLE');
  // 가격 필터링
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const PRICE_RANGE = { min: 0, max: 1000000 };

  // 검색 파라미터
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    type: 'TITLE' as 'TITLE' | 'CONTENT' | 'TITLE_CONTENT',
    minPrice: 0,
    maxPrice: 1000000,
    sortBy: 'LATEST' as SortType
  });

  const onSearch = () => {
    setSearchParams({
      keyword: keyword.trim(),
      type: searchType,
      minPrice,
      maxPrice,
      sortBy
    });
  };

  // 상품 리스트 데이터 가져오기
  const { data, error, isPending } = useQuery({
    queryKey: [
      'products/list', 
      page, size, selectedIds, 
      searchParams.keyword, searchParams.type, searchParams.minPrice, searchParams.maxPrice,
      searchParams.sortBy,
    ], // 캐싱할 때 보관할 이름 
    queryFn: async () => {
        const queryStr = createSearchParams({ 
          page: String(page), 
          size: String(size),
          categories: selectedIds.join(','),
          keyword: searchParams.keyword,
          type: searchParams.type,
          minPrice: String(searchParams.minPrice),
          maxPrice: String(searchParams.maxPrice),
          sortBy: String(searchParams.sortBy),
        }).toString();

      const res = await axios.get(`http://localhost:8080/products/list?${queryStr}`)

      if (res.data.code !== 200) {
        showErrorToast("리스트 가져오기 실패했습니다. 잠시후 다시 시도해주세요.");
      }
        return res.data.data
      },
      staleTime: 1000 * 30, // 30초 동안 캐싱 -> 30초 후 접근시에는 서버 호출
  })

  // 검색 필터 초기화
  const refreshSearchFilter = () => {
    setKeyword('');
    setSearchType('TITLE');
    setMinPrice(0);
    setMaxPrice(1000000);
    setSortBy('LATEST');
    setSearchParams(prev => ({
      ...prev,
      keyword: '',
      minPrice: 0,
      maxPrice: 1000000,
    }));
  }

  // 필터 설정 여부 
  const isFiltered = (minPrice !== 0 || maxPrice !== 1000000 || sortBy !== 'LATEST');

  // 필터 영역 Ref
  const filterRef = useRef<HTMLDivElement | null>(null); 

  // 외부 클릭 시 필터 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };

    if (showFilters) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilters]);


  return (
    <div className="w-full">
      <div className="flex justify-between">
        <div className="flex flex-1 gap-2 items-center max-w-[1134px] mb-4 mr-2">
          <select 
            value={searchType} 
            onChange={(e) => setSearchType(e.target.value as any)}
            className="px-2 py-2 h-10 border border-main-3 rounded text-sm"
            >
            <option value="TITLE">제목</option>
            <option value="CONTENT">내용</option>
            <option value="TITLE_CONTENT">제목+내용</option>
          </select>

          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="검색어 입력"
            className="flex-1 border border-main-3 h-10 px-2 py-1 text-sm"
          />

          <button onClick={onSearch} className="flex justify-center items-center w-10 h-10 bg-main-3 rounded text-lg">
            <FiSearch/>
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => refreshSearchFilter()}
            className="flex justify-center items-center w-10 h-10 border border-main-3 rounded"
          >
            <RiResetLeftFill/>
          </button>

          <div className="relative" ref={filterRef}>
            <button
              className={`flex justify-center items-center w-10 h-10 border border-main-3 rounded ${isFiltered ? 'bg-main-3' : ''} text-xl`}
              onClick={() => setShowFilters(prev => !prev)}
            >
              <span className="material-icons"><BsFilterRight/></span>
            </button>
      
            {/* 필터 */}
            {showFilters && (
              <div className="absolute z-10 right-0 top-11 mb-6 bg-main-2 border border-main-3 shadow-3xl rounded p-4  text-sm">
                <span className="font-medium text-base">가격</span>
                {/* 가격 슬라이더 */}
                <PriceRangeSelector
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  setMinPrice={setMinPrice}
                  setMaxPrice={setMaxPrice}
                />

                {/* 정렬 옵션 */}
                <div className="mt-8 flex items-center gap-4">
                  <span className="font-medium text-base">정렬 기준</span>
                  <select
                    className="border border-main-4 px-3 py-2 rounded"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortType)}
                  >
                    <option value="LATEST">최신순</option>
                    <option value="SALES">판매순</option>
                    <option value="PRICE_ASC">가격 낮은순</option>
                    <option value="PRICE_DESC">가격 높은순</option>
                  </select>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>

      <CategoryFilterComponent
        allCategories={allCategories}
        selectedIds={selectedIds}
        toggleCategory={toggleCategory}
      />

      {isPending && <LoadingSpinner/>}

      {data &&
        <ListComponent serverData={data}></ListComponent>
      }
    </div>
  );
}

export default ListPage;