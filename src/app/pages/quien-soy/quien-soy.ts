import { Component, inject, signal } from '@angular/core';
import { GithubService } from '../../services/github';

@Component({
  selector: 'app-quien-soy',
  imports: [],
  templateUrl: './quien-soy.html',
  styleUrls: ['./quien-soy.css']
})
export class QuienSoy
{
  gh = inject(GithubService);
  miData:any;
  explicacionVisible:boolean = false;

  async ngOnInit() {
    const observable = this.gh.getUser("LRomannTomas");
    const suscripcion = observable.subscribe((data) => {
      this.miData = data;
      suscripcion.unsubscribe();
    })
  }

  cambiarVisibilidadExplicacion() {
    this.explicacionVisible = !this.explicacionVisible;
  }
  
}
