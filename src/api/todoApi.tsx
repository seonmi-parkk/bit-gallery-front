import axios from "axios";
import jwtAxios from "../util/jwtUtil";

export const API_SERVER_HOST = 'http://localhost:8080'

const prefix = `${API_SERVER_HOST}/api/todo`

//async 함수의 리턴은 무조건 promise -> promise<Todo>
export const getOne = async (tno: number | string) => {
  const res = await jwtAxios.get(`${prefix}/${tno}`)
  return res.data
}

export const getList = async (pageParam : PageParam) => {
  const res = await jwtAxios.get(`${prefix}/list`, {params: pageParam})
  return res.data
}

export const addPost = async (todoObj:AddTodo) => {
  const res = await jwtAxios.post(`${prefix}/`, todoObj)
  return res.data
}

export const putOne = async (todoObj : ModifyTodo) => {
  const res = await jwtAxios.put(`${prefix}/${todoObj.tno}`, todoObj)
  return res.data
}

export const deleteOne = async (tno : number) => {
  const res = await jwtAxios.delete(`${prefix}/${tno}`)
  return res.data
}

