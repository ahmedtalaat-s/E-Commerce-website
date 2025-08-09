import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const paymentGuard: CanActivateFn = (route, state) => {
   let payment = localStorage.getItem('payment-In-Progress')
    const router = inject(Router);

    if (!payment) {
    router.navigate(['/main'])
      return false;
    }
    return true;
};
