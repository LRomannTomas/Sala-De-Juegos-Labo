import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const noLoginGuard: CanActivateFn = async (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const usuario_actual = await auth.getUsuarioActual();

  return usuario_actual !== null ? router.navigateByUrl("/home") : true;
};