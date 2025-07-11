
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import jwtAxios from "../util/jwtUtil";
import { showErrorToast } from "../util/toastUtil";


export const useCategorySelector = (initialNames: string[] = [], maxCount?: number) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // 카테고리 리스트 가져오기
  const {data: allCategories = [], isSuccess} = useQuery({
    queryKey: ['categorys'], // 캐싱할 때 보관할 이름 
    queryFn: async () => {
      const res = await jwtAxios.get(`http://localhost:8080/categories/list`)

      if (res.data.code !== 200) {
        showErrorToast("카테고리 가져오기 실패했습니다. 잠시후 다시 시도해주세요.");
      }
        return res.data.data
      },
      staleTime: 1000 * 60 * 30, // 30분 동안 캐싱 
  })

  useEffect(() => {
    if (!isSuccess) return;

    const ids = allCategories
      .filter((c: Category) => initialNames.includes(c.name))
      .map((c: Category) => c.cgno);

    // 이미 같은 값이면 setState 안 함
    setSelectedIds(prev => {
      const isSame = prev.length === ids.length && prev.every((v, i) => v === ids[i]);
      return isSame ? prev : ids;
    });
  }, [initialNames.join(','), isSuccess]);


  // 필터 선택 토글
  const toggleCategory = (id: number) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        // 이미 선택된 경우 -> 제거
        return prev.filter(categoryId => categoryId !== id);
      } else {
        // 새로 선택하는 경우 (최대 수량 제한)
        if (maxCount && prev.length >= maxCount) {
          showErrorToast(`카테고리는 최대 ${maxCount}개까지만 선택 가능합니다.`);
          return prev;
        }
        return [...prev, id];
      }
    });
  };
  
  return {
    selectedIds,
    setSelectedIds,
    toggleCategory,
    allCategories,
  };
};
