import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase';
import { AuthService } from '../../services/auth';
import { ChatService } from '../../services/chat';
import { Navbar } from '../navbar/navbar';
import { DatePipe } from '@angular/common'; 

@Component({
  selector: 'app-chat',
  imports: [Navbar, FormsModule,DatePipe],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat implements OnInit, OnDestroy{
  sb = inject(SupabaseService);
  auth = inject(AuthService);
  database_chat = inject(ChatService);
  mensajes = signal<any>([]);
  mensaje: string = "";
  id: string = "";
  usuario: string = "";
  mensaje_vacio = signal(false);

  canal: ReturnType<typeof this.sb.supabase.channel> | null = null;

  constructor() {}

  async ngOnInit() {
    await this.obtenerIdYNombre();

    const data_msj = await this.database_chat.traerTodosLosMensajes();
    this.mensajes.set([...data_msj]);

    this.canal = this.sb.supabase.channel("table-db-changes");
    this.canal.on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "chat",
      },
      async (cambios: any) => {
        this.mensajes.update((valor_actual) => [...valor_actual, cambios.new]);
      }
    );
    this.canal.subscribe();
  }

  ngOnDestroy() {
    if (this.canal) {
      this.canal.unsubscribe();
    }
  }

  async obtenerIdYNombre() {
  const usuario = await this.auth.getUsuarioActual();
  if (!usuario) {
    console.error("No hay usuario autenticado");
    return;
  }

  const { data, error } = await this.sb.supabase
    .from("usuarios")
    .select("id, nombre")
    .eq("correo", usuario.email)
    .maybeSingle(); 

  if (error) {
    console.error("Error obteniendo usuario:", error.message);
    return;
  }

  if (!data) {
    console.error("No se encontró el usuario en la tabla usuarios");
    return;
  }

  this.id = data.id;
  this.usuario = data.nombre;
}

  async enviarMensaje() {
  if (this.mensaje.trim()) {
    const { data, error } = await this.database_chat.crearMensaje(Number(this.id), this.usuario, this.mensaje);

    if (!error && data) {
      this.mensajes.update((actual) => [...actual, data[0]]); 
    }

    this.mensaje = "";
    this.mensaje_vacio.set(false);
  } else {
    this.mensaje_vacio.set(true);
  }
}

}
