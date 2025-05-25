import axios from "axios";

export const API_SERVER_HOST = 'http://localhost:8080'

const prefix = `${API_SERVER_HOST}/api/todo`

//async 함수의 리턴은 무조건 promise -> promise<Todo>
export const getOne = async (tno: number | string) => {
  const res = await axios.get(`${prefix}/${tno}`)
  return res.data
}

export const getList = async (pageParam : PageParam) => {
  const res = await axios.get(`${prefix}/list`, {params: pageParam})
  return res.data
}

