import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase';


@Injectable({
  providedIn: 'root'
})
export class Juegos {
  sb = inject(SupabaseService);

  constructor() { }

  //Juegos
  async obtenerTodosLosDatos(juego: string) {
    const { data, error } = await this.sb.supabase.from(`${juego}`).select("*");
    
    if(error) {
      console.log(error);
    }

    return data;
  }

  //Ahorcado
  async obtenerAhorcado(id_usuario: number) {
    const { data, error } = await this.sb.supabase.from("ahorcado").select("tiempo_transcurrido, letras_seleccionadas").eq("id_usuario", id_usuario);
    
    if(error) {
      console.log(error);
    }

    return data;
  }

  async guardarAhorcado(id_usuario: number, usuario:string, tiempo: string, letras: number) {
    const { data, error } = await this.sb.supabase.from("ahorcado").insert({id_usuario: id_usuario, usuario: usuario, tiempo_transcurrido: tiempo, letras_seleccionadas: letras});
      
    if(error) {
      console.log(error);
    }
  }

  async actualizarAhorcado(id_usuario: number, tiempo: string, letras: number) {
    const { data, error } = await this.sb.supabase.from("ahorcado").update({tiempo_transcurrido: tiempo, letras_seleccionadas: letras}).eq("id_usuario", id_usuario);
      
    if(error) {
      console.log(error);
    }
  }

  //Mayor o Menor
  async obtenerMayorOMenor(id_usuario: number) {
    const { data, error } = await this.sb.supabase.from("mayor_menor").select("cartas_acertadas").eq("id_usuario", id_usuario);
    
    if(error) {
      console.log(error);
    }

    return data;
  }

  async guardarMayorOMenor(id_usuario: number, usuario:string, cartas: number) {
    const { data, error } = await this.sb.supabase.from("mayor_menor").insert({id_usuario: id_usuario, usuario: usuario, cartas_acertadas: cartas});
      
    if(error) {
      console.log(error);
    }
  }

  async actualizarMayorOMenor(id_usuario: number, cartas: number) {
    const { data, error } = await this.sb.supabase.from("mayor_menor").update({cartas_acertadas: cartas}).eq("id_usuario", id_usuario);
      
    if(error) {
      console.log(error);
    }
  }

  //Preguntados
  async obtenerPreguntados(id_usuario: number) {
    const { data, error } = await this.sb.supabase.from("preguntados").select("preguntas_acertadas").eq("id_usuario", id_usuario);
    
    if(error) {
      console.log(error);
    }

    return data;
  }

  async guardarPreguntados(id_usuario: number, usuario:string, preguntas: number) {
    const { data, error } = await this.sb.supabase.from("preguntados").insert({id_usuario: id_usuario, usuario: usuario, preguntas_acertadas: preguntas});
      
    if(error) {
      console.log(error);
    }
  }

  async actualizarPreguntados(id_usuario: number, preguntas: number) {
    const { data, error } = await this.sb.supabase.from("preguntados").update({preguntas_acertadas: preguntas}).eq("id_usuario", id_usuario);
      
    if(error) {
      console.log(error);
    }
  }


  //Calculo Mental
  
  async obtenerCalculoMental(id_usuario: number) {
    const { data, error } = await this.sb.supabase.from("calculo_mental").select("calculos_acertados").eq("id_usuario", id_usuario);
    
    if(error) {
      console.log(error);
    }

    return data;
  }

  async guardarCalculoMental(id_usuario: number, usuario:string, calculos: number) {
    const { data, error } = await this.sb.supabase.from("calculo_mental").insert({id_usuario: id_usuario, usuario: usuario, calculos_acertados: calculos});
      
    if(error) {
      console.log(error);
    }
  }

  async actualizarCalculoMental(id_usuario: number, calculos: number) {
    const { data, error } = await this.sb.supabase.from("calculo_mental").update({calculos_acertados: calculos}).eq("id_usuario", id_usuario);
      
    if(error) {
      console.log(error);
    }
  }

}
