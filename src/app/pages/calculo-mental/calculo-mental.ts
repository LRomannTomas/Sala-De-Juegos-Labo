import { Component, inject, OnInit } from '@angular/core';
import { trigger, transition, animate, keyframes, style } from '@angular/animations';
import { Navbar } from '../navbar/navbar';
import { SupabaseService } from '../../services/supabase';
import { AuthService } from '../../services/auth';
import { Juegos } from '../../services/juegos';
import { RandomNumbers } from '../../services/random-numbers';


@Component({
  selector: 'app-calculo-mental',
  imports: [Navbar],
  templateUrl: './calculo-mental.html',
  styleUrl: './calculo-mental.css',
  animations: [
    trigger('shock', [
      transition(':enter', [
        animate('500ms', keyframes([
          style({ transform: 'translateX(0)', offset: 0 }),
          style({ transform: 'translateX(-10px)', offset: 0.1 }),
          style({ transform: 'translateX(10px)', offset: 0.2 }),
          style({ transform: 'translateX(-10px)', offset: 0.3 }),
          style({ transform: 'translateX(10px)', offset: 0.4 }),
          style({ transform: 'translateX(-6px)', offset: 0.5 }),
          style({ transform: 'translateX(6px)', offset: 0.6 }),
          style({ transform: 'translateX(-4px)', offset: 0.7 }),
          style({ transform: 'translateX(4px)', offset: 0.8 }),
          style({ transform: 'translateX(0)', offset: 1.0 }),
        ]))
      ])
    ])
  ]
})
export class CalculoMental implements OnInit{
  sb = inject(SupabaseService);
  auth = inject(AuthService);
  juegos = inject(Juegos);
  random_number = inject(RandomNumbers);

  play: boolean = false;
  patron_aleatorio: number = 0;
  array: number[] = [];
  resultado: number = 0;
  resultado_string: string = "";
  operacion: string = "";
  opciones: string[] = [];

  tiempo_restante: number = 120;
  temporizador: boolean = false;
  calculos_acertados: number = 0;
  aciertos_consecutivos: number = 0;
  juego_finalizado: boolean = false;
  opcion_seleccionada_actual: string | null = null;
  bloqueo: boolean = false;

  power_ups = {
    eliminar_opcion: { disponible: false },
    agregar_tiempo: { disponible: false },
    acertar: { disponible: false }
  }

  id: string = "";
  usuario: string = "";

