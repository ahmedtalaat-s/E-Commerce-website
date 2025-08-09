import { Injectable } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { environment } from '../../environments/supaenvironment';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  constructor() { }
  stripePromise = loadStripe('pk_test_51Rrw3OPBLdzegK86pOjpGPVHBChGeq977ORAy9aU6fHkwBTHymMCtVPdRGbTx5JOxfsZQVg2ZmTUEkqVfi7fdQ4z00sqWJlfwZ'); // your publishable key (NOT secret)

async  pay(productName: string, amount: number) {
  const res = await fetch('https://kyelptznvpcjnvkwdvve.supabase.co/functions/v1/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json','apikey': environment.supabaseKey,
  'Authorization': `Bearer ${environment.supabaseKey}`, },
    body: JSON.stringify({ productName, amount: amount*100 }),
  });

  const data = await res.json();

  if (data.url) {
    window.location.href = data.url;
  } else {
    alert('Payment failed: ' + data.error);
  }
}
}
