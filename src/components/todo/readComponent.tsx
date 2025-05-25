import { useEffect, useState } from "react";
import { getOne } from "../../api/todoApi";
import useCustomMove from "../../hooks/UseCustomMove";

function ReadComponent({tno} : {tno:number}) {// js일경우 {tno}만해줘도 됨

  const [todo, setTodo] = useState<Todo | undefined >()

  const {moveToList,moveToModify} = useCustomMove()

  useEffect(() => {

    getOne(tno).then(data => {

      console.log(data)

      setTodo(data)
    })

  }, [tno]) // tno값이 변경될때만 동작

  return ( 
    <>
    { todo &&  //todo가 존재할때만
      <div className="border-2 border-sky-200 mt-10 m-2 p-4 text-2xl">
        {makeDiv('Tno', todo.tno)}
        {makeDiv('Writer', todo.userId)}
        {makeDiv('Title', todo.title)}
        {makeDiv('Content', todo.content)}
        {makeDiv('Complete', todo.complete ? 'Completed' : 'Not Yet')}

        <div className="flex justify-end p-4">
          <button type="button" 
            className="rounded p-4 m-2 text-xl w-32 text-white bg-blue-500"
            onClick={() => moveToList()}>
              List
          </button>

          <button type="button" 
            className="rounded p-4 m-2 text-xl w-32 text-white bg-red-500"
            onClick={() => moveToModify(tno)}>
              Modify
          </button>
        </div>

      </div>
    } 
    </>
   );
}

const makeDiv = (title:string, value: string | number) =>
  <div className="flex justify-center">
    <div className="relative mb-4 flex w-full flex-wrap items-stretch">
      <div className="w-1/5 p-6 text-right font-bold">
      {title}
      </div>
      <div className="w-4/5 p-6 rounded-r border border-solid shadow-md">
      {value}
      </div>
    </div>
  </div>

export default ReadComponent;