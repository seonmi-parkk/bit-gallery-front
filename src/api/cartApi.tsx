import jwtAxios from "../util/jwtUtil";

const host = `http://localhost:8080/cart`;

export const getCartItems = async () : Promise<CartItemResponse[]> => {
  const res = await jwtAxios.get(`${host}/items`)
  return res.data
}