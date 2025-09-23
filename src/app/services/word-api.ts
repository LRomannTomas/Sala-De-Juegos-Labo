import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WordApi {
  private jsonFileUrl = "json/words.json";

  constructor() { }

  async obtenerPalabras(): Promise<string[]> {
    const response = await fetch(this.jsonFileUrl);
    const data = await response.json();
    return data.map((word: string) =>
      word
        .replace(/[áéíóúÁÉÍÓÚ]/g, letra => ({
          'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
          'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U'
        }[letra] || letra))
        .toUpperCase()
    );
  }

  async randomizarPalabras(): Promise<string> {
    const palabras = await this.obtenerPalabras();
    const palabraRandom = palabras[Math.floor(Math.random() * palabras.length)];
    return palabraRandom;
  }
}
