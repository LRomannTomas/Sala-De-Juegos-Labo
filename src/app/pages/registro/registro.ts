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

  registrarse(correo:string, contraseña:string){
    this.auth.crearCuenta(correo, contraseña).then(({ data, error }) => {
      if(data.user != null && data.session != null){
        this.router.navigateByUrl("home");
        const nuevoUsuario = new Usuario(this.nombre, this.apellido, Number(this.edad), this.email);
        this.database.crearUsuario(nuevoUsuario);
      } else {
        this.iRegistro = true;
      }
    });
  }
}
