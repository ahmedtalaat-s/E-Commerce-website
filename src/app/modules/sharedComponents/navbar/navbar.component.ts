import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NotificationsService } from '../../../services/notifications.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  loggedBool: boolean = false
  adminBool: boolean = false
   unreadCount = 0;
  userId: string = localStorage.getItem('zerdyUserId') as string;
  constructor(private _router: Router,private _notificationService:NotificationsService) {
    this.loggedBool=localStorage.getItem('zerdyUserId')?true:false
    this.adminBool=localStorage.getItem('zerdyUserRole')?true:false
  }
  scroll(target:string) {
    let url = this._router.url.slice(1)
    if (url == 'main') {
      let top:number = window.document.getElementById(target)?.offsetTop as number
      window.scrollTo({left:0,top:top,behavior:'smooth'})
    } else {
      this._router.navigate(['main']).then(() => {
        let top:number = window.document.getElementById(target)?.offsetTop as number
      window.scrollTo({left:0,top:top,behavior:'smooth'})
      })

    }

  }

  navigationconditio() {
    if (this.loggedBool) {
      if (this.adminBool) {
        this._router.navigate(['/admindashboard'])
      } else {
        this._router.navigate(['/dashboard'])

      }
    } else {
      this._router.navigate(['/sign'])
    }
  }

    ngOnInit() {
    if (this.userId) {
      // Fetch initial unread count
      this._notificationService.loadInitialUnreadCount(this.userId);

      // Start listening for new notifications
      this._notificationService.listenToUserNotifications(this.userId);

      // Subscribe to unread count updates
      this._notificationService.unreadCount$.subscribe(count => {
        this.unreadCount = count;
      });
    }
  }

  markAllAsRead() {
      this._notificationService.markAllAsRead(this.userId);
  }

}
