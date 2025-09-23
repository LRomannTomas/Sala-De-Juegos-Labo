import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const noLoginGuard: CanActivateFn = async (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const user = await auth.getUsuarioActual();
  if (user) {
    router.navigateByUrl('/home');
    return false;
  } else {
    return true; 
  }
};
