import { Component } from '@angular/core';
import { OrdersService } from '../../../../../services/orders.service';
import { completedOrder } from '../../../../customer/dashboard/interface';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { order } from '../../../../customer/cart/interface';
import { SupabaseclientService } from '../../../../../services/supabaseclient.service';
import { Router } from '@angular/router';
import { SendEmailService } from '../../../../../services/send-email.service';
import { AuthService } from '../../../../../services/auth.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
  sub!: Subscription;
  orders: completedOrder[] = []
  order!: completedOrder
  newState!:string
  constructor(private _ordersServices: OrdersService,private _supabase:SupabaseclientService,private _router:Router,private _sendMailServices:SendEmailService,private _userServices:AuthService) { }

  ngOnInit(): void{
    this.getOrders()
    this.sub = this._ordersServices.onNewOrder().subscribe((order) => {
      this.orders.unshift(order)
    });
  }

  async getOrders() {
    this.orders = await this._ordersServices.getAllOrders()

  }
  getQuantity(arr:order[]) {
    return arr.reduce((sum,i)=>sum+i.quantity,0)
  }
  changeOrder(id:any) {
    this.orders.forEach((el) => {
      if (el.id==id) {
        this.order=el
      }
    })
  }

  changeState(e:any) {
    this.newState=e.target?.value
  }
  updateState(id:any) {
    this._ordersServices.updateOrderState(id, this.newState)
    for (let i = 0; i < this.orders.length; i++){
      if (this.orders[i].id==id) {
        this.orders[i].state=this.newState
      }
    }
  }

  async downloadImg(imgUrl: any, filename: string = 'image.png') {
    let url = imgUrl.split('row-designs/')[1]
    console.log(url);

    const { data } = await this._supabase.client.storage
  .from('designs')
  .createSignedUrl(imgUrl, 60); // valid for 60s

  const link = document.createElement('a');
  link.href = data?.signedUrl as string;
  link.download = filename;
  link.click();
  }


  navigateToNotification(user_id:string) {
    this._router.navigate(['/admindashboard/notification',user_id])
  }
  async sendMail(userid: string, productName: string, productId: any) {
    let userEmail = await this._userServices.getUserEmail(userid)
    this._sendMailServices.sendReviewEmail(userEmail,productName,productId)
  }
}
