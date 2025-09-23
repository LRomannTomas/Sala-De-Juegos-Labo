import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase';
import { AuthResponse, User } from '@supabase/supabase-js';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  sb = inject(SupabaseService);
  router = inject(Router);
  usuario_actual : User | null = null;

  constructor() {
    this.sb.supabase.auth.onAuthStateChange((event, session) => {
      session ? this.usuario_actual = session.user : this.usuario_actual = null;
    });
  }


  async getUsuarioActual() {
    const response = await this.sb.supabase.auth.getSession();
    const session = response.data.session;
    return this.usuario_actual = session ? session.user : null;
  }


  async crearCuenta(correo: string, contraseña: string) {
  const { data, error } = await this.sb.supabase.auth.signUp({
    email: correo,
    password: contraseña,
  });

  if (error) {
    console.error("Error en signUp:", error.message);
  }

  return { data, error };
}



  async iniciarSesion(correo:string, contraseña:string) {
    return await this.sb.supabase.auth.signInWithPassword({
      email: correo,
      password: contraseña
    });
  }


  async cerrarSesion() {
  const { data: { session } } = await this.sb.supabase.auth.getSession();

  if (!session) {
    console.warn("No hay sesión activa, no se puede cerrar sesión.");
    this.router.navigateByUrl("home");
    return;
  }

  const { error } = await this.sb.supabase.auth.signOut();
  if (error) {
    console.error("Error al cerrar sesión:", error.message);
    return;
  }

  console.log("Sesión cerrada correctamente");
  this.router.navigateByUrl("home");
}


}