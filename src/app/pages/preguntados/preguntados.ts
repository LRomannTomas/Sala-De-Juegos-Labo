import { Component, inject, OnInit } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { SupabaseService } from '../../services/supabase';
import { AuthService } from '../../services/auth';
import { Juegos } from '../../services/juegos';
import { PreguntadosApiService } from '../../services/preguntados-api.service';


@Component({
  selector: 'app-preguntados',
  imports: [Navbar],
  templateUrl: './preguntados.html',
  styleUrl: './preguntados.css'
})
export class Preguntados implements OnInit {
  sb = inject(SupabaseService);
  auth = inject(AuthService);
  juegos = inject(Juegos);
  apiPreguntados = inject(PreguntadosApiService);


  play: boolean = false;
  pregunta_actual: any = null;
  preguntas: any = [];
  opciones: string[] = [];
  preguntas_acertadas: number = 0;
  juego_finalizado: boolean = false;
  opcion_seleccionada_actual: string | null = null;
  bloqueo: boolean = false;

  id: string = "";
  usuario: string = "";

  async ngOnInit() {
    await this.obtenerIdYNombre();
    await this.cargarPreguntas();
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
    this.play = true;
  }

   async cargarPreguntas() {
    this.preguntas = await this.apiPreguntados.getPreguntas();
    if (this.preguntas.length > 0) {
      this.pregunta_actual = this.preguntas[0];
      this.opciones = this.pregunta_actual.opciones;
    }
  }

  verificarPregunta(opcion_seleccionada: string, boton: EventTarget | null) {
    if(this.bloqueo) return;
    this.bloqueo = true;
    this.opcion_seleccionada_actual = opcion_seleccionada;

    const btnElement = boton as HTMLButtonElement;
    if (opcion_seleccionada === this.pregunta_actual.correct_answer) {
      btnElement.classList.add('correcta');
      this.preguntas_acertadas++;
    } else {
      btnElement.classList.add('incorrecta');
    }

    setTimeout(() => {
      btnElement.classList.remove('correcta', 'incorrecta');
      this.siguientePregunta();
      this.bloqueo = false;
      this.opcion_seleccionada_actual = null;
    }, 1000);
  }

  siguientePregunta() {
    const siguiente = this.preguntas.indexOf(this.pregunta_actual) + 1;
    if (siguiente < this.preguntas.length) {
      this.pregunta_actual = this.preguntas[siguiente];
      this.opciones = this.pregunta_actual.opciones;
    } else {
      this.juego_finalizado = true;
      this.finalizarJuego();
    }
  }

  async finalizarJuego() {
    const puntaje_actual = await this.juegos.obtenerPreguntados(Number(this.id));

    if(!puntaje_actual || puntaje_actual.length === 0) {
      this.juegos.guardarPreguntados(Number(this.id), this.usuario, this.preguntas_acertadas);
    } else {
        const preguntas_anteriores = puntaje_actual[0].preguntas_acertadas;
        if(this.preguntas_acertadas > preguntas_anteriores) {
          this.juegos.actualizarPreguntados(Number(this.id), this.preguntas_acertadas);
      }
    }
  }

  resetear() {
    this.play = false;
    this.pregunta_actual = null;
    this.preguntas = [];
    this.opciones = [];
    this.preguntas_acertadas = 0;
    this.juego_finalizado = false;
    this.cargarPreguntas();
  }


  decodificarHTML(html: string) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }
}