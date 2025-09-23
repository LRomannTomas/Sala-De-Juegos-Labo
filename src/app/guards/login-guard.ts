
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const loginGuard: CanActivateFn = async (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const user = await auth.getUsuarioActual();
  if (user) {
    return true; 
  } else {
    router.navigateByUrl('/login'); 
    return false;
  }
};
