import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule,RouterLink,ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements AfterViewInit {
  // signup properties
  signUpForm!: FormGroup;
  isloading: boolean = false;
  emailExists: boolean = false;
  signUpsuccess: boolean = false;
  // signin properties
  signInForm!: FormGroup;
    error: boolean = false;
    errormsg: string = '';


  constructor(private _fb:FormBuilder,private _Router:Router,private _authservices:AuthService) { }

  ngOnInit(): void{
    window.scrollTo(0,0)

    this.createSignUpForm()
      this.createSignInForm()


  }



  ngAfterViewInit(): void {
    const toggleSwitch = document.getElementById('toggleSwitch');
    const cardWrapper = document.getElementById('cardWrapper');
    const loginToggle = document.querySelector('.login-toggle') as HTMLElement;
    const signupToggle = document.querySelector('.signup-toggle') as HTMLElement;

    function switchToSignup() {
      cardWrapper?.classList.add('signup-mode');
      toggleSwitch?.classList.add('signup-mode');
      loginToggle?.classList.remove('active');
      signupToggle?.classList.add('active');
    }

    function switchToLogin() {
      cardWrapper?.classList.remove('signup-mode');
      toggleSwitch?.classList.remove('signup-mode');
      signupToggle?.classList.remove('active');
      loginToggle?.classList.add('active');
    }

    toggleSwitch?.addEventListener('click', () => {
      if (cardWrapper?.classList.contains('signup-mode')) {
        switchToLogin();
      } else {
        switchToSignup();
      }
    });

    loginToggle?.addEventListener('click', switchToLogin);
    signupToggle?.addEventListener('click', switchToSignup);

     const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
       input.addEventListener('focus', () => {
    (input.parentElement as HTMLElement).style.transform = 'translateY(-2px)';
  });

  input.addEventListener('blur', () => {
    (input.parentElement as HTMLElement).style.transform = 'translateY(0)';
  });
    });


  }

  createSignUpForm() {

    this.signUpForm = this._fb.group({
      userName:new FormControl('',[Validators.required,Validators.minLength(4)]),
      email:new FormControl('',[Validators.required, Validators.email]),
      password:new FormControl('',[Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!\@#$%^&*_\-+=|\[\]{};:'"\?><,\/.?])/)]),
    });
  }
  createSignInForm() {

      this.signInForm = this._fb.group({
        email:new FormControl('',[Validators.required, Validators.email]),
        password:new FormControl('',[Validators.required]),
      });
    }

  async onsubmitsignup() {
    const userName = this.signUpForm.get('userName')?.value;
    const email = this.signUpForm.get('email')?.value;
    const password = this.signUpForm.get('password')?.value;
    this.isloading = true;

    const { data, error } = await this._authservices.signUp(userName,email,password)
    if (error) {
      console.error('Login failed:', error.message);
       this.isloading = false;
            this.emailExists=true
    } else {
      this.isloading = false;
      this.signUpsuccess=true
      this.signUpForm.reset()
    }

  }

  async onsubmitsignin() {


    const email = this.signInForm.get('email')?.value;
    const password = this.signInForm.get('password')?.value;
    this.isloading = true;

    const { data, error } = await this._authservices.signIn(email,password)
    if (error) {
       this.isloading = false;
       this.errormsg=error.message
      this.error = true



    } else {
      this.isloading = false;

      localStorage.setItem('zerdyUserId', data.user?.id as string)
      this.signInForm.reset()
      if (data.user.user_metadata['role'] == 'zerdyAdmin') {
      localStorage.setItem('zerdyUserRole', data.user?.user_metadata['role'] as string)
      this._Router.navigate(['/admindashboard'])
      }
      else {

        this._Router.navigate(['/dashboard'])
      }
    }

  }

}