  async ngOnInit() {
    await this.obtenerIdYNombre();
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

  formateador = new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  generadorDePatrones() {
    this.play = true;

    if (!this.temporizador) {
      this.iniciarTemporizador();
    }

    this.patron_aleatorio = this.random_number.getRandomNumber(1, 6);

    switch (this.patron_aleatorio) {
      case 1:
        this.generadorNumerosAleatorios(4);
        this.operacion = `${this.array[0]} + ${this.array[1]} * ${this.array[2]} - ${this.array[3]}`;
        this.resultado = (this.array[0] + this.array[1] * this.array[2] - this.array[3]);
        this.optimizarOperaciones();
        break;

      case 2:
        this.generadorNumerosAleatorios(5);
        this.operacion = `${this.array[0]} / ${this.array[1]} * ${this.array[2]} + ${this.array[3]} - ${this.array[4]}`;
        this.resultado = (this.array[0] / this.array[1] * this.array[2] + this.array[3] - this.array[4]);
        this.optimizarOperaciones();
        break;

      case 3:
        this.generadorNumerosAleatorios(4);
        this.operacion = `${this.array[0]} * ${this.array[1]} * ${this.array[2]} / ${this.array[3]}`;
        this.resultado = (this.array[0] * this.array[1] * this.array[2] / this.array[3]);
        this.optimizarOperaciones();
        break;

      case 4:
        this.generadorNumerosAleatorios(3);
        this.operacion = `${this.array[0]} - ${this.array[1]} / ${this.array[2]} + ${73}`;
        this.resultado = (this.array[0] - this.array[1] / this.array[2] + 73);
        this.optimizarOperaciones();
        break;

      case 5:
        this.generadorNumerosAleatorios(2);
        this.operacion = `${this.array[0]} * ${0} + ${this.array[1]} + ${710}`;
        this.resultado = (this.array[0] * 0 + this.array[1] + 710);
        this.optimizarOperaciones();
        break;

      case 6:
        this.generadorNumerosAleatorios(7);
        this.operacion = `${this.array[0]} - ${this.array[1]} - ${this.array[2]} + ${this.array[3]} - ${this.array[4]} * ${this.array[5]} / ${this.array[6]}`;
        this.resultado = (this.array[0] - this.array[1] - this.array[2] + this.array[3] - this.array[4] * this.array[5] / this.array[6]);
        this.optimizarOperaciones();
        break;

      default:
        this.operacion = "Error al generar patrón";
        this.resultado_string = "Error";
    }
  }

  generadorNumerosAleatorios(n: number) {
    this.array = [];
    for (let i = 0; i < n; i++) {
      this.array.push(this.random_number.getRandomNumber(1, 10));
    }
  }

  generadorOpciones(resultado: number) {
    const opcionesSet = new Set<number>();
    opcionesSet.add(resultado);

    while (opcionesSet.size < 3) {
      const error = this.random_number.getRandomNumber(-10, 10);
      const incorrecta = resultado + error;

      if (!opcionesSet.has(incorrecta)) {
        opcionesSet.add(incorrecta);
      }
    }

    const opcionesArray = Array.from(opcionesSet)
      .map(op => this.formateador.format(op))
      .sort(() => Math.random() - 0.5);

    return opcionesArray;
  }

  verificarRespuesta(opcion_seleccionada: string, boton: EventTarget | null) {
    if (this.bloqueo) return;
    this.bloqueo = true;
    this.opcion_seleccionada_actual = opcion_seleccionada;

    const btnElement = boton as HTMLButtonElement;
    if (opcion_seleccionada === this.resultado_string) {
      btnElement.classList.add('correcta');
      this.aciertos_consecutivos++;
      this.calculos_acertados++;

      if (this.aciertos_consecutivos >= 3 && this.power_ups.eliminar_opcion.disponible === false) {
        this.power_ups.eliminar_opcion.disponible = true;
      }

      if (this.aciertos_consecutivos >= 5 && this.power_ups.agregar_tiempo.disponible === false) {
        this.power_ups.agregar_tiempo.disponible = true;
      }

      if (this.aciertos_consecutivos >= 7 && this.power_ups.acertar.disponible === false) {
        this.power_ups.acertar.disponible = true;
      }

    } else {
      btnElement.classList.add('incorrecta');
      this.resetearPowerUps(0);
    }

    setTimeout(() => {
      btnElement.classList.remove('correcta', 'incorrecta');
      this.generadorDePatrones();
      this.bloqueo = false;
      this.opcion_seleccionada_actual = null;
    }, 1000);
  }

  powerUpEliminarOpcion() {
    const incorrectas = this.opciones.filter(op => op !== this.resultado_string);
    const eliminar = incorrectas[this.random_number.getRandomNumber(0, 1)];
    this.opciones = this.opciones.filter(op => op !== eliminar);
    this.resetearPowerUps(3);
  }

  powerUpAgregarTiempo() {
    this.tiempo_restante += 3;
    this.resetearPowerUps(5);
  }

  powerUpAcertar() {
    this.opciones = [this.resultado_string];

    const botones = document.querySelectorAll('.btn_opts') as NodeListOf<HTMLButtonElement>;
    const boton_correcto = Array.from(botones).find(btn => btn.textContent?.trim() === this.resultado_string);
  
    if (boton_correcto) {
      boton_correcto.click();
    }

    this.resetearPowerUps(7);
  }

  iniciarTemporizador() {
    this.temporizador = true;
    const intervalo = setInterval(() => {
      this.tiempo_restante--;
      if (this.tiempo_restante <= 0) {
        clearInterval(intervalo);
        this.finalizarJuego();
      }
    }, 1000);
  }

  async finalizarJuego() {
    this.juego_finalizado = true;

    const puntaje_actual = await this.juegos.obtenerCalculoMental(Number(this.id));

    if(!puntaje_actual || puntaje_actual.length === 0) {
      this.juegos.guardarCalculoMental(Number(this.id), this.usuario, this.calculos_acertados);
    } else {
        const calculos_anteriores = puntaje_actual[0].calculos_acertados;
        if(this.calculos_acertados > calculos_anteriores) {
          this.juegos.actualizarCalculoMental(Number(this.id), this.calculos_acertados);
      }
    }
  }

  resetearPowerUps(cantidad: number) {
    if (cantidad <= 0) {
      this.aciertos_consecutivos = 0;
      this.power_ups.eliminar_opcion.disponible = false;
      this.power_ups.agregar_tiempo.disponible = false;
      this.power_ups.acertar.disponible = false;
    } else {
      this.aciertos_consecutivos -= cantidad;
    }

    if (this.aciertos_consecutivos < 3) {
      this.power_ups.eliminar_opcion.disponible = false;
    }
    if (this.aciertos_consecutivos < 5) {
      this.power_ups.agregar_tiempo.disponible = false;
    }
    if (this.aciertos_consecutivos < 7) {
      this.power_ups.acertar.disponible = false;
    }
  }

  resetear() {
    this.tiempo_restante = 120;
    this.temporizador = false;
    this.calculos_acertados = 0;
    this.juego_finalizado = false;
    this.opcion_seleccionada_actual = null;
    this.bloqueo = false;
    this.opciones = [];
    this.resultado = 0;
    this.resultado_string = "";
    this.operacion = "";
    this.play = false;
    this.resetearPowerUps(0);
  }

  optimizarOperaciones() {
    this.resultado_string = this.formateador.format(this.resultado);
    this.opciones = this.generadorOpciones(this.resultado);
  }
}
