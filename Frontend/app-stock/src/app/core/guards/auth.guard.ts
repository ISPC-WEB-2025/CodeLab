import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserAuthService } from '../services/user-auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(UserAuthService);
  const router = inject(Router);

  console.log("authGuard invocado!", `isLoggedIn: ${authService.isLoggedIn()}, isAdmin: ${authService.isAdmin()}`);

  if (authService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};