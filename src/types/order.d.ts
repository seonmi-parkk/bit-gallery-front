interface OrderRequest {
  productNos: number[],
  paymentMethod: String
}

interface OrderPreviewDto {
  pno : number,
  pname : string,
  price : number,
  imageFile : string
}