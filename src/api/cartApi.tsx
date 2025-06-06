import jwtAxios from "../util/jwtUtil";

const host = `http://localhost:8080/cart`;

export const getCartItems = async () : Promise<CartItemResponse[]> => {
  const res = await jwtAxios.get(`${host}`)
  console.log("getCartItems.res.data" ,res.data )
  return res.data
}
export const postAddCartItem = async (cartItem:CartItemRequest) => {
  const res = await jwtAxios.post(`${host}`,cartItem)
  return res.data
} 
export const deleteDeleteCartItem = async (cino:number) => {
  const res = await jwtAxios.delete(`${host}/${cino}`)
  return res.data
}