
interface PageComponentProps<T> {
  serverData: pageResponseDto<T>,
  movePage: ({page}:PageParam) => void
}

function PageComponent({serverData, movePage} : PageComponentProps<any>) {
  return ( 
    // prev가 true이면 prev 버튼 
    <div className="m-6 flex justify-center">
      {serverData.prev &&
        <div 
        className="cursor-pointer m-2 p-2 w-16 text-center font-bold  text-blue-400 "
        onClick={() => movePage({page:serverData.prevPage} )}>
          Prev 
        </div>
      } 

      {serverData.pageNumList.map(pageNum => 
        <div 
          key={pageNum}
          className={ `cursor-pointer m-2 p-2 w-12 text-center rounded shadow-md text-white ${serverData.currentPage === pageNum? 'bg-main-6':'bg-main-2'}`}
          onClick={() => movePage( {page:pageNum})}>
            {pageNum}
        </div>
      )}

      {/* next가 true이면 next버튼 */}
      {serverData.next &&
        <div 
          className="cursor-pointer m-2 p-2 w-16 text-center font-bold text-blue-400"
          onClick={() => movePage( {page:serverData.nextPage})}> 
            Next 
        </div>
      } 

    </div>  

  );
}

export default PageComponent;