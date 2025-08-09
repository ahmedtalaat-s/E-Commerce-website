import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterOutlet,RouterLink,RouterLinkActive],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

    constructor(private _authserices: AuthService,private _router:Router) { }


  logout() {

    this._authserices.signOut().then((data) => {
      console.log(data);

      this._router.navigate(['/sign'])
      localStorage.removeItem('zerdyUserId')
      })
    }
}
