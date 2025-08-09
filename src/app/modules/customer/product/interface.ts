export interface review{
  id ?:string,
    comment :string,
    rating: number,
    user_id :string,
    product_id? :string,
  created_at?: string,
  profiles?:any
}
