import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  sb = inject(SupabaseService);

  constructor() {}

  async traerTodosLosMensajes() {
    const { data } = await this.sb.supabase.from("chat").select("id_usuario, usuario, mensaje, fecha");
    const mensajes = data as any[];
    return mensajes;
  }

  async crearMensaje(id_usuario: number, usuario: string, mensaje: string) {
  const { data, error } = await this.sb.supabase
    .from("chat")
    .insert({ id_usuario, usuario, mensaje })
    .select(); 

  return { data, error };
}

}
