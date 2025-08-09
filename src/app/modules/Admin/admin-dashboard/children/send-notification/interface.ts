export interface notification{
  id?:string
  user_id: string,
  title: string,
  message: string,
  created_at?: Date,
  read:boolean
}
