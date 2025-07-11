
interface Props {
  allCategories: Category[];
  selectedIds: number[];
  toggleCategory: (id: number) => void;
}

const CategoryFilterComponent = ({ allCategories, selectedIds, toggleCategory }: Props) => {
  
  return (
    <div className="flex flex-wrap gap-2.5 mb-6">
      {allCategories.map((category: Category) => (
        <button
          key={category.cgno}
          type="button"
          className={`px-5 py-2.5 rounded-full text-sm 
            ${selectedIds.includes(category.cgno) ? 'btn-blue text-white' : 'bg-main-2'}
          `}
          onClick={() => toggleCategory(category.cgno)}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilterComponent