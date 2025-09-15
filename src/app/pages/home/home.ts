import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth';


@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  auth = inject(AuthService);
}
