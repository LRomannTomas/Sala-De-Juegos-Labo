import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
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
}
