import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth';
import { SupabaseService } from '../../services/supabase';
import { Navbar } from '../navbar/navbar';
import { Juegos } from '../../services/juegos';
import { WordApi } from '../../services/word-api';
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-ahorcado',
  imports: [Navbar],
  templateUrl: './ahorcado.html',
  styleUrl: './ahorcado.css'
})
export class Ahorcado implements OnInit{
  sb = inject(SupabaseService);
  auth = inject(AuthService);
  database_juegos = inject(Juegos);

  palabra: string = "";
  cargando_palabra: boolean = false;
  letras_adivinadas: string[] = [];
  letras_utilizadas: string[] = [];

  play: boolean = false;
  fallos: number = 0;
  max_fallos: number = 7;
  url_ahorcado!: string;
  imagenes: string[] = [];
  letras_seleccionadas: number = 0;

  id: string = "";
  usuario: string = "";

  /*Tiempo*/
  inicio!: number;
  tiempoTranscurrido = "00:00:00";
  intervalo!: ReturnType<typeof setInterval>;
  juego_finalizado: number = 0;
  AuthService: any;

  constructor(private wordApiService: WordApi) { }

  async ngOnInit() {
    await this.obtenerIdYNombre();
    await this.precargaDeImagenes();
    await this.fetchPalabraRandom();
  }

  async fetchPalabraRandom() {
    try {
      this.palabra = await this.wordApiService.randomizarPalabras();
    } catch (error) {
      console.error("Error al obtener la palabra", error);
    }
  }

  jugar() {
    this.play = true;

    this.inicio = Date.now();
    this.intervalo = setInterval(() => {
      const msTranscurridos = Date.now() - this.inicio;
      const tiempo = new Date(msTranscurridos);
      this.tiempoTranscurrido = tiempo.toISOString().substring(11, 19);
    }, 1000)
  }

  adivinarLetra(letra: string, evento: Event) {
    if (this.letras_utilizadas.includes(letra)) return;
    this.letras_utilizadas.push(letra);
    this.letras_seleccionadas++;

    const keyb = evento.target as HTMLInputElement;
    keyb.classList.add("utilizada");

    if (this.palabra.includes(letra)) {
      this.letras_adivinadas.push(letra);
      const todas_adivinadas = this.palabra.split('').every(l => this.letras_adivinadas.includes(l));
      if (todas_adivinadas) {
        this.finalizarJuego(true);
      }
    } else {
      this.fallos++;
      this.url_ahorcado = this.imagenes[this.fallos];
      if (this.fallos >= this.max_fallos) {
        this.finalizarJuego(false);
      }
    }
  }

  async obtenerIdYNombre() {
    await this.auth.getUsuarioActual().then(async (usuario: User | null) => {
      if (usuario) {
        const { data } = await this.sb.supabase
          .from("usuarios")
          .select("id, nombre")
          .eq("correo", usuario.email);

        this.id = data![0].id;
        this.usuario = data![0].nombre;
      }
    });
}


  async compararYGuardarPuntaje() {
    const puntaje_actual = await this.database_juegos.obtenerAhorcado(Number(this.id));

    if(!puntaje_actual || puntaje_actual.length === 0) {
      this.database_juegos.guardarAhorcado(Number(this.id), this.usuario, this.tiempoTranscurrido, this.letras_seleccionadas);
    } else {
      const tiempo_actual_segundos = this.convertirTiempoEnSegundos(puntaje_actual[0].tiempo_transcurrido);
      const nuevo_tiempo_segundos = this.convertirTiempoEnSegundos(this.tiempoTranscurrido);

      if(nuevo_tiempo_segundos < tiempo_actual_segundos || (nuevo_tiempo_segundos === tiempo_actual_segundos && this.letras_seleccionadas < puntaje_actual[0].letras_seleccionadas)) {
        this.database_juegos.actualizarAhorcado(Number(this.id), this.tiempoTranscurrido, this.letras_seleccionadas);
      }
    }
  }

  convertirTiempoEnSegundos(tiempo: string): number {
    const [horas, minutos, segundos] = tiempo.split(":").map(Number);
    return horas * 3600 + minutos * 60 + segundos;
  }

  finalizarJuego(resultado: boolean) {
    clearInterval(this.intervalo);
    this.juego_finalizado = resultado ? 1 : 2;
    if (resultado) {
      this.ganarElJuego();
      this.compararYGuardarPuntaje();
    }
  }

  ganarElJuego() {
    this.juego_finalizado = 1;
  }

  async resetear() {
    clearInterval(this.intervalo);
    this.cargando_palabra = true;
    await this.fetchPalabraRandom();
    this.cargando_palabra = false;
    this.letras_adivinadas = [];
    this.letras_utilizadas = [];

    this.play = false;
    this.fallos = 0;
    this.url_ahorcado = this.imagenes[this.fallos];
    this.letras_seleccionadas = 0;

    this.tiempoTranscurrido = "00:00:00";
    this.juego_finalizado = 0;
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
      "images/ahorcado/0_ahorcado.png",
      "images/ahorcado/1_ahorcado.png",
      "images/ahorcado/2_ahorcado.png",
      "images/ahorcado/3_ahorcado.png",
      "images/ahorcado/4_ahorcado.png",
      "images/ahorcado/5_ahorcado.png",
      "images/ahorcado/6_ahorcado.png",
    ]

    this.url_ahorcado = this.imagenes[0];
    await Promise.all(this.imagenes.map(src => cargarImagen(src)));
  }
}
