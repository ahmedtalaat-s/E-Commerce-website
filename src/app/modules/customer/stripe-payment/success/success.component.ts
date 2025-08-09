import { Component, OnDestroy } from '@angular/core';
import { order } from '../../cart/interface';
import { CartService } from '../../../../services/cart.service';
import { AuthService } from '../../../../services/auth.service';
import { completedOrder } from '../../dashboard/interface';
import { RouterLink } from '@angular/router';
import { OrdersService } from '../../../../services/orders.service';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})
export class SuccessComponent {
  orders: order[] = []
  currentUser!: any;
  payedOrder!: completedOrder
  address!: string;
  totalPrice :number=0
  constructor(private _cartServices: CartService,private _authservices:AuthService,private _ordersServices:OrdersService) { }

  async ngOnInit(): Promise<void>{
    this.address=localStorage.getItem('address')?.split('\n').join(' ') as string
    this.orders = await this._cartServices.getCartByUser()
    this.currentUser = await this._authservices.getUser()
    if (this.orders.length) {
      this.orders.forEach(el => {
      this.totalPrice+=el.totalPrice
    })
    this.payedOrder = {
      address: this.address,
      customer_name: this.currentUser.user_metadata.username,
      state: 'paid',
      user_id: this.currentUser.id,
      details: this.orders,
      total_price:this.totalPrice
    }
    console.log(this.payedOrder);

      this._ordersServices.addOrder(this.payedOrder).then((data) => {
        console.log(data);
        localStorage.removeItem('payment-In-Progress')
        this._cartServices.clearCartForUser()
      })

  }
    }
}
