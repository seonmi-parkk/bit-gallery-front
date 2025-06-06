import { create } from "zustand"
import { deleteDeleteCartItem, getCartItems, postAddCartItem } from "../api/cartApi"

export interface CartStore {
  items: CartItemResponse[],
  status: string,
  getItems: () => void,
  addCartItem: (cartItem:CartItemRequest) => void
  deleteCartItem: (cino:number) => void
}

const useCartStore = create<CartStore> ((set) => {
  return {
    items: [],
    status: '',
    getItems: async () => {
      set({status: 'pending'})
      
      const cartData = await getCartItems()
      set({items: cartData, status:'fulfilled'})
    },
    addCartItem: async(cartItem:CartItemRequest) => {
      set({status: 'pending'})

      const changedData = await postAddCartItem(cartItem)
      set({items: changedData, status:'fulfilled'})
    },
    deleteCartItem: async(cino:number) => {
      set({status: 'pending'})

      const changedData = await deleteDeleteCartItem(cino)
      set({items: changedData, status:'fulfilled'})
    }
  }
})

export default useCartStore