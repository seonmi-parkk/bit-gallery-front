import { createSearchParams, useLoaderData, useSearchParams, type LoaderFunctionArgs } from "react-router";
import ListComponent from "../../components/products/listComponent";
import useCustomMove from "../../hooks/useCustomMove";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { showErrorToast } from "../../util/toastUtil";
import LoadingSpinner from "../../components/common/loadingSpinner";
import { useState } from "react";
import CategoryFilterComponent from "../../components/common/categoryFilterComponent";
import { useCategorySelector } from "../../hooks/useCategorySelector";


const ListPage = () => {

  const { page, size, moveToPage } = useCustomMove()

  // 카테고리
  const {selectedIds, toggleCategory, allCategories} = useCategorySelector([]);


  // 상품 리스트 데이터 가져오기
  const { data, error, isPending } = useQuery({
    queryKey: ['products/list', page, size, selectedIds], // 캐싱할 때 보관할 이름 
    queryFn: async () => {
        const queryStr = createSearchParams({ 
          page: String(page), 
          size: String(size),
          categories: selectedIds.join(',')
        }).toString();

      const res = await axios.get(`http://localhost:8080/products/list?${queryStr}`)

      if (res.data.code !== 200) {
        showErrorToast("리스트 가져오기 실패했습니다. 잠시후 다시 시도해주세요.");
      }
        return res.data.data
      },
      staleTime: 1000 * 30, // 30초 동안 캐싱 -> 30초 후 접근시에는 서버 호출
  })

  return (
    <div className="w-full">
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