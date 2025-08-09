import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resetpass-page',
  standalone: true,
  imports: [CommonModule,RouterLink,ReactiveFormsModule],
  templateUrl: './resetpass-page.component.html',
  styleUrl: './resetpass-page.component.css'
})
export class ResetpassPageComponent {
passwordForm!: FormGroup;
  isloading: boolean = false;
  messagebool: boolean = false;
  error: boolean = false;
    message: string = '';

    constructor(private _fb:FormBuilder,private _Router:Router,private _authservices:AuthService) { }

  ngOnInit(): void{
    window.scrollTo(0,0)

    this.createpasswordForm()
  }

  createpasswordForm() {

        this.passwordForm = this._fb.group({
           password:new FormControl('',[Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!\@#$%^&*_\-+=|\[\]{};:'"\?><,\/.?])/)])
        });
      }

  async onsubmit() {

  this.isloading = true;
  const password = this.passwordForm.get('password')?.value;

    const result = await this._authservices.updatePassword(password);
    if (!result.error) {
      this.message='Password updated successfully!'
      this._Router.navigate(['/sign']);
      this.error=true

    } else {
      this.message = `Error updating password:${result.error.message}`
      this.error=true
    }
    this.isloading = false;
    this.passwordForm.reset()

  }

}
