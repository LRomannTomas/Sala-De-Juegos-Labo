export class Usuario {
  constructor(
    public nombre: string,
    public apellido: string,
    public edad: number,
    public correo: string,
    public auth_id?: string,   
    public id?: number         
  ) {}
}
