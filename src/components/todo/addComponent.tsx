import { useState, type ChangeEvent } from "react";
import { addPost } from "../../api/todoApi";
import ResultModal from "../common/resultModal";
import useCustomMove from "../../hooks/useCustomMove";

const initState: AddTodo = {
  title: '',
  userId: '',
  dueDate: ''
}

function AddComponent() {

  const [todo, setTodo] = useState<AddTodo>({ ...initState }) 
  const [result, setResult] = useState<number | null> (null)

  const {moveToList} = useCustomMove()

  const handleChangeTodo = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log("e.target: ",e.target);
    setTodo((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleClickAdd = (): void => {
    addPost(todo)
      .then(result => {
        console.log(result)
        setResult(result.tno)
        
        // 초기화
        setTodo({ ...initState })

      }).catch(e => {
        console.error(e)
      })
  }

   const closeModal = () => {
    setResult(null)
    moveToList()
   }

  return (
    <div className="border-2 border-sky-200 mt-10 m-2 p-4">

      {result && <ResultModal title="등록 처리 완료" content={`${result}번 처리`} callbackFn={closeModal} />}
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">TITLE</div>
          <input className="w-4/5 p-6 rounded-r border border-solid border-neutral-500 shadow-md"
            name="title"
            type={'text'}
            value={todo.title}
            onChange={handleChangeTodo}
          >
          </input>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">WRITER</div>
          <input className="w-4/5 p-6 rounded-r border border-solid border-neutral-500 shadow-md"
            name="userId"
            type={'text'}
            value={todo.userId}
            onChange={handleChangeTodo}
          >
          </input>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">DUEDATE</div>
          <input className="w-4/5 p-6 rounded-r border border-solid border-neutral-500 shadow-md"
            name="dueDate"
            type={'date'}
            value={todo.dueDate}
            onChange={handleChangeTodo}
          >
          </input>
        </div>
      </div>

      <div className="flex justify-end">
        <div className="relative mb-4 flex p-4 flex-wrap items-stretch">
          <button type="button"
            className="rounded p-4 w-36 bg-blue-500 text-xl text-white "
            onClick={handleClickAdd}
          >
            ADD
          </button>
        </div>
      </div>
    </div>


  );
}

export default AddComponent;