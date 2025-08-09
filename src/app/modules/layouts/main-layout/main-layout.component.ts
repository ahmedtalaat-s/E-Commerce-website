import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../../sharedComponents/navbar/navbar.component";
import { FooterComponent } from "../../sharedComponents/footer/footer.component";
import { MainpageComponent } from "../../customer/mainpage/mainpage.component";

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

}
