interface Todo {
  tno: number,
  title: string,
  userId: number,
  content: string,
  dueDate: string | null,
  complete: boolean
}

interface AddTodo {
  title : string,
  userId : string,
  dueDate : string
}

interface ModifyTodo {
  tno : number,
  title : string,
  content : string,
  dueDate : string | null,
  complete : boolean
}