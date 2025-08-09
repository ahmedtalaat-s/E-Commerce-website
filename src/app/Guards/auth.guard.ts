import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  let currentUser = localStorage.getItem('zerdyUserId')
  const router = inject(Router);

  if (!currentUser) {
  router.navigate(['/sign'])
    return false;
  }
  return true;

};
