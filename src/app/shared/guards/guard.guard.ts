import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const guardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isUserConnected()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
