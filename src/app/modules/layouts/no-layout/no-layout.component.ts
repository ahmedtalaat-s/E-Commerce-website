import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-no-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './no-layout.component.html',
  styleUrl: './no-layout.component.css'
})
export class NoLayoutComponent {

}
