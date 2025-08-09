import { Component } from '@angular/core';
import { OrdersService } from '../../../../../services/orders.service';
import { ProductServicesService } from '../../../../../services/product-services.service';
import { AuthService } from '../../../../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  ordersCount!: number;
  productsCount!: number;
  usersCount!: number
  constructor(private ordersServices:OrdersService,private productServices:ProductServicesService,private userServices:AuthService){}

  ngOnInit(): void{
  this.getAnalytics()
}
  async getAnalytics() {
    this.ordersCount = await this.ordersServices.getOrdersCount()
    this.productsCount=await this.productServices.getProductsCount()
    this.usersCount = await this.userServices.getUsersCount()
  }

}
