import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Navbar } from '../navbar/navbar';


@Component({
  selector: 'app-home',
  imports: [Navbar],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  auth = inject(AuthService);
}
