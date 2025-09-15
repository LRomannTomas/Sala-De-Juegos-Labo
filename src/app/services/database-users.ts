import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase';
import { Usuario } from '../classes/usuario';


@Injectable({
  providedIn: 'root'
})
export class DatabaseUsersService {
  sb = inject(SupabaseService)
  constructor() {}

  async listarUsuarios() 
  {
    const {data, error, count, status, statusText} = await this.sb.supabase.from("usuarios").select("*");
    const usuarios = data as Usuario[];
    return usuarios;
  }

  async crearUsuario(usuario: Usuario) {
    const {data, error} = await this.sb.supabase.from("usuarios").insert(usuario);
    console.log(data, error);
  }

  async modificarUsuario(usuario: Usuario) {
    const {data, error} = await this.sb.supabase.from("usuarios").update(usuario).eq("id", usuario.id);
    console.log(data, error);
  }

  async eliminarUsuario(id?: number) {
    if(id === undefined) return;
    const {data, error} = await this.sb.supabase.from("usuarios").delete().eq("id", id);
    console.log(data, error);
  }
}
