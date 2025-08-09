import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { OrdersService } from '../../../services/orders.service';
import { completedOrder } from './interface';
import { order } from '../cart/interface';
import { notification } from '../../Admin/admin-dashboard/children/send-notification/interface';
import { NotificationsService } from '../../../services/notifications.service';
import { count, Subscription } from 'rxjs';
import {formatDistanceToNow } from 'date-fns'

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  user = {
    name: '',
    email: '',
    phone: '',
    address:''
  }
  isloading: boolean = false
  orders:completedOrder[]=[]
  notifications: notification[] = []
  unreadCount:number = 0;
  userId: string = localStorage.getItem('zerdyUserId') as string;
  sub!: Subscription;


  constructor(private _authserices: AuthService,private _router:Router,private _ordersServices:OrdersService,private notificationService:NotificationsService) { }
  ngOnInit(): void{
    this.getOrders()
    let user: any;
    this.isloading = true
    document.body.style.overflow='hidden'
    this._authserices.getUser().then((data) => { user = data }).then(() => {
      console.log(user);

      this.user.name=user.user_metadata.username
      this.user.email=user.email
      this.user.phone=user.phone
      this.user.address=user.user_metadata.address


      this.isloading = false
      document.body.style.overflow = 'initial'


    });

    // Fetch initial unread count
      this.notificationService.loadInitialUnreadCount(this.userId);

      // Start listening for new notifications
      this.notificationService.listenToUserNotifications(this.userId);

      // Subscribe to unread count updates
      this.notificationService.unreadCount$.subscribe(count => {
        this.unreadCount = count;
      });

    this.notificationService.getAllNotifications().then((data) => {
      this.notifications=data
    })

    this.sub = this.notificationService.onNewNotification().subscribe((notification) => {
      console.log(notification);

      this.notifications.unshift(notification)
    });

  }

  logout() {

    this._authserices.signOut().then((data) => {
      console.log(data);

      this._router.navigate(['/sign'])
      localStorage.removeItem('zerdyUserId')
      })
  }

  async getOrders() {
    this.orders=await this._ordersServices.getMyOrders()
  }
  getQuantity(arr:order[]) {
    return arr.reduce((sum,i)=>sum+i.quantity,0)
  }

   markAllAsRead() {
    if (this.unreadCount!=0) {
      this.notificationService.markAllAsRead(this.userId);
      this.notifications.map((el) => {
        el.read = true
      })
    }
  }

  getTimeAgo(date: any) {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  }
}
