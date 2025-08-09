import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { order } from './interface';
import { CartService } from '../../../services/cart.service';
import { CommonModule } from '@angular/common';
import { StripeService } from '../../../services/stripe.service';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink,CommonModule,ReactiveFormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  cartOrders: order[] = []
  loading: boolean = true
  totalPrice: number = 0
  addressForm!: FormGroup;

  constructor(private _cartServices: CartService,private _stripeService:StripeService,private fb: FormBuilder) { }

  ngOnInit(): void{
    this.getOrders()
     this.addressForm = this.fb.group({
      address: [
        '',
        [
          Validators.required,
          Validators.minLength(20),
          this.addressValidator
        ]
      ]
    });
  }

   get address(): any {
    return this.addressForm.get('address');
  }

  // ✅ Custom validator to check address format
  addressValidator(control: AbstractControl) {
     const value = control.value?.trim();
  if (!value) return null;

  const hasNumber = /\d/.test(value);              // any digit
  const hasWord = /[a-zA-Z]/.test(value);          // any letter
  const hasMultipleLines = value.split('\n').length >= 3;

  const isValid = hasNumber && hasWord && hasMultipleLines;
  return isValid ? null : { invalidFormat: true };
  }


  getOrders() {
    this._cartServices.getCartByUser().then((data) => {
      this.totalPrice=0
      this.cartOrders = data
      this.loading = false
      this.cartOrders.forEach((el => {
        this.totalPrice+=el.totalPrice
      }))
    })
  }

  deleteCartOrder(id:any) {
    this._cartServices.deleteCartItem(id).then(() => {
      this.getOrders()
    })
  }

  pay() {
    localStorage.setItem('payment-In-Progress','true')
    localStorage.setItem('address',this.address.value)
    this._stripeService.pay('Prouct',this.totalPrice)
  }
}
