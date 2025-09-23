import { Component, inject, OnInit } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { SupabaseService } from '../../services/supabase';
import { AuthService } from '../../services/auth';
import { Juegos } from '../../services/juegos';
import { RandomNumbers } from '../../services/random-numbers';


@Component({
  selector: 'app-mayor-menor',
  imports: [Navbar],
  templateUrl: './mayor-menor.html',
  styleUrl: './mayor-menor.css'
})
export class MayorMenor implements OnInit {
  sb = inject(SupabaseService);
  auth = inject(AuthService);
  database_juegos = inject(Juegos);
  randomNumber = inject(RandomNumbers);

  play: boolean = false;
  max_intentos: number = 10;
  cartas_acertadas: number = 0;
  carta_actual: number = 0;
  url_baraja!: string;
  url_cartas!: string;

  id: string = "";
  usuario: string = "";

  imagenes: string[] = [];

  async ngOnInit() {
    await this.obtenerIdYNombre();
    await this.precargaDeImagenes();
  }

  async obtenerIdYNombre() {
    await this.auth.getUsuarioActual().then(async(usuario) => {
      if (usuario) {
        const data_user = await this.sb.supabase.from("usuarios").select("id, nombre").eq("correo", usuario.email);
        this.id = data_user.data![0].id;
        this.usuario = data_user.data![0].nombre;
      }
    })
  }

  jugar() {
    this.carta_actual = this.randomNumber.getRandomNumber(1, 12);
    this.url_cartas = this.imagenes[this.carta_actual];
    this.play = true;
  }

  elegirValorDeCarta(eleccion: "mayor" | "menor") {
    let nueva_carta = this.randomNumber.getRandomNumber(1, 12);

    //Para evitar repetir la carta, dado que no hay un botón de empate
    do {
      nueva_carta = this.randomNumber.getRandomNumber(1, 12);
    } while (nueva_carta === this.carta_actual);

    const acierto = (eleccion === 'mayor' && nueva_carta > this.carta_actual) ||
      (eleccion === 'menor' && nueva_carta < this.carta_actual);

    if (acierto) {
      this.cartas_acertadas++;
    } else {
      this.max_intentos--;
    }

    if(this.max_intentos <= 0) {
      this.finalizarJuego();
    }

    this.carta_actual = nueva_carta;
    this.url_cartas = this.imagenes[nueva_carta];
  }

  async finalizarJuego() {
    const puntaje_actual = await this.database_juegos.obtenerMayorOMenor(Number(this.id));

    if(!puntaje_actual || puntaje_actual.length === 0) {
      this.database_juegos.guardarMayorOMenor(Number(this.id), this.usuario, this.cartas_acertadas);
    } else {
        const cartas_anteriores = puntaje_actual[0].cartas_acertadas;
        if(this.cartas_acertadas > cartas_anteriores) {
          this.database_juegos.actualizarMayorOMenor(Number(this.id), this.cartas_acertadas);
      }
    }
  }

  resetear() {
    this.max_intentos = 10;
    this.cartas_acertadas = 0;
    this.carta_actual = 0;
    this.url_cartas = "";
    this.play = false;
  }

  async precargaDeImagenes() {
    const cargarImagen = (src: string) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve();
        img.onerror = () => reject();
      });
    };

    this.imagenes = [
      "images/mayor-menor/baraja.jpg",
      "images/mayor-menor/1.jpg",
      "images/mayor-menor/2.jpg",
      "images/mayor-menor/3.jpg",
      "images/mayor-menor/4.jpg",
      "images/mayor-menor/5.jpg",
      "images/mayor-menor/6.jpg",
      "images/mayor-menor/7.jpg",
      "images/mayor-menor/8.jpg",
      "images/mayor-menor/9.jpg",
      "images/mayor-menor/10.jpg",
      "images/mayor-menor/11.jpg",
      "images/mayor-menor/12.jpg",
    ]
    
    this.url_baraja = this.imagenes[0];
    await Promise.all(this.imagenes.map(src => cargarImagen(src)));
  }
}
