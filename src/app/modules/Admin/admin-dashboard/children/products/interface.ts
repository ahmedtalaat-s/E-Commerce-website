export interface product{
  id?: string,
  name: string,
  description: string,
  price: number,
  image_url: string,
  category_id: string,
  colors:[],
  sizes: [],
  stock_quantity:number
}
