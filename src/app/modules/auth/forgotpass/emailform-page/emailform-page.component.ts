import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-emailform-page',
  standalone: true,
  imports: [CommonModule,RouterLink,ReactiveFormsModule],
  templateUrl: './emailform-page.component.html',
  styleUrl: './emailform-page.component.css'
})
export class EmailformPageComponent {
  emailForm!: FormGroup;
  message: string = '';
  isloading: boolean = false;

    constructor(private _fb:FormBuilder,private _Router:Router,private _authservices:AuthService) { }

  ngOnInit(): void{
    window.scrollTo(0,0)

    this.createEmailForm()
  }

  createEmailForm() {

        this.emailForm = this._fb.group({
          email:new FormControl('',[Validators.required, Validators.email]),
        });
      }

  async onsubmit() {

  this.isloading = true;

    const email = this.emailForm.get('email')?.value;
         this.isloading = true;
    const { data, error } = await this._authservices.resetPassword(email)
    console.log(data);

         if (error) {
           this.message=error.message
    }
    this.isloading = false;
    this.emailForm.reset()

  }

}
