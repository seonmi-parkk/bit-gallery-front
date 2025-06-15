interface CartItemRequest {
  email: string,
  pno: number,
  cino?: number,
  status?: string
}

interface CartItemResponse {
  cino: number,
  pno: number,
  pname: string,
  price: number,
  imageFile: string,
  status: string
}

interface CartItems {
  items: CartItemResponse[],
  status?: string
}

