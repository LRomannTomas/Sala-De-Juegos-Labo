import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgIf],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login 
{
  auth = inject(AuthService);
  router = inject(Router);
  isPasswordVisible: boolean = false;
  iSesion: boolean = false;
  email: string = "";
  clave: string = "";
  mensaje: string = "";

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  loguearse(correo:string, contraseña:string) {
    this.auth.iniciarSesion(correo, contraseña).then(({ data, error }) => {
      if(data.user === null){
        this.iSesion = true;
      } else {
        this.router.navigateByUrl("home");
      }
    });
  }


  rellenarCampos(correo: string, contraseña: string, nombre: string) {
    this.email = correo;
    this.clave = contraseña;
    this.mensaje = `INICIA SESION CON LA CUENTA DE ${nombre}`;
    setTimeout(() => {
      this.mensaje = "";
    }, 4000);
  }

}
