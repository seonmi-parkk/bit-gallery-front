import { create } from "zustand"
import { deleteDeleteCartItem, getCartItems, postAddCartItem } from "../api/cartApi"
import { showErrorToast, showSuccessToast } from "../util/toastUtil"

export interface CartStore {
  items: CartItemResponse[],
  status: ''|'pending'|'fulfilled'|'error',
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
      console.log("items: cartData.data : ",cartData.data);
      set({items: cartData.data, status:'fulfilled'})
    },
    addCartItem: async(cartItem:CartItemRequest) => {
      set({status: 'pending'})
      console.log("addCartItem 요청직전");
      const changedData = await postAddCartItem(cartItem)
      if(changedData.code === 40001){
        showErrorToast(changedData.message);
        return;
      }
      set({items: changedData.data, status:'fulfilled'})
      showSuccessToast('해당 상품이 장바구니에 담겼습니다.');
      
    },
    deleteCartItem: async(cino:number) => {
      set({status: 'pending'})

      const changedData = await deleteDeleteCartItem(cino)
      set({items: changedData.data, status:'fulfilled'})
    }
  }
})

export default useCartStore