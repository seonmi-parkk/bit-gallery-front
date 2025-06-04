interface CartItemRequest {
  email: string,
  pno: number,
  cino?: number,
  status?: string
}

interface CartItemResponse {
  cino: number,
  pno: number,
  pno: number,
  pname: string,
  price: number,
  imageFile: string
}

interface CartItemsArray {
  items: CartItemResponse[],
  status?: string
}