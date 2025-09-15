import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const loginGuard: CanActivateFn = async (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const usuario_actual = await auth.getUsuarioActual();

  return usuario_actual !== null ? true : router.navigateByUrl("/login");
};
