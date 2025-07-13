interface ProductDto {
  pno : number,
  sellerEmail : string,
  sellerImage : string,
  sellerNickname: string,
  pname : string,
  price : number,
  pdesc : string,
  uploadedFileNames : string[],
  status : string,
  statusName? : string,
  productCategories : string[],
}

interface ProductListDto {
  pno : number,
  sellerEmail : string,
  pname : string,
  price : number,
  uploadedFileNames : string[],
}

interface AdminProductResponseDto {
  pno : number,
  pname : string,
  price : number,
  createdAt : string,
  sellerNickname : string,
  productImage : string
}