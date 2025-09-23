// src/app/servicios/paises.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Paises{
  private apiURLTraerTodos = 'https://restcountries.com/v3.1/region/america';
  private apiURLTraerPorRegion = 'https://restcountries.com/v3.1/region/';
  private ContadorDePeticiones = 0;
  constructor(private http: HttpClient) { }

  obtenerPaises(): Observable<any[]> {
    this.ContadorDePeticiones++;
    console.log("Peticion nr:"+this.ContadorDePeticiones);
    return this.http.get<any[]>(this.apiURLTraerTodos);
    

  }
   obtenerPaisesPorRegion(region :string ="america"): Observable<any[]> {
    this.ContadorDePeticiones++;
    console.log("Peticion nr:"+this.ContadorDePeticiones);
    return this.http.get<any[]>(this.apiURLTraerPorRegion+region);

  }
}