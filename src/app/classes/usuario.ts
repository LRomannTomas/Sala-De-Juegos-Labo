export class Usuario {
    id?: number;
    nombre: string;
    apellido: string;
    edad: number;
    correo: string;

    constructor(nombre:string, apellido:string, edad:number = 0, correo:string) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
        this.correo = correo;
    }
}