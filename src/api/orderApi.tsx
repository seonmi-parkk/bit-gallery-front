
import jwtAxios from "../util/jwtUtil";
import { v4 as uuidv4 } from 'uuid';

const apiUrl = import.meta.env.VITE_API_BASE_URL;
const host = `${apiUrl}/orders`;

export const postGetOrderItemList = async (pnos:number[]) => {
  const res = await jwtAxios.post(`${host}/preview`, {"productNos":pnos})
  
  return res.data
} 

export const postRequestOrder = async (order:OrderRequest) => {
  const res = await jwtAxios.post(`${host}`,order, {
    headers : {'idempotencyKey': uuidv4()}
  })
  return res.data
}


