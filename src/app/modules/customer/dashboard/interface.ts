import { order } from "../cart/interface";

export interface completedOrder{
  id ?:string,
  user_id :string,
  name ?:string,
  customer_name :string,
  total_price :number,
  state :string,
  date ?:Date,
  details: order[],
  address:string
}
