interface OrderRequest {
  productNos: number[],
  paymentType: String
}

interface OrderPreviewDto {
  pno : number,
  pname : string,
  price : number,
  imageFile : string
}

interface OrderDetailResponse {
  ono : number,
  paidAt: Date,
  totalPrice: number,
  paymentType: string,
  orderItems: OrderItem[]
}

interface OrderItem {
  pno: number,
  pname: string,
  price: number,
  imageFile: string
}