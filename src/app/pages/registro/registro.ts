import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DatabaseUsersService } from '../../services/database-users';
import { Usuario } from '../../classes/usuario';

@Component({
  selector: 'app-registro',
  imports: [FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro
{
  auth = inject(AuthService);
  router = inject(Router);
  database = inject(DatabaseUsersService);
  isPasswordVisible: boolean = false;
  iRegistro: boolean = false;
  nombre: string = "";
  apellido: string = "";
  edad: string = "";
  email: string = "";
  clave: string = "";

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  registrarse(correo: string, contraseña: string) {
  this.auth.crearCuenta(correo, contraseña).then(async ({ data, error }) => {
    if (error) {
      console.error("Error creando cuenta:", error.message);
      this.iRegistro = true;
      return;
    }

    if (data?.user) {
      const nuevoUsuario = new Usuario(
        this.nombre,
        this.apellido,
        Number(this.edad),
        this.email,
        data.user.id
      );

      const insertado = await this.database.crearUsuario(nuevoUsuario);

      if (insertado) {
        this.router.navigateByUrl("home");
      } else {
        this.iRegistro = true;
      }
      
    } 
    else {
      console.error("No se recibió user en signUp");
      this.iRegistro = true;
    }
  });
}




}
