import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  standalone : true

})
export class Navbar {
  auth = inject(AuthService);

  isMenuOpen: boolean = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  salir() {
    this.auth.cerrarSesion()
  }
}
